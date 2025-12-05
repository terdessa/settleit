import { User, UserRole } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user1',
    displayName: 'Alice Johnson',
    walletAddress: 'NQxX8v...jK9mP2',
    role: 'both',
    bio: 'I\'m here mostly as a validator and occasional dispute participant.',
    isAvailableAsValidator: true,
    language: 'en',
    notificationsEnabled: true,
  },
  {
    id: 'user2',
    displayName: 'Bob Smith',
    walletAddress: 'NQyY9w...kL0nQ3',
    role: 'user',
    bio: 'Active dispute participant.',
    isAvailableAsValidator: false,
    language: 'en',
    notificationsEnabled: true,
  },
  {
    id: 'user3',
    displayName: 'Carol White',
    walletAddress: 'NQzZ0x...mL1oR4',
    role: 'validator',
    bio: 'Professional validator.',
    isAvailableAsValidator: true,
    language: 'en',
    notificationsEnabled: true,
  },
];

export const getCurrentMockUser = (): User => {
  return mockUsers[0]; // Default to Alice
};
