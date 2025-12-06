import React from 'react';
import { X, CheckCircle, XCircle, Info, AlertCircle } from 'lucide-react';
import { useUIStore, Toast } from '../../store/uiStore';
import { clsx } from 'clsx';

const ToastIcon: React.FC<{ type: Toast['type'] }> = ({ type }) => {
  const iconClass = 'h-5 w-5';
  switch (type) {
    case 'success':
      return <CheckCircle className={clsx(iconClass, 'text-green-600 dark:text-green-300')} />;
    case 'error':
      return <XCircle className={clsx(iconClass, 'text-red-600 dark:text-red-300')} />;
    case 'warning':
      return <AlertCircle className={clsx(iconClass, 'text-yellow-600 dark:text-yellow-300')} />;
    default:
      return <Info className={clsx(iconClass, 'text-blue-600 dark:text-blue-300')} />;
  }
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            'flex items-center gap-3 p-4 rounded-lg shadow-lg max-w-md animate-in slide-in-from-top-5',
            toast.type === 'success' && 'bg-green-100 dark:bg-green-900/80 border border-green-300 dark:border-green-700',
            toast.type === 'error' && 'bg-red-100 dark:bg-red-900/80 border border-red-300 dark:border-red-700',
            toast.type === 'warning' && 'bg-yellow-100 dark:bg-yellow-900/80 border border-yellow-300 dark:border-yellow-700',
            toast.type === 'info' && 'bg-blue-100 dark:bg-blue-900/80 border border-blue-300 dark:border-blue-700'
          )}
        >
          <ToastIcon type={toast.type} />
          <p
            className={clsx(
              'flex-1 text-sm font-semibold',
              toast.type === 'success' && 'text-green-900 dark:text-green-100',
              toast.type === 'error' && 'text-red-900 dark:text-red-100',
              toast.type === 'warning' && 'text-yellow-900 dark:text-yellow-100',
              toast.type === 'info' && 'text-blue-900 dark:text-blue-100'
            )}
          >
            {toast.message}
          </p>
          <button
            onClick={() => removeToast(toast.id)}
            className={clsx(
              'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none transition-colors',
              toast.type === 'success' && 'hover:text-green-700 dark:hover:text-green-200',
              toast.type === 'error' && 'hover:text-red-700 dark:hover:text-red-200',
              toast.type === 'warning' && 'hover:text-yellow-700 dark:hover:text-yellow-200',
              toast.type === 'info' && 'hover:text-blue-700 dark:hover:text-blue-200'
            )}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
