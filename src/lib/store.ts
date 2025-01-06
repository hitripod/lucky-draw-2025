import { create } from 'zustand';

interface Player {
  address: string;
  balance: number;
  totalWins: number;
}

interface GameState {
  players: Player[];
  winners: Player[];
  addPlayer: (address: string) => void;
  removePlayer: (address: string) => void;
  updateWinner: (address: string, amount: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  players: [],
  winners: [],
  addPlayer: (address) =>
    set((state) => ({
      players: [...state.players, { address, balance: 1000, totalWins: 0 }],
    })),
  removePlayer: (address) =>
    set((state) => ({
      players: state.players.filter((player) => player.address !== address),
    })),
  updateWinner: (address, amount) =>
    set((state) => {
      const updatedPlayers = state.players.map((player) =>
        player.address === address
          ? {
              ...player,
              balance: player.balance + amount,
              totalWins: player.totalWins + 1,
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
      
      updatedWinners.sort((a, b) => b.totalWins - a.totalWins);
      
      return {
        players: updatedPlayers,
        winners: updatedWinners,
      };
    }),
}));