export function LetterButtons({ guessedLetters, currentWord, gameOver, disabled, onGuess }) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="letters">
      {alphabet.map(letter => (
        <button
          key={letter}
          className={`letter-btn ${
            guessedLetters.includes(letter)
              ? currentWord.includes(letter)
                ? 'correct'
                : 'incorrect'
              : ''
          }`}
          onClick={() => onGuess(letter)}
          disabled={guessedLetters.includes(letter) || gameOver || disabled}
        >
          {letter}
        </button>
      ))}
    </div>
  );
}
