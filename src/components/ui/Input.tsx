import React from 'react';
import { clsx } from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  characterCount?: number;
  maxLength?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  characterCount,
  maxLength,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
          error
            ? 'border-red-500 dark:border-red-600 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-600',
          className
        )}
        {...props}
      />
      {(error || helperText || (characterCount !== undefined && maxLength)) && (
        <div className="mt-1 flex justify-between items-center">
          <div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            {helperText && !error && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
            )}
          </div>
          {characterCount !== undefined && maxLength && (
            <p className={clsx(
              'text-sm',
              characterCount > maxLength * 0.9
                ? 'text-orange-600 dark:text-orange-400'
                : 'text-gray-500 dark:text-gray-400'
            )}>
              {characterCount} / {maxLength}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
