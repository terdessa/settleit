import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '../../components/ui';
import { Button } from '../../components/ui';
import { Step1Basics } from './Step1Basics';
import { Step2Parties } from './Step2Parties';
import { Step3Validator } from './Step3Validator';
import { Step4Review } from './Step4Review';
import { CreateDisputeForm, Dispute, DisputeStatus } from '../../types';
import { useDisputesStore } from '../../store/disputesStore';
import { useUserStore } from '../../store/userStore';
import { useUIStore } from '../../store/uiStore';

const steps = ['Basics', 'Parties & Stakes', 'Validator & Rules', 'Review'];

const initialFormData: CreateDisputeForm = {
  title: '',
  type: 'Promise',
  description: '',
  opponentIdentifier: '',
  stakeAmount: 0,
  opponentStakeAmount: 0,
  token: 'GAS',
  validatorType: 'human',
  validatorIdentifier: '',
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  evidenceRequirements: '',
};

export const CreateDispute: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateDisputeForm>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addDispute } = useDisputesStore();
  const { currentUser } = useUserStore();
  const { addToast } = useUIStore();

  const updateFormData = (data: Partial<CreateDisputeForm>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    // Clear errors for updated fields
    const newErrors = { ...errors };
    Object.keys(data).forEach((key) => {
      delete newErrors[key];
    });
    setErrors(newErrors);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.title.trim()) {
        newErrors.title = 'Title is required';
      }
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      }
      if (formData.description.length > 1000) {
        newErrors.description = 'Description must be 1000 characters or less';
      }
    }

    if (step === 2) {
      if (!formData.opponentIdentifier.trim()) {
        newErrors.opponentIdentifier = 'Opponent identifier is required';
      }
      if (formData.stakeAmount <= 0) {
        newErrors.stakeAmount = 'Stake amount must be greater than 0';
      }
      if (formData.opponentStakeAmount <= 0) {
        newErrors.opponentStakeAmount = 'Opponent stake amount must be greater than 0';
      }
    }

    if (step === 3) {
      if (formData.validatorType === 'human' && !formData.validatorIdentifier?.trim()) {
        newErrors.validatorIdentifier = 'Validator identifier is required for human validators';
      }
      // AI agents don't need a validator identifier
      if (formData.deadline <= new Date()) {
        newErrors.deadline = 'Deadline must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!validateStep(3)) {
      setCurrentStep(3);
      return;
    }

    // Create dispute object
    const disputeId = `dispute_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newDispute: Dispute = {
      id: disputeId,
      title: formData.title,
      type: formData.type,
      description: formData.description,
      creatorId: currentUser?.id || 'user1',
      opponentId: formData.opponentIdentifier,
      validatorId: formData.validatorType === 'human' 
        ? formData.validatorIdentifier 
        : 'ai-agent-spoonos', // AI agent identifier
      validatorType: formData.validatorType,
      status: 'Draft' as DisputeStatus,
      stakeAmount: formData.stakeAmount,
      opponentStakeAmount: formData.opponentStakeAmount,
      token: formData.token,
      deadline: formData.deadline,
      evidenceRequirements: formData.evidenceRequirements,
      evidence: [],
      createdAt: new Date(),
    };

    addDispute(newDispute);
    addToast('Dispute created successfully!', 'success');
    navigate(`/dispute/${disputeId}`);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Basics
            formData={formData}
            onChange={updateFormData}
            errors={errors}
          />
        );
      case 2:
        return (
          <Step2Parties
            formData={formData}
            onChange={updateFormData}
            errors={errors}
          />
        );
      case 3:
        return (
          <Step3Validator
            formData={formData}
            onChange={updateFormData}
            errors={errors}
          />
        );
      case 4:
        return <Step4Review formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">Create Dispute</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Follow the steps below to create a new dispute, bet, or promise.
        </p>
      </div>

      <Stepper steps={steps} currentStep={currentStep} />

      <div className="mt-8">{renderStep()}</div>

      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="secondary"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          Back
        </Button>
        {currentStep < steps.length ? (
          <Button variant="primary" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button variant="primary" onClick={handleSubmit}>
            Confirm and Lock Dispute
          </Button>
        )}
      </div>
    </div>
  );
};
