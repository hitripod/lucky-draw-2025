import React, { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { SlotMachine } from './SlotMachine';
import { PlayersList } from './PlayersList';
import { WinnersList } from './WinnersList';
import { PoolDisplay } from './PoolDisplay';
import { MoneyRain } from './celebrations/MoneyRain';
import { useGameStore } from '../store/gameStore';
import { WelcomePage } from './WelcomePage';
import { Header } from './Header';

export function GameInterface() {
  const { address, isConnected } = useAccount();
  const addPlayer = useGameStore((state) => state.addPlayer);
  const removePlayer = useGameStore((state) => state.removePlayer);

  useEffect(() => {
    if (isConnected && address) {
      addPlayer(address);
    }
    return () => {
      if (address) {
        removePlayer(address);
      }
    };
  }, [isConnected, address]);

  if (!isConnected) {
    return <WelcomePage />;
  }

  return (
    <div className="min-h-screen bg-game-bg bg-gradient-to-b from-game-bg to-game-secondary">
      <Header />
      <div className="p-4 pt-16">
        <div className="max-w-md mx-auto space-y-4">
          <PoolDisplay />
          <SlotMachine />
          <PlayersList />
          <WinnersList />
        </div>
      </div>
      <MoneyRain />
    </div>
  );
}