import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react-hooks';
import { useContract } from '../../src/hooks/useContract';
import { useContractWrite, useContractRead } from 'wagmi';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(() => ({ address: '0x123' })),
  useContractWrite: vi.fn(),
  useContractRead: vi.fn(),
}));

describe('useContract', () => {
  it('should format bet amount correctly', async () => {
    const mockWriteAsync = vi.fn();
    (useContractWrite as any).mockReturnValue({
      writeAsync: mockWriteAsync,
    });

    const { result } = renderHook(() => useContract());
    await result.current.placeBetWithAmount(10);

    expect(mockWriteAsync).toHaveBeenCalledWith({
      args: ['10000000'], // 10 USDT with 6 decimals
    });
  });

  it('should update nickname', async () => {
    const mockWriteAsync = vi.fn();
    (useContractWrite as any).mockReturnValue({
      writeAsync: mockWriteAsync,
    });

    const { result } = renderHook(() => useContract());
    await result.current.updatePlayerNickname('TestPlayer');

    expect(mockWriteAsync).toHaveBeenCalledWith({
      args: ['TestPlayer'],
    });
  });
});