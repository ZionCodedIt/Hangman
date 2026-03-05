import { useState, useEffect } from 'react';
import { HangmanDisplay } from './HangmanDisplay';
import { WordDisplay } from './WordDisplay';
import { GameStats } from './GameStats';
import { LetterButtons } from './LetterButtons';
import { GameMessage } from './GameMessage';
import { WORDS, HANGMAN_IMAGES, MAX_WRONG_GUESSES, POINTS_PER_WIN } from '../constants';

export function HangmanGame() {
  const [currentWord, setCurrentWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');

  // Initialize game on mount
  useEffect(() => {
    initGame();
  }, []);

  // Setup keyboard listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const letter = e.key.toUpperCase();
      if (letter >= 'A' && letter <= 'Z' && !guessedLetters.includes(letter) && !gameOver) {
        handleGuess(letter);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [guessedLetters, gameOver, currentWord]);

  const initGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(randomWord);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameOver(false);
    setMessage('');
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
        setScore(score + POINTS_PER_WIN);
        setMessage('🎉 Congratulations! You won!');
      }
    } else {
      // Wrong guess
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);

      if (newWrongGuesses >= MAX_WRONG_GUESSES) {
        setGameOver(true);
        setMessage(`💀 Game Over! The word was: ${currentWord}`);
      }
    }
  };

  return (
    <div className="game-container">
      <h1> Hangman Game</h1>

      <HangmanDisplay imageSrc={HANGMAN_IMAGES[wrongGuesses]} />
      <WordDisplay word={currentWord} guessedLetters={guessedLetters} />
      <GameStats wrongGuesses={wrongGuesses} score={score} />
      <GameMessage message={message} />
      <LetterButtons
        guessedLetters={guessedLetters}
        currentWord={currentWord}
        gameOver={gameOver}
        onGuess={handleGuess}
      />

      <button className="reset-btn" onClick={initGame}>
        New Game
      </button>
    </div>
  );
}
