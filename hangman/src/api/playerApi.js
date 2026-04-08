const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api';

async function parseJson(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message ?? 'The request failed.');
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function fetchPlayer(playerName) {
  const response = await fetch(`${API_BASE_URL}/players/${encodeURIComponent(playerName)}`);
  return parseJson(response);
}

export async function createPlayer(playerName) {
  const response = await fetch(`${API_BASE_URL}/players`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ playerName }),
  });

  return parseJson(response);
}

export async function updatePlayerStats(playerName, stats) {
  const response = await fetch(`${API_BASE_URL}/players/${encodeURIComponent(playerName)}/stats`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stats),
  });

  return parseJson(response);
}