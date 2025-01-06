import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { formatAddress } from '../../utils/addressUtils';

interface MoneyParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  size: number;
  symbol: string;
}

export function MoneyRain() {
  const [particles, setParticles] = useState<MoneyParticle[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [winAmount, setWinAmount] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = useGameStore.subscribe((state, prevState) => {
      if (state.poolAmount === 0 && prevState.poolAmount > 0) {
        const winner = state.winners[0];
        if (winner) {
          setWinner(winner.address);
          setWinAmount(prevState.poolAmount);
          setVisible(true);
          createParticles();
          setTimeout(() => setVisible(false), 5000); // Set to exactly 5 seconds
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const createParticles = () => {
    const newParticles: MoneyParticle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -20 - Math.random() * 100,
      rotation: Math.random() * 360,
      size: 20 + Math.random() * 20,
      symbol: ['💵', '💰', '💎', '🪙'][Math.floor(Math.random() * 4)],
    }));
    setParticles(newParticles);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-fall"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: `rotate(${particle.rotation}deg)`,
            fontSize: `${particle.size}px`,
          }}
        >
          {particle.symbol}
        </div>
      ))}
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-game-card/95 p-8 rounded-xl text-center max-w-sm mx-4 animate-popup border-2 border-game-accent">
          <h2 className="text-2xl font-bold text-white mb-2">🎉 Jackpot! 🎉</h2>
          <p className="text-game-accent mb-4">
            Congratulations {formatAddress(winner!)}!
          </p>
          <p className="text-xl font-bold text-white">
            You won {winAmount.toFixed(2)} USDT!
          </p>
        </div>
      </div>
    </div>
  );
}