import React from 'react';
import { Input, Select } from '../../components/ui';
import { CreateDisputeForm } from '../../types';

interface Step2PartiesProps {
  formData: CreateDisputeForm;
  onChange: (data: Partial<CreateDisputeForm>) => void;
  errors: Record<string, string>;
}

export const Step2Parties: React.FC<Step2PartiesProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const tokenOptions = [
    { value: 'GAS', label: 'GAS' },
    { value: 'NEO', label: 'NEO' },
    { value: 'TestToken', label: 'TestToken' },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">
          Parties & Stakes
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Specify who you're challenging and the stake amounts.
        </p>
      </div>

      <Input
        label="Opponent Identifier"
        placeholder="Wallet address or username"
        value={formData.opponentIdentifier}
        onChange={(e) => onChange({ opponentIdentifier: e.target.value })}
        error={errors.opponentIdentifier}
        helperText="Enter the wallet address or username of the person you're challenging."
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Your Stake Amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="100"
          value={formData.stakeAmount.toString()}
          onChange={(e) =>
            onChange({ stakeAmount: parseFloat(e.target.value) || 0 })
          }
          error={errors.stakeAmount}
          required
        />
        <Input
          label="Opponent Stake Amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="100"
          value={formData.opponentStakeAmount.toString()}
          onChange={(e) =>
            onChange({
              opponentStakeAmount: parseFloat(e.target.value) || 0,
            })
          }
          error={errors.opponentStakeAmount}
          required
        />
      </div>

      <Select
        label="Token"
        options={tokenOptions}
        value={formData.token}
        onChange={(e) => onChange({ token: e.target.value })}
        error={errors.token}
        required
      />
    </div>
  );
};
