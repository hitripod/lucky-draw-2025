import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useGameStore } from '../../src/store/gameStore';
import { useContract } from '../../src/hooks/useContract';

// Mock contract interactions
vi.mock('../../src/hooks/useContract', () => ({
  useContract: () => ({
    placeBetWithAmount: vi.fn(),
    playerData: { totalBets: 0 },
  }),
}));

describe('Concurrent Player Interactions', () => {
  it('should handle multiple players betting simultaneously', async () => {
    const players = [
      { address: '0x1', betAmount: 10 },
      { address: '0x2', betAmount: 15 },
      { address: '0x3', betAmount: 20 },
    ];
    
    const { result } = renderHook(() => useGameStore());
    
    // Add all players
    act(() => {
      players.forEach(player => {
        result.current.addPlayer(player.address);
      });
    });
    
    // Simulate concurrent bets
    await act(async () => {
      await Promise.all(
        players.map(player => 
          result.current.updatePlayerBet(player.address, player.betAmount)
        )
      );
    });
    
    // Verify pool amount
    const totalBets = players.reduce((sum, p) => sum + p.betAmount, 0);
    expect(result.current.poolAmount).toBe(totalBets);
    
    // Verify individual player states
    players.forEach(player => {
      const playerState = result.current.players.find(p => p.address === player.address);
      expect(playerState?.totalBets).toBe(player.betAmount);
    });
  });

  it('should maintain consistency during rapid state updates', async () => {
    const { result } = renderHook(() => useGameStore());
    const player = '0x1';
    const updates = 10;
    const betAmount = 5;
    
    act(() => {
      result.current.addPlayer(player);
    });
    
    // Simulate rapid consecutive bets
    await act(async () => {
      await Promise.all(
        Array(updates).fill(0).map(() => 
          result.current.updatePlayerBet(player, betAmount)
        )
      );
    });
    
    const playerState = result.current.players.find(p => p.address === player);
    expect(playerState?.totalBets).toBe(betAmount * updates);
    expect(result.current.poolAmount).toBe(betAmount * updates);
  });
});