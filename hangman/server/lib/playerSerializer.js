export function serializePlayer(player) {
  const wins = Number(player.wins ?? 0);
  const losses = Number(player.losses ?? 0);
  const totalGames = wins + losses;

  return {
    playerName: player.playerName,
    wins,
    losses,
    winningPercentage: totalGames === 0 ? 0 : Number(((wins / totalGames) * 100).toFixed(1)),
  };
}