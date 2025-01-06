import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { arbitrum } from 'viem/chains';

const projectId = '1f213e0e67b54cc7008bd3571a1e9770';

const metadata = {
  name: 'Lucky Draw',
  description: 'Decentralized Lucky Draw Game',
  url: 'https://luckydraw.example.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

export const chains = [arbitrum];
export const wagmiConfig = defaultWagmiConfig({ 
  chains, 
  projectId, 
  metadata 
});

// Initialize web3modal
createWeb3Modal({ wagmiConfig, projectId, chains });