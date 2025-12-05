import { Dispute, DisputeStatus, DisputeType } from '../types';
import { generateMockEvidence } from './mockEvidence';

const disputeTitles = [
  'Delivery Completion Promise',
  'Website Development Bet',
  'Cryptocurrency Price Challenge',
  'Task Completion Agreement',
  'Service Payment Dispute',
];

const disputeDescriptions = [
  'I promised to deliver the package by Friday. Need verification.',
  'Bet on whether the website would be completed by deadline.',
  'Challenge regarding the price prediction of NEO token.',
  'Agreement to complete design work by specified date.',
  'Dispute over payment for completed services.',
];

export const generateMockDisputes = (currentUserId: string): Dispute[] => {
  const disputes: Dispute[] = [];
  const statuses: DisputeStatus[] = [
    'Draft',
    'Awaiting Funding',
    'In Review',
    'Resolved',
    'Awaiting Funding',
    'In Review',
  ];

  statuses.forEach((status, index) => {
    const id = `dispute_${index + 1}`;
    const isCreator = index % 2 === 0;
    const createdAt = new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000);
    const deadline = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);

    let dispute: Dispute = {
      id,
      title: disputeTitles[index % disputeTitles.length],
      type: (['Promise', 'Bet', 'Challenge', 'Other'] as DisputeType[])[
        index % 4
      ],
      description: disputeDescriptions[index % disputeDescriptions.length],
      creatorId: isCreator ? currentUserId : 'user2',
      opponentId: isCreator ? 'user2' : currentUserId,
      validatorId: status === 'In Review' || status === 'Resolved' ? 'user3' : undefined,
      validatorType: 'human',
      status,
      stakeAmount: 100 * (index + 1),
      opponentStakeAmount: 100 * (index + 1),
      token: ['GAS', 'NEO', 'TestToken'][index % 3],
      deadline,
      evidenceRequirements: 'Please provide proof of completion or relevant documentation.',
      evidence: [],
      createdAt,
    };

    // Add evidence for disputes in review or resolved
    if (status === 'In Review' || status === 'Resolved') {
      dispute.evidence = [
        generateMockEvidence(id, dispute.creatorId, 'text'),
        generateMockEvidence(id, dispute.opponentId, 'link'),
      ];
      dispute.evidenceSubmittedAt = new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000);
      dispute.inReviewAt = new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000);
    }

    if (status === 'Awaiting Funding' || status === 'In Review' || status === 'Resolved') {
      dispute.fundedAt = new Date(createdAt.getTime() + 1 * 24 * 60 * 60 * 1000);
    }

    if (status === 'Resolved') {
      dispute.resolvedAt = new Date(createdAt.getTime() + 5 * 24 * 60 * 60 * 1000);
      dispute.decision = {
        winner: isCreator ? 'creator' : 'opponent',
        reason: 'Based on the evidence provided, the decision has been made in favor of the creator.',
        decidedAt: dispute.resolvedAt,
        decidedBy: dispute.validatorId || 'user3',
      };
    }

    disputes.push(dispute);
  });

  return disputes;
};
