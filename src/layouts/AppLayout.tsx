import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useWallet } from '../hooks';
import { useUIStore } from '../store/uiStore';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/Button';
import {
  LayoutDashboard,
  FileText,
  Scale,
  User,
  Menu,
  X,
  Moon,
  Sun,
  Wallet,
} from 'lucide-react';
import ToastContainer from '../components/ui/Toast';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { setWalletAddress } = useUserStore();
  const { account, connect, disconnect, isConnecting, isNeoLineAvailable, refreshAvailability } = useWallet();
  const { theme, toggleTheme } = useUIStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/disputes', label: 'Disputes', icon: FileText },
    { path: '/validator', label: 'Validator', icon: Scale },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const handleWalletConnect = async () => {
    if (account) {
      disconnect();
      setWalletAddress(undefined);
      useUIStore.getState().addToast('Wallet disconnected', 'info');
      return;
    }

    const available = refreshAvailability();
    if (!available) {
      useUIStore.getState().addToast('Install the NeoLine N3 wallet to connect', 'error');
      return;
    }

    try {
      const address = await connect();
      setWalletAddress(address);
      useUIStore.getState().addToast('Wallet connected', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect wallet';
      useUIStore.getState().addToast(message, 'error');
    }
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center">
              <Logo size="sm" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.path)
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>
              <Button
                variant={account ? 'secondary' : 'primary'}
                size="sm"
                onClick={handleWalletConnect}
                disabled={isConnecting}
              >
                <Wallet className="h-4 w-4 mr-2" />
                {account
                  ? `${account.address.substring(0, 6)}...${account.address.substring(account.address.length - 4)}`
                  : isConnecting
                    ? 'Connecting...'
                    : 'Connect Wallet'}
              </Button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium ${isActive(item.path)
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};
