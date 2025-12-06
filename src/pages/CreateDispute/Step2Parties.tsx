import React from 'react';
import { Input, Select, Textarea } from '../../components/ui';
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

  const isBet = formData.type === 'Bet';

  return (
    <div className="space-y-4">
      <Input
        label="Opponent"
        placeholder="Wallet or username"
        value={formData.opponentIdentifier}
        onChange={(e) => onChange({ opponentIdentifier: e.target.value })}
        error={errors.opponentIdentifier}
        required
      />

      {isBet && (
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Your Position"
            placeholder="e.g., Fish can fly"
            value={formData.creatorPosition || ''}
            onChange={(e) => onChange({ creatorPosition: e.target.value })}
            error={errors.creatorPosition}
            required
          />
          <Input
            label="Their Position"
            placeholder="e.g., Fish cannot fly"
            value={formData.opponentPosition || ''}
            onChange={(e) => onChange({ opponentPosition: e.target.value })}
            error={errors.opponentPosition}
            required
          />
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Your Stake"
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
          label="Their Stake"
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
        <Select
          label="Token"
          options={tokenOptions}
          value={formData.token}
          onChange={(e) => onChange({ token: e.target.value })}
          error={errors.token}
          required
        />
      </div>
    </div>
  );
};
