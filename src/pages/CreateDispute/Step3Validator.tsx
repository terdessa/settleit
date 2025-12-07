import React from 'react';
import { Textarea, DateTimePicker } from '../../components/ui';
import { CreateDisputeForm, ResolutionMethod } from '../../types';

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
  const isBet = formData.type === 'Bet';

  const handleResolutionMethodChange = (method: ResolutionMethod) => {
    onChange({ resolutionMethod: method });
  };

  const getDateTimeValue = (date?: Date) => {
    if (!date) return '';
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
    } else {
      onChange({ deadline: undefined });
    }
  };

  if (isBet) {
    // Bet type: only resolution method (always AI for instant resolution)
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Choose how to resolve this bet
        </p>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <input
              type="radio"
              name="resolutionMethod"
              value="ai"
              checked={formData.resolutionMethod === 'ai' || !formData.resolutionMethod}
              onChange={() => handleResolutionMethodChange('ai')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 mr-3"
            />
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                AI (Instant)
              </div>
            </div>
          </label>
          <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <input
              type="radio"
              name="resolutionMethod"
              value="human"
              checked={formData.resolutionMethod === 'human'}
              onChange={() => handleResolutionMethodChange('human')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 mr-3"
            />
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-50 text-sm">
                Human Validator
              </div>
            </div>
          </label>
        </div>
      </div>
    );
  }

  // Promise type: optional validator type, optional deadline, optional evidence requirements
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Optional settings - you can configure these later
      </p>

      <DateTimePicker
        label="Deadline (Optional)"
        value={formData.deadline ? getDateTimeValue(formData.deadline) : ''}
        onChange={handleDateTimeChange}
        error={errors.deadline}
      />

      <Textarea
        label="Evidence Requirements (Optional)"
        placeholder="What evidence is needed?"
        value={formData.evidenceRequirements || ''}
        onChange={(e) => {
          const value = e.target.value;
          onChange({ evidenceRequirements: value });
        }}
        rows={3}
        error={errors.evidenceRequirements}
        maxLength={500}
      />
    </div>
  );
};
