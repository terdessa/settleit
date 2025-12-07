import { create } from 'zustand';
import { Dispute, DisputeStatus } from '../types';

interface DisputesState {
  disputes: Dispute[];
  isLoading: boolean;
  setDisputes: (disputes: Dispute[]) => void;
  addDispute: (dispute: Dispute) => void;
  updateDispute: (id: string, updates: Partial<Dispute>) => void;
  getDisputeById: (id: string) => Dispute | undefined;
  getUserDisputes: (userId: string) => Dispute[];
  getValidatorDisputes: (validatorId: string, status?: DisputeStatus) => Dispute[];
  filterDisputes: (predicate: (dispute: Dispute) => boolean) => Dispute[];
  fetchDisputes: () => Promise<void>;
  fetchDispute: (id: string) => Promise<Dispute | null>;
}

const API_BASE = 'http://localhost:8000/api/disputes';

// Helper to convert API response to Dispute
const convertApiDispute = (d: any): Dispute => ({
  id: d.id,
  title: d.title,
  type: d.type as 'Promise' | 'Bet',
  description: d.description,
  creatorId: d.creator_id,
  opponentId: d.opponent_id,
  creatorPosition: d.creator_position,
  opponentPosition: d.opponent_position,
  validatorId: d.validator_id,
  validatorType: d.validator_type as 'human' | 'ai',
  resolutionMethod: d.resolution_method as 'ai' | 'human',
  status: d.status as DisputeStatus,
  stakeAmount: d.stake_amount,
  opponentStakeAmount: d.opponent_stake_amount,
  token: d.token,
  creatorWallet: d.creator_wallet,
  opponentWallet: d.opponent_wallet,
  escrowTxId: d.escrow_tx_id,
  payoutTxId: d.payout_tx_id,
  neofsObjectId: d.neofs_object_id,
  deadline: d.deadline ? new Date(d.deadline) : undefined,
  evidenceRequirements: d.evidence_requirements,
  evidence: d.evidence.map((e: any) => ({
    id: e.id,
    disputeId: d.id,
    type: e.type,
    content: e.content,
    submittedBy: e.submitted_by,
    timestamp: new Date(e.timestamp),
    description: e.description,
  })),
  decision: d.decision ? {
    winner: d.decision.winner ? (d.decision.winner as 'creator' | 'opponent') : undefined,
    reason: d.decision.reason,
    decidedAt: new Date(d.decision.decided_at),
    decidedBy: d.decision.decided_by,
  } : undefined,
  createdAt: new Date(d.created_at),
  fundedAt: d.funded_at ? new Date(d.funded_at) : undefined,
  evidenceSubmittedAt: d.evidence_submitted_at ? new Date(d.evidence_submitted_at) : undefined,
  inReviewAt: d.in_review_at ? new Date(d.in_review_at) : undefined,
  resolvedAt: d.resolved_at ? new Date(d.resolved_at) : undefined,
});

export const useDisputesStore = create<DisputesState>((set, get) => ({
  disputes: [],
  isLoading: false,
  setDisputes: (disputes) => set({ disputes }),
  addDispute: (dispute) =>
    set((state) => ({
      disputes: [...state.disputes, dispute],
    })),
  updateDispute: async (id, updates) => {
    // Update locally first
    set((state) => ({
      disputes: state.disputes.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    }));

    // Sync with backend
    try {
      const dispute = get().disputes.find((d) => d.id === id);
      if (!dispute) return;

      const payload: any = { ...updates };
      if (payload.decision) {
        payload.decision = {
          winner: payload.decision.winner,
          reason: payload.decision.reason,
          decidedAt: payload.decision.decidedAt.toISOString(),
          decidedBy: payload.decision.decidedBy,
        };
      }
      if (payload.deadline) {
        payload.deadline = payload.deadline.toISOString();
      }

      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updated = await response.json();
        const converted = convertApiDispute(updated);
        set((state) => ({
          disputes: state.disputes.map((d) => (d.id === id ? converted : d)),
        }));
      }
    } catch (error) {
      console.error('Failed to sync dispute update:', error);
    }
  },
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
  fetchDisputes: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(API_BASE);
      if (response.ok) {
        const disputes = await response.json();
        const converted = disputes.map(convertApiDispute);
        set({ disputes: converted });
      }
    } catch (error) {
      console.error('Failed to fetch disputes:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  fetchDispute: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`);
      if (response.ok) {
        const dispute = await response.json();
        const converted = convertApiDispute(dispute);
        set((state) => {
          const existing = state.disputes.find((d) => d.id === id);
          if (existing) {
            return {
              disputes: state.disputes.map((d) => (d.id === id ? converted : d)),
            };
          }
          return { disputes: [...state.disputes, converted] };
        });
        return converted;
      }
    } catch (error) {
      console.error('Failed to fetch dispute:', error);
    }
    return null;
  },
}));
