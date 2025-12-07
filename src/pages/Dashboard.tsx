import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useDisputesStore } from '../store/disputesStore';
import { getCurrentMockUser } from '../mock';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Plus, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useWallet } from '../hooks';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, setUser } = useUserStore();
  const { account } = useWallet();
  const { disputes, getUserDisputes, getValidatorDisputes } =
    useDisputesStore();
  const [activeTab, setActiveTab] = useState<'my-disputes' | 'as-validator'>(
    'my-disputes'
  );

  const { fetchDisputes } = useDisputesStore();

  useEffect(() => {
    // Initialize mock user
    if (!currentUser) {
      const mockUser = getCurrentMockUser();
      setUser(mockUser);
    }
    // Fetch disputes from API
    fetchDisputes();
  }, [currentUser, setUser, fetchDisputes]);

  const userId = currentUser?.id || 'user1';
  const myDisputes = getUserDisputes(userId);
  const validatorDisputes = getValidatorDisputes(userId);

  const activeDisputes = myDisputes.filter(
    (d) => d.status !== 'Resolved' && d.status !== 'Cancelled'
  );
  const pendingValidatorDecisions = validatorDisputes.filter(
    (d) => d.status === 'In Review'
  );
  const totalResolved = disputes.filter((d) => d.status === 'Resolved').length;

  const formatDeadline = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const disputesToShow =
    activeTab === 'my-disputes' ? myDisputes : validatorDisputes;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        {!account && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <p className="text-yellow-800 dark:text-yellow-200">
                Connect wallet to start creating disputes
              </p>
            </div>
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
          Hi, {currentUser?.displayName || 'User'}
        </h1>
        {(account?.address || currentUser?.walletAddress) && (
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {account?.address || currentUser?.walletAddress}
          </p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Active</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            {activeDisputes.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Pending</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            {pendingValidatorDecisions.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Resolved</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            {totalResolved}
          </p>
        </Card>
      </div>

      {/* Disputes List */}
      <Card>
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
          <button
            onClick={() => setActiveTab('my-disputes')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'my-disputes'
                ? 'border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50'
              }`}
          >
            My Disputes
          </button>
          <button
            onClick={() => setActiveTab('as-validator')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'as-validator'
                ? 'border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50'
              }`}
          >
            As Validator
          </button>
        </div>

        {disputesToShow.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              {activeTab === 'my-disputes'
                ? 'No disputes yet. Create your first dispute!'
                : 'No disputes to validate.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {disputesToShow.map((dispute) => {
              const isCreator = dispute.creatorId === userId;
              const role = isCreator
                ? 'Creator'
                : dispute.validatorId === userId
                  ? 'Validator'
                  : 'Opponent';

              return (
                <Link
                  key={dispute.id}
                  to={`/dispute/${dispute.id}`}
                  className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                          {dispute.title}
                        </h3>
                        <Badge status={dispute.status}>
                          {dispute.status}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">({role})</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <span>{dispute.stakeAmount} {dispute.token}</span>
                        <span>•</span>
                        <span>{dispute.type}</span>
                        {dispute.deadline && (
                          <>
                            <span>•</span>
                            <span>{formatDeadline(dispute.deadline)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Card>

      {/* Floating Create Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/create-dispute')}
          className="shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Dispute
        </Button>
      </div>
    </div>
  );
};
