import { configureChains, createConfig } from 'wagmi';
import { arbitrum } from 'wagmi/chains';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';

const projectId = '1f213e0e67b54cc7008bd3571a1e9770';

const { chains, publicClient } = configureChains(
  [arbitrum],
  [w3mProvider({ projectId })]
);

export { chains };

export const config = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

export const ethereumClient = new EthereumClient(config, chains);