import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useBalance } from './useBalance';

export const SYMBOLS = ['🤡', '🗿', '⛩️', '💎', '🚀'];
export const MIN_BET = 0.5;
export const MAX_BET = 100;

export function useSlotMachine(address: string | undefined) {
  const [reels, setReels] = useState(['❓', '❓', '❓']);
  const [spinning, setSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState(MIN_BET);
  const { updateWinner, updatePool, updatePlayerBet } = useGameStore();
  const { hasEnoughBalance } = useBalance(address);

  const spin = () => {
    if (!address || spinning || !hasEnoughBalance(betAmount)) return;

    setSpinning(true);
    updatePlayerBet(address, betAmount);
    updatePool(betAmount);
    
    const spinInterval = setInterval(() => {
      setReels(reels.map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]));
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      const finalReels = Array(3)
        .fill(0)
        .map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
      
      setReels(finalReels);
      setSpinning(false);

      if (finalReels.every((symbol) => symbol === finalReels[0])) {
        setTimeout(() => {
          const poolAmount = useGameStore.getState().poolAmount;
          updateWinner(address, poolAmount);
        }, 1500);
      }
    }, 2000);
  };

  return {
    reels,
    spinning,
    betAmount,
    setBetAmount,
    spin,
    MIN_BET,
    MAX_BET,
  };
}