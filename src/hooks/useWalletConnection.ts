import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useCallback, useEffect, useState } from 'react';

export function useWalletConnection() {
  const { isConnected, address } = useAccount();
  const { connectAsync, connectors, error: connectError, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (isLoading) {
      setError(null);
    }
  }, [isLoading]);

  const handleConnect = useCallback(async (connector: any) => {
    try {
      setError(null);
      
      if (!connector.ready) {
        throw new Error('Please install or unlock your wallet first.');
      }

      await connectAsync({ connector });
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      
      if (err.message.includes('user rejected')) {
        setError(new Error('Connection rejected. Please try again.'));
      } else {
        setError(err);
      }
      
      disconnect();
    }
  }, [connectAsync, disconnect]);

  return {
    isConnected,
    address,
    connect: handleConnect,
    disconnect,
    connectors,
    isLoading,
    error: error || connectError,
    pendingConnector
  };
}