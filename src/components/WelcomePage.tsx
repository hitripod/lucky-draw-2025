import React from 'react';
import { Coins, Info } from 'lucide-react';
import { Card } from './ui/Card';
import { useWalletConnection } from '../hooks/useWalletConnection';

export function WelcomePage() {
  const { error, isLoading } = useWalletConnection();

  return (
    <div className="min-h-screen bg-game-bg bg-gradient-to-b from-game-bg to-game-secondary p-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <Card title="Welcome to Lucky Draw" icon={Coins}>
          <div className="space-y-4 text-white/80">
            <p className="flex items-start gap-2">
              <Info className="w-5 h-5 text-game-accent shrink-0 mt-1" />
              <span>
                Get ready to experience the excitement, where every spin is a chance to win pool prizes. 
                Play smart, trust your luck, and most importantly—have fun! Enjoy the game!
              </span>
            </p>
            
            <div className="bg-game-secondary/50 p-4 rounded-lg space-y-2">
              <h3 className="text-game-accent font-semibold">How to Play:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Connect your wallet to start</li>
                <li>Choose your bet amount (0.5 - 100 USDT)</li>
                <li>Spin the reels and match symbols</li>
                <li>Win the accumulated prize pool!</li>
              </ul>
            </div>

            <div className="pt-4 space-y-3">
              <div className="flex justify-center">
                <w3m-button />
              </div>
              
              {isLoading && (
                <p className="text-center text-sm text-white/60">
                  Connecting to wallet...
                </p>
              )}
              
              {error && (
                <p className="text-center text-sm text-red-400">
                  {error.message}
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}