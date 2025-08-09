import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletPoints {
  totalPoints: number;
  gamesPlayed: number;
  lastUpdated: number;
}

interface PointsState {
  currentWallet: string | null;
  walletPoints: Record<string, WalletPoints>;
  totalPoints: number;
  gamesPlayed: number;
  setWallet: (address: string | null) => void;
  addPoints: (points: number) => void;
  resetCurrentWallet: () => void;
  getTotalPoints: () => number;
  incrementGamesPlayed: () => void;
  loadWalletPoints: (address: string) => void;
}

const DEFAULT_WALLET_STATE: WalletPoints = {
  totalPoints: 0,
  gamesPlayed: 0,
  lastUpdated: 0,
};

export const usePointsStore = create<PointsState>()(
  persist(
    (set, get) => ({
      currentWallet: null,
      walletPoints: {},
      totalPoints: 0,
      gamesPlayed: 0,
      
      setWallet: (address) => {
        if (!address) {
          // When disconnecting, save current state to walletPoints
          const { currentWallet, totalPoints, gamesPlayed } = get();
          if (currentWallet) {
            set((state) => ({
              walletPoints: {
                ...state.walletPoints,
                [currentWallet]: {
                  totalPoints,
                  gamesPlayed,
                  lastUpdated: Date.now(),
                }
              }
            }));
          }
          // Reset current state
          set({ 
            currentWallet: null,
            totalPoints: 0,
            gamesPlayed: 0
          });
        } else {
          // When connecting, load saved state if it exists
          const savedState = get().walletPoints[address] || DEFAULT_WALLET_STATE;
          set({ 
            currentWallet: address,
            totalPoints: savedState.totalPoints,
            gamesPlayed: savedState.gamesPlayed
          });
        }
      },

      addPoints: (points) => {
        const { currentWallet } = get();
        if (!currentWallet) return;

        set((state) => {
          const newTotal = state.totalPoints + points;
          return {
            totalPoints: newTotal,
            walletPoints: {
              ...state.walletPoints,
              [currentWallet]: {
                totalPoints: newTotal,
                gamesPlayed: state.gamesPlayed,
                lastUpdated: Date.now(),
              }
            }
          };
        });
      },

      resetCurrentWallet: () => {
        const { currentWallet } = get();
        if (!currentWallet) return;

        set((state) => ({
          totalPoints: 0,
          gamesPlayed: 0,
          walletPoints: {
            ...state.walletPoints,
            [currentWallet]: DEFAULT_WALLET_STATE
          }
        }));
      },

      getTotalPoints: () => get().totalPoints,

      incrementGamesPlayed: () => {
        const { currentWallet } = get();
        if (!currentWallet) return;

        set((state) => {
          const newGamesPlayed = state.gamesPlayed + 1;
          return {
            gamesPlayed: newGamesPlayed,
            walletPoints: {
              ...state.walletPoints,
              [currentWallet]: {
                ...state.walletPoints[currentWallet],
                gamesPlayed: newGamesPlayed,
                lastUpdated: Date.now(),
              }
            }
          };
        });
      },

      loadWalletPoints: (address) => {
        const savedState = get().walletPoints[address];
        if (savedState) {
          set({
            currentWallet: address,
            totalPoints: savedState.totalPoints,
            gamesPlayed: savedState.gamesPlayed
          });
        }
      },
    }),
    {
      name: 'synqtra-wallet-points',
    }
  ));
