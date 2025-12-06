import React from 'react';
import { clsx } from 'clsx';
import { DisputeStatus } from '../../types';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  status?: DisputeStatus;
  className?: string;
}

const statusVariantMap: Record<DisputeStatus, BadgeProps['variant']> = {
  'Draft': 'default',
  'Awaiting Funding': 'warning',
  'In Review': 'info',
  'Resolved': 'success',
  'Cancelled': 'error',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  size = 'md',
  status,
  className,
}) => {
  const computedVariant = status ? statusVariantMap[status] : variant || 'default';

  const variantStyles = {
    default: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        variantStyles[computedVariant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};
