import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { usePointsStore } from '@/lib/stores/useWalletPoints';

export function useWalletPoints() {
  const { address, isConnected } = useAccount();
  const setWallet = usePointsStore(state => state.setWallet);

  // Handle wallet connection/disconnection
  useEffect(() => {
    setWallet(address || null);
  }, [address, setWallet]);

  return null;
}
