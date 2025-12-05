import { Evidence, EvidenceType } from '../types';

export const generateMockEvidence = (
  disputeId: string,
  submittedBy: string,
  type: EvidenceType = 'text'
): Evidence => {
  const id = `evid_${Math.random().toString(36).substr(2, 9)}`;
  const timestamps = [
    new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    new Date(Date.now() - 12 * 60 * 60 * 1000),
    new Date(),
  ];

  const evidenceTemplates = {
    text: {
      content: 'I have completed the task as agreed. Here is the proof of completion.',
      description: 'Text evidence submission',
    },
    image: {
      content: 'https://example.com/evidence/screenshot.png',
      description: 'Screenshot evidence',
    },
    link: {
      content: 'https://example.com/proof/transaction',
      description: 'Transaction link',
    },
    file: {
      content: 'evidence_document.pdf',
      description: 'Document evidence',
    },
  };

  const template = evidenceTemplates[type];
  const timestamp = timestamps[Math.floor(Math.random() * timestamps.length)];

  return {
    id,
    disputeId,
    type,
    content: template.content,
    submittedBy,
    timestamp,
    description: template.description,
  };
};
