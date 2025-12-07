import { create } from 'zustand';
import { User } from '../types';

interface UserState {
  currentUser: User | null;
  setUser: (user: User | null) => void;
  setWalletAddress: (address?: string) => void;
  updatePreferences: (preferences: Partial<User>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  setUser: (user) => set({ currentUser: user }),
  setWalletAddress: (address) =>
    set((state) => ({
      currentUser: state.currentUser
        ? { ...state.currentUser, walletAddress: address }
        : state.currentUser,
    })),
  updatePreferences: (preferences) =>
    set((state) => ({
      currentUser: state.currentUser
        ? { ...state.currentUser, ...preferences }
        : null,
    })),
}));
