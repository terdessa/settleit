export type DisputeStatus = 'Draft' | 'Awaiting Funding' | 'In Review' | 'Resolved' | 'Cancelled';
export type DisputeType = 'Promise' | 'Bet';
export type EvidenceType = 'text' | 'image' | 'link' | 'file';
export type UserRole = 'user' | 'validator' | 'both';
export type ValidatorType = 'human' | 'ai';
export type ResolutionMethod = 'ai' | 'human';

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
  creatorPosition?: string; // For Bet: what creator thinks (e.g., "fish can fly")
  opponentPosition?: string; // For Bet: what opponent thinks (e.g., "fish cannot fly")
  validatorId?: string;
  validatorType: ValidatorType;
  resolutionMethod?: ResolutionMethod; // How to resolve: 'ai' or 'human'
  status: DisputeStatus;
  stakeAmount: number;
  opponentStakeAmount: number;
  token: string;
  deadline?: Date; // Optional for Promise, not used for Bet
  evidenceRequirements?: string;
  evidence: Evidence[];
  decision?: {
    winner?: 'creator' | 'opponent'; // Optional - AI decisions don't have winners
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
  creatorPosition?: string; // For Bet: what creator thinks
  opponentPosition?: string; // For Bet: what opponent thinks
  stakeAmount: number;
  opponentStakeAmount: number;
  token: string;
  validatorType?: ValidatorType; // For Promise only
  validatorIdentifier?: string; // For Promise only
  deadline?: Date; // Optional for Promise
  evidenceRequirements?: string;
  resolutionMethod?: ResolutionMethod; // 'ai' or 'human' - for both Promise and Bet
}
