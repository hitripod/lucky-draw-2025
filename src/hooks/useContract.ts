import { useContractWrite, useContractRead, useAccount } from 'wagmi';
import { ARBITRUM_CONTRACTS } from '../config/contracts';
import LuckyDrawABI from '../abis/LuckyDraw.json';
import { parseUnits } from 'viem';

export function useContract() {
  const { address } = useAccount();

  const { data: playerData } = useContractRead({
    address: ARBITRUM_CONTRACTS.LUCKY_DRAW,
    abi: LuckyDrawABI,
    functionName: 'players',
    args: [address],
    enabled: !!address,
  });

  const { writeAsync: placeBet } = useContractWrite({
    address: ARBITRUM_CONTRACTS.LUCKY_DRAW,
    abi: LuckyDrawABI,
    functionName: 'placeBet',
  });

  const { writeAsync: updateNickname } = useContractWrite({
    address: ARBITRUM_CONTRACTS.LUCKY_DRAW,
    abi: LuckyDrawABI,
    functionName: 'updateNickname',
  });

  const placeBetWithAmount = async (amount: number) => {
    const usdtAmount = parseUnits(amount.toString(), 6); // USDT has 6 decimals
    await placeBet({ args: [usdtAmount] });
  };

  const updatePlayerNickname = async (nickname: string) => {
    await updateNickname({ args: [nickname] });
  };

  return {
    playerData,
    placeBetWithAmount,
    updatePlayerNickname,
  };
}