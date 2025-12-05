import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDisputesStore } from '../store/disputesStore';
import { useUserStore } from '../store/userStore';
import { generateMockDisputes, getCurrentMockUser } from '../mock';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { DisputeStatus } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { Search, Clock } from 'lucide-react';

export const ValidatorConsole: React.FC = () => {
  const { disputes, setDisputes, getValidatorDisputes, filterDisputes } =
    useDisputesStore();
  const { currentUser, setUser } = useUserStore();
  const [filterStatus, setFilterStatus] = useState<DisputeStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  const userId = currentUser?.id || 'user3'; // Default to validator user

  // Get disputes where user is validator
  let validatorDisputes = getValidatorDisputes(userId);

  // Apply status filter
  if (filterStatus !== 'all') {
    validatorDisputes = validatorDisputes.filter((d) => d.status === filterStatus);
  }

  // Apply search filter
  if (searchQuery.trim()) {
    validatorDisputes = validatorDisputes.filter(
      (d) =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const statusTabs: Array<{ label: string; value: DisputeStatus | 'all' }> = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'Awaiting Funding' },
    { label: 'In Review', value: 'In Review' },
    { label: 'Resolved', value: 'Resolved' },
  ];

  const getStatusCount = (status: DisputeStatus | 'all') => {
    if (status === 'all') {
      return getValidatorDisputes(userId).length;
    }
    return getValidatorDisputes(userId).filter((d) => d.status === status).length;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Validator Console</h1>
        <p className="text-gray-600">
          Review and decide on disputes you've been assigned to validate.
        </p>
      </div>

      {/* Filter Bar */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Search by title or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex border-b border-gray-200 mt-6 -mx-6 px-6">
          {statusTabs.map((tab) => {
            const count = getStatusCount(tab.value);
            return (
              <button
                key={tab.value}
                onClick={() => setFilterStatus(tab.value)}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors relative ${
                  filterStatus === tab.value
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      filterStatus === tab.value
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Disputes List */}
      {validatorDisputes.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            {searchQuery.trim() ? (
              <>
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No disputes found matching your search.</p>
              </>
            ) : (
              <>
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {filterStatus === 'all'
                    ? 'No disputes assigned to you yet.'
                    : `No disputes with status "${filterStatus}".`}
                </p>
              </>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {validatorDisputes.map((dispute) => (
            <Link
              key={dispute.id}
              to={`/dispute/${dispute.id}`}
              className="block"
            >
              <Card className="hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{dispute.title}</h3>
                      <Badge status={dispute.status}>{dispute.status}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <span>
                        Parties: {dispute.creatorId.substring(0, 8)}... vs{' '}
                        {dispute.opponentId.substring(0, 8)}...
                      </span>
                      <span>•</span>
                      <span>
                        Stake: {dispute.stakeAmount + dispute.opponentStakeAmount}{' '}
                        {dispute.token}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Deadline: {formatDistanceToNow(dispute.deadline, { addSuffix: true })}</span>
                    </div>
                    {dispute.evidence.length > 0 && (
                      <div className="mt-3 text-sm text-gray-600">
                        {dispute.evidence.length} evidence item
                        {dispute.evidence.length !== 1 ? 's' : ''} submitted
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <span className="text-sm font-medium text-primary-600">
                      Open Details →
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
