import { useContractWrite } from 'wagmi';
import { ARBITRUM_CONTRACTS } from '../config/contracts';
import LuckyDrawABI from '../abis/LuckyDraw.json';

export function useAdmin() {
  const { writeAsync: blockPlayer } = useContractWrite({
    address: ARBITRUM_CONTRACTS.LUCKY_DRAW,
    abi: LuckyDrawABI,
    functionName: 'blockPlayer',
  });

  const { writeAsync: unblockPlayer } = useContractWrite({
    address: ARBITRUM_CONTRACTS.LUCKY_DRAW,
    abi: LuckyDrawABI,
    functionName: 'unblockPlayer',
  });

  const { writeAsync: distributeJackpot } = useContractWrite({
    address: ARBITRUM_CONTRACTS.LUCKY_DRAW,
    abi: LuckyDrawABI,
    functionName: 'distributeJackpot',
  });

  return {
    blockPlayer,
    unblockPlayer,
    distributeJackpot,
  };
}