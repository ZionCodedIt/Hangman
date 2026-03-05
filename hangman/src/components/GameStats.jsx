export function GameStats({ wrongGuesses, score }) {
  return (
    <div className="game-stats">
      <div>Wrong Guesses: <span>{wrongGuesses}</span>/6</div>
      <div>Score: <span>{score}</span></div>
    </div>
  );
}
