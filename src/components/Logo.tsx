import React from 'react';
import logoImage from '../assets/logo/logo.png';

export interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={logoImage}
        alt="Settleit Logo"
        className={sizeClasses[size]}
        onError={(e) => {
          // Fallback to SVG if image doesn't load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const fallback = document.createElement('div');
          fallback.className = `${sizeClasses[size]} bg-primary-600 rounded flex items-center justify-center`;
          fallback.innerHTML = '<svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
          target.parentNode?.appendChild(fallback);
        }}
      />
      <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Settleit</span>
    </div>
  );
};
