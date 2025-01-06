import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SlotMachine } from '../../src/components/SlotMachine';
import { useBalance } from '../../src/hooks/useBalance';
import { useAccount } from 'wagmi';

// Mock hooks
vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

vi.mock('../../src/hooks/useBalance', () => ({
  useBalance: vi.fn(),
}));

describe('SlotMachine', () => {
  beforeEach(() => {
    (useAccount as any).mockReturnValue({
      address: '0x123',
      isConnected: true,
    });
    
    (useBalance as any).mockReturnValue({
      hasEnoughBalance: () => true,
    });
  });

  it('renders correctly', () => {
    render(<SlotMachine />);
    expect(screen.getByText('Lucky Draw')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Spin');
  });

  it('disables spin button when balance is insufficient', () => {
    (useBalance as any).mockReturnValue({
      hasEnoughBalance: () => false,
    });
    
    render(<SlotMachine />);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveTextContent('Insufficient Balance');
  });

  it('updates bet amount when slider changes', () => {
    render(<SlotMachine />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '10' } });
    expect(slider).toHaveValue('10');
  });
});