import { useEffect, useRef, useState } from 'react';
import { HangmanDisplay } from './HangmanDisplay';
import { WordDisplay } from './WordDisplay';
import { GameStats } from './GameStats';
import { LetterButtons } from './LetterButtons';
import { GameMessage } from './GameMessage';
import { HintButton } from './HintButton';
import { createPlayer, fetchPlayer, updatePlayerStats } from '../api/playerApi';
import { WORDS, HANGMAN_IMAGES, MAX_WRONG_GUESSES, POINTS_PER_WIN, WORD_HINTS } from '../constants';

function buildUpdatedPlayer(player, result) {
  const wins = player.wins + (result === 'win' ? 1 : 0);
  const losses = player.losses + (result === 'loss' ? 1 : 0);
  const totalGames = wins + losses;

  return {
    ...player,
    wins,
    losses,
    winningPercentage: totalGames === 0 ? 0 : Number(((wins / totalGames) * 100).toFixed(1)),
  };
}

export function HangmanGame() {
  const [currentWord, setCurrentWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingPlayer, setIsLoadingPlayer] = useState(false);
  const [isSyncingStats, setIsSyncingStats] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [syncError, setSyncError] = useState('');
  const [hintUsed, setHintUsed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const gameResultSentRef = useRef(false);

  // Initialize game on mount
  useEffect(() => {
    initGame();
  }, []);

  // Setup keyboard listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const letter = e.key.toUpperCase();
      if (letter >= 'A' && letter <= 'Z' && !guessedLetters.includes(letter) && !gameOver && isLoggedIn) {
        handleGuess(letter);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [guessedLetters, gameOver, currentWord, isLoggedIn]);

  const initGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(randomWord);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameOver(false);
    setMessage('');
    setSyncError('');
    setHintUsed(false);
    setShowHint(false);
    gameResultSentRef.current = false;
  };

  const handleLogin = async () => {
    const trimmedName = playerName.trim();

    if (!trimmedName) {
      setLoginError('Enter a player name to track your record.');
      return;
    }

    setIsLoadingPlayer(true);
    setLoginError('');

    try {
      const existingPlayer = await fetchPlayer(trimmedName);
      setCurrentPlayer(existingPlayer);
      setIsLoggedIn(true);
      setMessage(`Welcome back, ${existingPlayer.playerName}.`);
    } catch (error) {
      if (error.status !== 404) {
        setLoginError(error.message);
        setIsLoadingPlayer(false);
        return;
      }

      try {
        const newPlayer = await createPlayer(trimmedName);
        setCurrentPlayer(newPlayer);
        setIsLoggedIn(true);
        setMessage(`Welcome, ${newPlayer.playerName}. Your record starts now.`);
      } catch (createError) {
        setLoginError(createError.message);
      }
    } finally {
      setIsLoadingPlayer(false);
    }
  };

  const syncCompletedGame = async (result) => {
    if (!currentPlayer || gameResultSentRef.current) {
      return;
    }

    gameResultSentRef.current = true;
    const optimisticPlayer = buildUpdatedPlayer(currentPlayer, result);

    setCurrentPlayer(optimisticPlayer);
    setIsSyncingStats(true);
    setSyncError('');

    try {
      const savedPlayer = await updatePlayerStats(optimisticPlayer.playerName, {
        wins: optimisticPlayer.wins,
        losses: optimisticPlayer.losses,
      });

      setCurrentPlayer(savedPlayer);
    } catch (error) {
      setSyncError('Stats updated locally but could not be saved to the API.');
    } finally {
      setIsSyncingStats(false);
    }
  };

  const handleGuess = (letter) => {
    if (gameOver || guessedLetters.includes(letter)) return;

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    if (currentWord.includes(letter)) {
      // Correct guess - check if word is complete
      const isWordComplete = currentWord
        .split('')
        .every(l => newGuessedLetters.includes(l));

      if (isWordComplete) {
        setGameOver(true);
        setScore((currentScore) => currentScore + POINTS_PER_WIN);
        setMessage('🎉 Congratulations! You won!');
        void syncCompletedGame('win');
      }
    } else {
      // Wrong guess
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);

      if (newWrongGuesses >= MAX_WRONG_GUESSES) {
        setGameOver(true);
        setMessage(`💀 Game Over! The word was: ${currentWord}`);
        void syncCompletedGame('loss');
      }
    }
  };

  return (
    <div className="game-container">
      <h1> Hangman Game</h1>

      <div className="player-panel">
        {!isLoggedIn ? (
          <>
            <label className="player-label" htmlFor="player-name">Player Name</label>
            <div className="player-login-row">
              <input
                id="player-name"
                className="player-input"
                type="text"
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                placeholder="Enter your name"
                disabled={isLoadingPlayer}
              />
              <button className="login-btn" onClick={handleLogin} disabled={isLoadingPlayer}>
                {isLoadingPlayer ? 'Checking...' : 'Login'}
              </button>
            </div>
            {loginError && <p className="status-error">{loginError}</p>}
          </>
        ) : (
          <div className="player-banner">
            <strong>{currentPlayer.playerName}</strong> is logged in.
          </div>
        )}
      </div>

      <HangmanDisplay imageSrc={HANGMAN_IMAGES[wrongGuesses]} />
      <HintButton
        hint={WORD_HINTS[currentWord]}
        hintUsed={hintUsed}
        showHint={showHint}
        onUseHint={() => { setHintUsed(true); setShowHint(true); }}
      />
      <WordDisplay word={currentWord} guessedLetters={guessedLetters} />
      <GameStats
        wrongGuesses={wrongGuesses}
        score={score}
        player={currentPlayer}
        isSyncingStats={isSyncingStats}
      />
      <GameMessage message={message} />
      {syncError && <p className="status-error">{syncError}</p>}
      <LetterButtons
        guessedLetters={guessedLetters}
        currentWord={currentWord}
        gameOver={gameOver}
        disabled={!isLoggedIn}
        onGuess={handleGuess}
      />

      <button className="reset-btn" onClick={initGame}>
        New Game
      </button>
    </div>
  );
}
