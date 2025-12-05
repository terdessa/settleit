import React from 'react';
import { X, CheckCircle, XCircle, Info, AlertCircle } from 'lucide-react';
import { useUIStore, Toast } from '../../store/uiStore';
import { clsx } from 'clsx';

const ToastIcon: React.FC<{ type: Toast['type'] }> = ({ type }) => {
  const iconClass = 'h-5 w-5';
  switch (type) {
    case 'success':
      return <CheckCircle className={clsx(iconClass, 'text-green-400')} />;
    case 'error':
      return <XCircle className={clsx(iconClass, 'text-red-400')} />;
    case 'warning':
      return <AlertCircle className={clsx(iconClass, 'text-yellow-400')} />;
    default:
      return <Info className={clsx(iconClass, 'text-blue-400')} />;
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
            toast.type === 'success' && 'bg-green-50 border border-green-200',
            toast.type === 'error' && 'bg-red-50 border border-red-200',
            toast.type === 'warning' && 'bg-yellow-50 border border-yellow-200',
            toast.type === 'info' && 'bg-blue-50 border border-blue-200'
          )}
        >
          <ToastIcon type={toast.type} />
          <p
            className={clsx(
              'flex-1 text-sm font-medium',
              toast.type === 'success' && 'text-green-800',
              toast.type === 'error' && 'text-red-800',
              toast.type === 'warning' && 'text-yellow-800',
              toast.type === 'info' && 'text-blue-800'
            )}
          >
            {toast.message}
          </p>
          <button
            onClick={() => removeToast(toast.id)}
            className={clsx(
              'text-gray-400 hover:text-gray-600 focus:outline-none',
              toast.type === 'success' && 'hover:text-green-600',
              toast.type === 'error' && 'hover:text-red-600',
              toast.type === 'warning' && 'hover:text-yellow-600',
              toast.type === 'info' && 'hover:text-blue-600'
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
