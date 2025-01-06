import React from 'react';
import { Trophy } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Card } from './ui/Card';
import { formatAddress } from '../utils/addressUtils';

export function WinnersList() {
  const winners = useGameStore((state) => state.winners);

  return (
    <Card title="Top Winners" icon={Trophy}>
      <div className="space-y-2 max-h-[200px] overflow-y-auto">
        {winners.map((winner, index) => (
          <div
            key={winner.address}
            className="bg-game-secondary p-2 rounded-lg flex justify-between items-center border border-game-accent/10"
          >
            <div className="flex items-center gap-2">
              <span className="text-game-highlight text-xs">#{index + 1}</span>
              <span className="text-white text-xs">{formatAddress(winner.address)}</span>
            </div>
            <span className="text-game-accent text-xs">{winner.totalWinnings.toFixed(2)} USDT</span>
          </div>
        ))}
      </div>
    </Card>
  );
}