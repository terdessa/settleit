import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Disputes } from './pages/Disputes';
import { CreateDispute } from './pages/CreateDispute';
import { DisputeDetail } from './pages/DisputeDetail';
import { ValidatorConsole } from './pages/ValidatorConsole';
import { Profile } from './pages/Profile';
import { useUserStore } from './store/userStore';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // For mock purposes, we'll allow access if user exists or create a default user
  const { currentUser, setUser } = useUserStore();
  
  React.useEffect(() => {
    if (!currentUser) {
      // Auto-login with mock user for demo purposes
      const mockUser = {
        id: 'user1',
        displayName: 'Demo User',
        walletAddress: 'NQxX8v...jK9mP2',
        role: 'both' as const,
        isAvailableAsValidator: true,
        language: 'en',
        notificationsEnabled: true,
      };
      setUser(mockUser);
    }
  }, [currentUser, setUser]);

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/disputes"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Disputes />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-dispute"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CreateDispute />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dispute/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DisputeDetail />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/validator"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ValidatorConsole />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
