import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDisputesStore } from '../store/disputesStore';
import { useUserStore } from '../store/userStore';
import { generateMockDisputes, getCurrentMockUser } from '../mock';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DisputeStatus } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { Clock } from 'lucide-react';

export const Disputes: React.FC = () => {
  const { disputes, setDisputes, getUserDisputes } = useDisputesStore();
  const { currentUser, setUser } = useUserStore();

  useEffect(() => {
    // Initialize mock user and disputes
    if (!currentUser) {
      const mockUser = getCurrentMockUser();
      setUser(mockUser);
    }
    if (disputes.length === 0) {
      const userId = currentUser?.id || 'user1';
      const mockDisputes = generateMockDisputes(userId);
      setDisputes(mockDisputes);
    }
  }, [currentUser, disputes.length, setUser, setDisputes]);

  const userId = currentUser?.id || 'user1';
  const userDisputes = getUserDisputes(userId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">My Disputes</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View all disputes where you are a party (creator or opponent).
        </p>
      </div>

      {userDisputes.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No disputes found.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {userDisputes.map((dispute) => {
            const isCreator = dispute.creatorId === userId;
            const role = isCreator ? 'Creator' : 'Opponent';

            return (
              <Link key={dispute.id} to={`/dispute/${dispute.id}`} className="block">
                <Card className="hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-50">{dispute.title}</h3>
                        <Badge status={dispute.status}>{dispute.status}</Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">({role})</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{dispute.type}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>
                          Stake: {dispute.stakeAmount} {dispute.token}
                        </span>
                        <span>•</span>
                        <span>
                          <Clock className="h-4 w-4 inline mr-1" />
                          Deadline: {formatDistanceToNow(dispute.deadline, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
