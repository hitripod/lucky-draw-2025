import { useGameStore } from '../store/gameStore';

export function useBalance(address: string | undefined) {
  const players = useGameStore((state) => state.players);
  
  const getPlayerBalance = () => {
    if (!address) return 0;
    const player = players.find(p => p.address === address);
    return player?.balance ?? 0;
  };

  const hasEnoughBalance = (amount: number) => {
    const balance = getPlayerBalance();
    return balance >= amount;
  };

  return {
    getPlayerBalance,
    hasEnoughBalance,
  };
}