import { create } from 'zustand';

interface Player {
  address: string;
  balance: number;
  totalBets: number;
  totalWinnings: number;
}

interface GameState {
  players: Player[];
  winners: Player[];
  poolAmount: number;
  addPlayer: (address: string) => void;
  removePlayer: (address: string) => void;
  updatePool: (amount: number) => void;
  updatePlayerBet: (address: string, betAmount: number) => void;
  updateWinner: (address: string, winAmount: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  players: [],
  winners: [],
  poolAmount: 0,
  addPlayer: (address) =>
    set((state) => ({
      players: [...state.players, { 
        address, 
        balance: 1000, 
        totalBets: 0,
        totalWinnings: 0 
      }],
    })),
  removePlayer: (address) =>
    set((state) => ({
      players: state.players.filter((player) => player.address !== address),
    })),
  updatePool: (amount) =>
    set((state) => ({
      poolAmount: state.poolAmount + amount,
    })),
  updatePlayerBet: (address, betAmount) =>
    set((state) => ({
      players: state.players.map((player) =>
        player.address === address
          ? {
              ...player,
              balance: player.balance - betAmount,
              totalBets: player.totalBets + betAmount,
            }
          : player
      ),
    })),
  updateWinner: (address, winAmount) =>
    set((state) => {
      const updatedPlayers = state.players.map((player) =>
        player.address === address
          ? {
              ...player,
              balance: player.balance + winAmount,
              totalWinnings: player.totalWinnings + winAmount,
            }
          : player
      );
      
      const updatedWinners = [...state.winners];
      const winnerIndex = updatedWinners.findIndex(
        (winner) => winner.address === address
      );
      
      if (winnerIndex >= 0) {
        updatedWinners[winnerIndex] = updatedPlayers.find(
          (player) => player.address === address
        )!;
      } else {
        updatedWinners.push(
          updatedPlayers.find((player) => player.address === address)!
        );
      }
      
      updatedWinners.sort((a, b) => b.totalWinnings - a.totalWinnings);
      
      return {
        players: updatedPlayers,
        winners: updatedWinners,
        poolAmount: 0, // Reset pool when someone wins
      };
    }),
}));