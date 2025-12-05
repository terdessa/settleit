import React from 'react';
import { Check, Clock } from 'lucide-react';
import { DisputeStatus } from '../../types';
import { clsx } from 'clsx';

export interface TimelineProps {
  status: DisputeStatus;
  createdAt: Date;
  fundedAt?: Date;
  evidenceSubmittedAt?: Date;
  inReviewAt?: Date;
  resolvedAt?: Date;
}

const timelineSteps = [
  { key: 'created', label: 'Created' },
  { key: 'funded', label: 'Funded' },
  { key: 'evidence', label: 'Evidence Submitted' },
  { key: 'review', label: 'In Review' },
  { key: 'resolved', label: 'Resolved' },
];

export const Timeline: React.FC<TimelineProps> = ({
  status,
  createdAt,
  fundedAt,
  evidenceSubmittedAt,
  inReviewAt,
  resolvedAt,
}) => {
  const getStepStatus = (stepKey: string): 'completed' | 'current' | 'pending' => {
    switch (stepKey) {
      case 'created':
        return 'completed';
      case 'funded':
        if (resolvedAt || inReviewAt || evidenceSubmittedAt || fundedAt) {
          return 'completed';
        }
        if (status === 'Awaiting Funding') {
          return 'current';
        }
        return fundedAt ? 'completed' : 'pending';
      case 'evidence':
        if (resolvedAt || inReviewAt) {
          return 'completed';
        }
        if (status === 'In Review' && evidenceSubmittedAt) {
          return 'completed';
        }
        return evidenceSubmittedAt ? 'completed' : 'pending';
      case 'review':
        if (resolvedAt) {
          return 'completed';
        }
        if (status === 'In Review') {
          return 'current';
        }
        return inReviewAt ? 'completed' : 'pending';
      case 'resolved':
        if (status === 'Resolved') {
          return resolvedAt ? 'completed' : 'current';
        }
        return resolvedAt ? 'completed' : 'pending';
      default:
        return 'pending';
    }
  };

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {timelineSteps.map((step, index) => {
          const stepStatus = getStepStatus(step.key);
          const isLast = index === timelineSteps.length - 1;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={clsx(
                    'flex items-center justify-center w-8 h-8 rounded-full transition-colors',
                    stepStatus === 'completed' &&
                      'bg-green-500 text-white',
                    stepStatus === 'current' &&
                      'bg-primary-600 text-white animate-pulse',
                    stepStatus === 'pending' &&
                      'bg-gray-200 text-gray-400'
                  )}
                >
                  {stepStatus === 'completed' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                </div>
                <span
                  className={clsx(
                    'mt-2 text-xs font-medium text-center max-w-[80px]',
                    stepStatus === 'completed' && 'text-green-600',
                    stepStatus === 'current' && 'text-primary-600',
                    stepStatus === 'pending' && 'text-gray-400'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={clsx(
                    'flex-1 h-0.5 mx-2',
                    stepStatus === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
