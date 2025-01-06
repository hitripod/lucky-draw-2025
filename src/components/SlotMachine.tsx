import React from 'react';
import { useAccount } from 'wagmi';
import { Coins } from 'lucide-react';
import { useSlotMachine } from '../hooks/useSlotMachine';
import { useBalance } from '../hooks/useBalance';
import { Card } from './ui/Card';

export function SlotMachine() {
  const { address } = useAccount();
  const { reels, spinning, betAmount, setBetAmount, spin, MIN_BET, MAX_BET } = useSlotMachine(address);
  const { hasEnoughBalance } = useBalance(address);

  const canSpin = !spinning && address && hasEnoughBalance(betAmount);

  return (
    <Card title="Lucky Draw" icon={Coins}>
      <div className="bg-game-secondary p-4 rounded-lg mb-4 border border-game-accent/10">
        <div className="flex justify-around text-4xl mb-4">
          {reels.map((symbol, index) => (
            <div
              key={index}
              className="w-16 h-16 bg-game-bg rounded-lg flex items-center justify-center border border-game-accent/20"
            >
              {symbol}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="range"
          min={MIN_BET}
          max={MAX_BET}
          step={0.5}
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          className="w-full accent-game-accent"
        />
        <span className="text-white text-sm whitespace-nowrap">{betAmount} USDT</span>
      </div>

      <button
        onClick={spin}
        disabled={!canSpin}
        className={`w-full py-3 px-6 rounded-lg text-white font-bold ${
          !canSpin
            ? 'bg-game-secondary cursor-not-allowed'
            : 'bg-gradient-to-r from-game-accent to-game-highlight hover:from-game-highlight hover:to-game-accent transition-all duration-300'
        }`}
      >
        {spinning ? 'Spinning...' : !hasEnoughBalance(betAmount) ? 'Insufficient Balance' : 'Spin'}
      </button>
    </Card>
  );
}