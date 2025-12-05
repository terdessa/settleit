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
    { value: 'Promise', label: 'Promise' },
    { value: 'Bet', label: 'Bet' },
    { value: 'Challenge', label: 'Challenge' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Dispute Basics
        </h2>
        <p className="text-gray-600">
          Provide the essential information about your dispute.
        </p>
      </div>

      <Input
        label="Dispute Title"
        placeholder="e.g., Delivery Completion Promise"
        value={formData.title}
        onChange={(e) => onChange({ title: e.target.value })}
        error={errors.title}
        required
      />

      <Select
        label="Dispute Type"
        options={disputeTypeOptions}
        value={formData.type}
        onChange={(e) => onChange({ type: e.target.value as DisputeType })}
        error={errors.type}
        required
      />

      <Textarea
        label="Description"
        placeholder="Describe the dispute, promise, bet, or challenge in detail..."
        value={formData.description}
        onChange={(e) => {
          const value = e.target.value;
          setDescriptionLength(value.length);
          onChange({ description: value });
        }}
        rows={6}
        error={errors.description}
        characterCount={descriptionLength}
        maxLength={1000}
        helperText="Provide clear details about what needs to be resolved."
        required
      />
    </div>
  );
};
