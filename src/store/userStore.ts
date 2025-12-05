import { create } from 'zustand';
import { User } from '../types';

interface UserState {
  currentUser: User | null;
  isWalletConnected: boolean;
  setUser: (user: User | null) => void;
  connectWallet: () => void;
  disconnectWallet: () => void;
  updatePreferences: (preferences: Partial<User>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  isWalletConnected: false,
  setUser: (user) => set({ currentUser: user }),
  connectWallet: () => set({ isWalletConnected: true }),
  disconnectWallet: () => set({ isWalletConnected: false, currentUser: null }),
  updatePreferences: (preferences) =>
    set((state) => ({
      currentUser: state.currentUser
        ? { ...state.currentUser, ...preferences }
        : null,
    })),
}));
