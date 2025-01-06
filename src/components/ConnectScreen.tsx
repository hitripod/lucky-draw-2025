import React from 'react';
import { Wallet2 } from 'lucide-react';

export function ConnectScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-game-bg bg-gradient-to-b from-game-bg to-game-secondary">
      <Wallet2 className="w-12 h-12 text-game-accent mb-4" />
      <h1 className="text-xl font-bold text-white mb-4 text-center">
        Connect your wallet to play
      </h1>
      <w3m-button />
    </div>
  );
}