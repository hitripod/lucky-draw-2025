import React from 'react';
import { Users } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Card } from './ui/Card';
import { formatAddress } from '../utils/addressUtils';

export function PlayersList() {
  const players = useGameStore((state) => state.players);

  return (
    <Card title="Active Players" icon={Users}>
      <div className="space-y-2 max-h-[200px] overflow-y-auto">
        {players.map((player) => (
          <div
            key={player.address}
            className="bg-game-secondary p-2 rounded-lg flex justify-between items-center border border-game-accent/10"
          >
            <span className="text-white text-xs">{formatAddress(player.address)}</span>
            <div className="text-game-accent text-xs">
              Total Bet: {player.totalBets.toFixed(2)} USDT
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}