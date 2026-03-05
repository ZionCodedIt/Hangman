export function WordDisplay({ word, guessedLetters }) {
  const display = word
    .split('')
    .map(letter => guessedLetters.includes(letter) ? letter : '_')
    .join(' ');

  return <div className="word-display">{display}</div>;
}
