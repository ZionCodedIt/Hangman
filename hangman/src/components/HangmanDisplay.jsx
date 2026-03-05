export function HangmanDisplay({ imageSrc }) {
  return (
    <div className="hangman-display">
      <img
        src={imageSrc}
        alt="Hangman"
        className="hangman-image"
      />
    </div>
  );
}
