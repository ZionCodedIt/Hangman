export function GameStats({ wrongGuesses, score, player, isSyncingStats }) {
  return (
    <div className="game-stats">
      <div className="stat-card">Wrong Guesses: <span>{wrongGuesses}</span>/6</div>
      <div className="stat-card">Score: <span>{score}</span></div>
      <div className="stat-card">
        Player: <span>{player ? player.playerName : 'Guest'}</span>
      </div>
      <div className="stat-card">
        Win Rate: <span>{player ? `${player.winningPercentage.toFixed(1)}%` : '0.0%'}</span>
      </div>
      <div className="stat-card">
        Record: <span>{player ? `${player.wins}-${player.losses}` : '0-0'}</span>
      </div>
      {isSyncingStats && <div className="stat-card sync-status">Syncing stats...</div>}
    </div>
  );
}
