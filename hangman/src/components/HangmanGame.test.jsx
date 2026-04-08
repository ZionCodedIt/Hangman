import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HangmanGame } from './HangmanGame';
import { WORDS } from '../constants';

describe('HangmanGame', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(global, 'fetch');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('logs in an existing player and shows the tracked stats', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        playerName: 'Avery',
        wins: 3,
        losses: 1,
        winningPercentage: 75,
      }),
    });

    render(<HangmanGame />);

    fireEvent.change(screen.getByLabelText(/player name/i), {
      target: { value: 'Avery' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/Welcome back, Avery/i)).toBeInTheDocument();
    expect(screen.getByText(/75.0%/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /login/i })).not.toBeInTheDocument();
  });

  it('updates player stats locally and sends a put request after a win', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(8 / WORDS.length);

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          playerName: 'Mia',
          wins: 1,
          losses: 1,
          winningPercentage: 50,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          playerName: 'Mia',
          wins: 2,
          losses: 1,
          winningPercentage: 66.7,
        }),
      });

    render(<HangmanGame />);

    fireEvent.change(screen.getByLabelText(/player name/i), {
      target: { value: 'Mia' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await screen.findByText(/Welcome back, Mia/i);

    fireEvent.click(screen.getByRole('button', { name: 'A' }));
    fireEvent.click(screen.getByRole('button', { name: 'R' }));
    fireEvent.click(screen.getByRole('button', { name: 'Y' }));

    expect(await screen.findByText(/Congratulations! You won!/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/66.7%/i)).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      'http://localhost:3001/api/players/Mia/stats',
      expect.objectContaining({ method: 'PUT' }),
    );
  });
});