import express from 'express';
import cors from 'cors';

function normalizePlayerName(playerName) {
  return playerName?.trim();
}

function validateStats(stats) {
  return Number.isInteger(stats.wins)
    && Number.isInteger(stats.losses)
    && stats.wins >= 0
    && stats.losses >= 0;
}

export function createApp({ playerStore }) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok' });
  });

  app.get('/api/players/:playerName', async (request, response, next) => {
    try {
      const playerName = normalizePlayerName(request.params.playerName);

      if (!playerName) {
        response.status(400).json({ message: 'Player name is required.' });
        return;
      }

      const player = await playerStore.getPlayer(playerName);

      if (!player) {
        response.status(404).json({ message: 'Player not found.' });
        return;
      }

      response.json(player);
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/players', async (request, response, next) => {
    try {
      const playerName = normalizePlayerName(request.body?.playerName);

      if (!playerName) {
        response.status(400).json({ message: 'Player name is required.' });
        return;
      }

      const existingPlayer = await playerStore.getPlayer(playerName);

      if (existingPlayer) {
        response.status(409).json({ message: 'Player already exists.' });
        return;
      }

      const player = await playerStore.createPlayer(playerName);
      response.status(201).json(player);
    } catch (error) {
      next(error);
    }
  });

  app.put('/api/players/:playerName/stats', async (request, response, next) => {
    try {
      const playerName = normalizePlayerName(request.params.playerName);
      const stats = {
        wins: request.body?.wins,
        losses: request.body?.losses,
      };

      if (!playerName) {
        response.status(400).json({ message: 'Player name is required.' });
        return;
      }

      if (!validateStats(stats)) {
        response.status(400).json({ message: 'Wins and losses must be non-negative integers.' });
        return;
      }

      const player = await playerStore.updatePlayerStats(playerName, stats);
      response.json(player);
    } catch (error) {
      if (error.name === 'ConditionalCheckFailedException') {
        response.status(404).json({ message: 'Player not found.' });
        return;
      }

      next(error);
    }
  });

  app.use((error, _request, response, _next) => {
    console.error(error);
    response.status(500).json({ message: 'Internal server error.' });
  });

  return app;
}