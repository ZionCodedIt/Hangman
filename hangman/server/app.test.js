// @vitest-environment node

import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from './app.js';

function createInMemoryPlayerStore(seedPlayers = []) {
  const players = new Map(seedPlayers.map((player) => [player.playerName, { ...player }]));

  return {
    async getPlayer(playerName) {
      return players.get(playerName) ?? null;
    },

    async createPlayer(playerName) {
      const player = {
        playerName,
        wins: 0,
        losses: 0,
        winningPercentage: 0,
      };

      players.set(playerName, player);
      return player;
    },

    async updatePlayerStats(playerName, stats) {
      if (!players.has(playerName)) {
        const error = new Error('Player not found');
        error.name = 'ConditionalCheckFailedException';
        throw error;
      }

      const player = {
        playerName,
        wins: stats.wins,
        losses: stats.losses,
        winningPercentage: stats.wins + stats.losses === 0
          ? 0
          : Number(((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1)),
      };

      players.set(playerName, player);
      return player;
    },
  };
}

describe('Hangman API', () => {
  it('returns a player when the record exists', async () => {
    const app = createApp({
      playerStore: createInMemoryPlayerStore([
        { playerName: 'Jordan', wins: 4, losses: 2, winningPercentage: 66.7 },
      ]),
    });

    const response = await request(app).get('/api/players/Jordan');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      playerName: 'Jordan',
      wins: 4,
      losses: 2,
      winningPercentage: 66.7,
    });
  });

  it('creates a player when a new name is posted', async () => {
    const app = createApp({ playerStore: createInMemoryPlayerStore() });

    const response = await request(app)
      .post('/api/players')
      .send({ playerName: 'Taylor' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      playerName: 'Taylor',
      wins: 0,
      losses: 0,
      winningPercentage: 0,
    });
  });

  it('updates player stats with a put request', async () => {
    const app = createApp({
      playerStore: createInMemoryPlayerStore([
        { playerName: 'Casey', wins: 1, losses: 1, winningPercentage: 50 },
      ]),
    });

    const response = await request(app)
      .put('/api/players/Casey/stats')
      .send({ wins: 2, losses: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      playerName: 'Casey',
      wins: 2,
      losses: 1,
      winningPercentage: 66.7,
    });
  });
});