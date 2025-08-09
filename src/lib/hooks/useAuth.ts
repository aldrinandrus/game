import { useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useAuthStore } from '../stores/useAuthStore';
import { usePointsStore } from '../stores/useWalletPoints';
import { toast } from '@/hooks/use-toast';

export const useAuth = () => {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  
  const {
    isAuthenticated,
    user,
    isLoading,
    signIn,
    signOut,
    setLoading,
    setProfileNFT
  } = useAuthStore();
  
  const { setWallet } = usePointsStore();

  // Handle wallet connection changes
  useEffect(() => {
    if (isConnected && address) {
      // User connected their wallet
      if (!isAuthenticated) {
        setLoading(true);
        
        // Simulate checking for Profile NFT (replace with actual contract call)
        const checkProfileNFT = async () => {
          try {
            // TODO: Replace with actual contract call to check if user has Profile NFT
            const hasProfileNFT = Math.random() > 0.5; // Random simulation
            
            // Sign in the user
            signIn(address, hasProfileNFT);
            
            // Set wallet in points store
            setWallet(address);
            
            toast({
              title: "Welcome back! 🎉",
              description: `Successfully connected with ${address.slice(0, 6)}...${address.slice(-4)}`,
            });
          } catch (error) {
            console.error('Error checking Profile NFT:', error);
            toast({
              title: "Connection Error",
              description: "Failed to verify your profile. Please try again.",
              variant: "destructive",
            });
          } finally {
            setLoading(false);
          }
        };
        
        checkProfileNFT();
      }
    } else if (!isConnected && isAuthenticated) {
      // User disconnected their wallet
      handleSignOut();
    }
  }, [isConnected, address, isAuthenticated]);

  // Sign In function
  const handleSignIn = async () => {
    try {
      setLoading(true);
      
      // Find MetaMask connector
      const metaMask = connectors.find(c => c.id === 'injected');
      if (!metaMask) {
        throw new Error('MetaMask not found');
      }
      
      // Connect to MetaMask
      await connect({ connector: metaMask });
      
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign In Failed",
        description: error?.message || "Failed to connect to MetaMask. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Sign Out function
  const handleSignOut = () => {
    try {
      // Disconnect from wallet
      disconnect();
      
      // Clear authentication state
      signOut();
      
      // Clear wallet points state
      setWallet(null);
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign Out Error",
        description: "Failed to sign out properly. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Create Profile NFT function
  const createProfileNFT = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual NFT minting contract call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate contract call
      
      // Update user profile
      setProfileNFT(true);
      
      toast({
        title: "Profile Created! 🎉",
        description: "Your Profile NFT has been successfully minted!",
      });
      
    } catch (error) {
      console.error('Create Profile NFT error:', error);
      toast({
        title: "Profile Creation Failed",
        description: "Failed to create your Profile NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    isAuthenticated,
    user,
    isLoading: isLoading || isConnecting,
    isConnecting,
    
    // Actions
    signIn: handleSignIn,
    signOut: handleSignOut,
    createProfileNFT,
    
    // Wagmi state
    address,
    isConnected,
  };
}; 