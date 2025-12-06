import React, { useState } from 'react';
import { Input, Textarea, DateTimePicker } from '../../components/ui';
import { CreateDisputeForm, ValidatorType } from '../../types';
import { Info } from 'lucide-react';

interface Step3ValidatorProps {
  formData: CreateDisputeForm;
  onChange: (data: Partial<CreateDisputeForm>) => void;
  errors: Record<string, string>;
}

export const Step3Validator: React.FC<Step3ValidatorProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const [evidenceRequirementsLength, setEvidenceRequirementsLength] = useState(
    formData.evidenceRequirements?.length || 0
  );

  const handleValidatorTypeChange = (type: ValidatorType) => {
    onChange({ validatorType: type });
    if (type === 'ai') {
      onChange({ validatorIdentifier: undefined });
    }
  };

  const getDateTimeValue = (date: Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      onChange({ deadline: new Date(value) });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">
          Validator & Rules
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a validator and set the rules for your dispute.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Validator Type
        </label>
        <div className="space-y-3">
          <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <input
              type="radio"
              name="validatorType"
              value="human"
              checked={formData.validatorType === 'human'}
              onChange={() => handleValidatorTypeChange('human')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500"
            />
            <div className="ml-3 flex-1">
              <div className="font-medium text-gray-900 dark:text-gray-50">
                Invite a human validator
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Choose a trusted person to review and decide
              </div>
            </div>
          </label>
          <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <input
              type="radio"
              name="validatorType"
              value="ai"
              checked={formData.validatorType === 'ai'}
              onChange={() => handleValidatorTypeChange('ai')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500"
            />
            <div className="ml-3 flex-1">
              <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                Use AI agent (via SpoonOS)
                <span
                  className="inline-flex items-center"
                  title="Powered by SpoonOS agents"
                >
                  <Info className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                AI-powered dispute resolution and analysis
              </div>
            </div>
          </label>
        </div>
        {errors.validatorType && (
          <p className="mt-1 text-sm text-red-600">{errors.validatorType}</p>
        )}
      </div>

      {formData.validatorType === 'human' && (
        <Input
          label="Validator Identifier"
          placeholder="Wallet address or username of validator"
          value={formData.validatorIdentifier || ''}
          onChange={(e) => onChange({ validatorIdentifier: e.target.value })}
          error={errors.validatorIdentifier}
          helperText="Enter the wallet address or username of your chosen validator."
          required
        />
      )}

      <DateTimePicker
        label="Decision Deadline"
        value={getDateTimeValue(formData.deadline)}
        onChange={handleDateTimeChange}
        error={errors.deadline}
        helperText="When should the validator make a decision?"
        required
      />

      <Textarea
        label="Evidence Requirements"
        placeholder="What kind of evidence or proof will be needed to resolve this dispute?"
        value={formData.evidenceRequirements || ''}
        onChange={(e) => {
          const value = e.target.value;
          setEvidenceRequirementsLength(value.length);
          onChange({ evidenceRequirements: value });
        }}
        rows={4}
        error={errors.evidenceRequirements}
        characterCount={evidenceRequirementsLength}
        maxLength={500}
        helperText="Clearly state what evidence is required for a fair resolution."
      />
    </div>
  );
};
