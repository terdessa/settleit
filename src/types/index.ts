export type DisputeStatus = 'Draft' | 'Awaiting Funding' | 'In Review' | 'Resolved' | 'Cancelled';
export type DisputeType = 'Promise' | 'Bet' | 'Challenge' | 'Other';
export type EvidenceType = 'text' | 'image' | 'link' | 'file';
export type UserRole = 'user' | 'validator' | 'both';
export type ValidatorType = 'human' | 'ai';

export interface User {
  id: string;
  displayName: string;
  walletAddress?: string;
  role: UserRole;
  bio?: string;
  avatar?: string;
  isAvailableAsValidator: boolean;
  language: string;
  notificationsEnabled: boolean;
}

export interface Party {
  id: string;
  displayName: string;
  walletAddress: string;
}

export interface Evidence {
  id: string;
  disputeId: string;
  type: EvidenceType;
  content: string;
  submittedBy: string;
  timestamp: Date;
  description?: string;
}

export interface Dispute {
  id: string;
  title: string;
  type: DisputeType;
  description: string;
  creatorId: string;
  opponentId: string;
  validatorId?: string;
  validatorType: ValidatorType;
  status: DisputeStatus;
  stakeAmount: number;
  opponentStakeAmount: number;
  token: string;
  deadline: Date;
  evidenceRequirements?: string;
  evidence: Evidence[];
  decision?: {
    winner: 'creator' | 'opponent';
    reason: string;
    decidedAt: Date;
    decidedBy: string;
  };
  createdAt: Date;
  fundedAt?: Date;
  evidenceSubmittedAt?: Date;
  inReviewAt?: Date;
  resolvedAt?: Date;
}

export interface CreateDisputeForm {
  title: string;
  type: DisputeType;
  description: string;
  opponentIdentifier: string;
  stakeAmount: number;
  opponentStakeAmount: number;
  token: string;
  validatorType: ValidatorType;
  validatorIdentifier?: string;
  deadline: Date;
  evidenceRequirements?: string;
}
