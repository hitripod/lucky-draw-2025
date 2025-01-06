import React from 'react';
import { Coins } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Card } from './ui/Card';

export function PoolDisplay() {
  const poolAmount = useGameStore((state) => state.poolAmount);

  return (
    <Card title="Prize Pool" icon={Coins}>
      <div className="bg-game-secondary p-4 rounded-lg text-center border border-game-accent/10">
        <span className="text-2xl font-bold text-white">{poolAmount.toFixed(2)} USDT</span>
      </div>
    </Card>
  );
}