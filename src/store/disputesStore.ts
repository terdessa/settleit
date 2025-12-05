import { create } from 'zustand';
import { Dispute, DisputeStatus } from '../types';

interface DisputesState {
  disputes: Dispute[];
  setDisputes: (disputes: Dispute[]) => void;
  addDispute: (dispute: Dispute) => void;
  updateDispute: (id: string, updates: Partial<Dispute>) => void;
  getDisputeById: (id: string) => Dispute | undefined;
  getUserDisputes: (userId: string) => Dispute[];
  getValidatorDisputes: (validatorId: string, status?: DisputeStatus) => Dispute[];
  filterDisputes: (predicate: (dispute: Dispute) => boolean) => Dispute[];
}

export const useDisputesStore = create<DisputesState>((set, get) => ({
  disputes: [],
  setDisputes: (disputes) => set({ disputes }),
  addDispute: (dispute) =>
    set((state) => ({
      disputes: [...state.disputes, dispute],
    })),
  updateDispute: (id, updates) =>
    set((state) => ({
      disputes: state.disputes.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    })),
  getDisputeById: (id) => {
    return get().disputes.find((d) => d.id === id);
  },
  getUserDisputes: (userId) => {
    return get().disputes.filter(
      (d) => d.creatorId === userId || d.opponentId === userId
    );
  },
  getValidatorDisputes: (validatorId, status) => {
    return get().disputes.filter(
      (d) =>
        d.validatorId === validatorId &&
        (!status || d.status === status)
    );
  },
  filterDisputes: (predicate) => {
    return get().disputes.filter(predicate);
  },
}));
