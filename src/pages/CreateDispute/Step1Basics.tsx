import React, { useState } from 'react';
import { Input, Textarea, Select } from '../../components/ui';
import { CreateDisputeForm, DisputeType } from '../../types';

interface Step1BasicsProps {
  formData: CreateDisputeForm;
  onChange: (data: Partial<CreateDisputeForm>) => void;
  errors: Record<string, string>;
}

export const Step1Basics: React.FC<Step1BasicsProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const [descriptionLength, setDescriptionLength] = useState(
    formData.description.length
  );

  const disputeTypeOptions = [
    { value: 'Promise', label: 'Promise - 3rd validator (human or AI) with/without deadline' },
    { value: 'Bet', label: 'Bet - Instant AI validator for immediate bets' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Title"
          placeholder="What's the dispute about?"
          value={formData.title}
          onChange={(e) => onChange({ title: e.target.value })}
          error={errors.title}
          required
        />

        <Select
          label="Type"
          options={[
            { value: 'Promise', label: 'Promise' },
            { value: 'Bet', label: 'Bet' },
          ]}
          value={formData.type}
          onChange={(e) => onChange({ type: e.target.value as DisputeType })}
          error={errors.type}
          required
        />
      </div>

      <Textarea
        label="Description (Optional)"
        placeholder="Brief description..."
        value={formData.description}
        onChange={(e) => {
          const value = e.target.value;
          setDescriptionLength(value.length);
          onChange({ description: value });
        }}
        rows={3}
        error={errors.description}
        maxLength={1000}
      />
    </div>
  );
};
