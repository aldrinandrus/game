import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  address: string;
  hasProfileNFT: boolean;
  lastSignIn: number;
  displayName?: string;
}

interface AuthState {
  // Authentication state
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  
  // Actions
  signIn: (address: string, hasProfileNFT?: boolean) => void;
  signOut: () => void;
  setProfileNFT: (hasNFT: boolean) => void;
  setLoading: (loading: boolean) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  
  // Getters
  getCurrentUser: () => UserProfile | null;
  getIsAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      isLoading: false,

      // Sign In action
      signIn: (address: string, hasProfileNFT = false) => {
        const user: UserProfile = {
          address,
          hasProfileNFT,
          lastSignIn: Date.now(),
          displayName: `${address.slice(0, 6)}...${address.slice(-4)}`
        };

        set({
          isAuthenticated: true,
          user,
          isLoading: false
        });
      },

      // Sign Out action
      signOut: () => {
        set({
          isAuthenticated: false,
          user: null,
          isLoading: false
        });
      },

      // Set Profile NFT status
      setProfileNFT: (hasNFT: boolean) => {
        set((state) => ({
          user: state.user ? { ...state.user, hasProfileNFT: hasNFT } : null
        }));
      },

      // Set loading state
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // Update user profile
      updateUserProfile: (updates: Partial<UserProfile>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null
        }));
      },

      // Getters
      getCurrentUser: () => get().user,
      getIsAuthenticated: () => get().isAuthenticated,
    }),
    {
      name: 'synqtra-auth',
      // Only persist authentication state, not loading state
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
); 