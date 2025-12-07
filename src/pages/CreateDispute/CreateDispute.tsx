import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '../../components/ui';
import { Button } from '../../components/ui';
import { Step1Basics } from './Step1Basics';
import { Step2Parties } from './Step2Parties';
import { Step3Validator } from './Step3Validator';
import { CreateDisputeForm } from '../../types';
import { useDisputesStore } from '../../store/disputesStore';
import { useUIStore } from '../../store/uiStore';
import { useWallet, useNeoIntegration } from '../../hooks';

const steps = ['Quick Setup', 'Optional Settings'];

const initialFormData: CreateDisputeForm = {
  title: '',
  type: 'Promise',
  description: '',
  opponentIdentifier: '',
  opponentWalletAddress: '',
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnChainPending, setIsOnChainPending] = useState(false);
  const { fetchDisputes } = useDisputesStore();
  const { addToast } = useUIStore();
  const { account } = useWallet();
  const { createBetOnChain } = useNeoIntegration();

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
    const isBet = formData.type === 'Bet';

    if (step === 1) {
      // Validate all required fields in step 1
      if (!formData.title.trim()) {
        newErrors.title = 'Title is required';
      }
      if (!formData.opponentIdentifier.trim()) {
        newErrors.opponentIdentifier = 'Opponent is required';
      }
      if (isBet && !formData.opponentWalletAddress?.trim()) {
        newErrors.opponentWalletAddress = 'Opponent wallet is required for bets';
      }
      if (formData.stakeAmount <= 0) {
        newErrors.stakeAmount = 'Stake must be greater than 0';
      }
      if (formData.opponentStakeAmount <= 0) {
        newErrors.opponentStakeAmount = 'Opponent stake must be greater than 0';
      }
      if (isBet) {
        if (!formData.creatorPosition?.trim()) {
          newErrors.creatorPosition = 'Your position is required';
        }
        if (!formData.opponentPosition?.trim()) {
          newErrors.opponentPosition = "Opponent's position is required";
        }
      }
      if (formData.description && formData.description.length > 1000) {
        newErrors.description = 'Description must be 1000 characters or less';
      }
    }

    if (step === 2) {
      // Step 2 is optional, only validate if fields are filled
      if (formData.deadline && formData.deadline <= new Date()) {
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

  const handleSubmit = async () => {
    // Validate step 1 (required fields)
    if (!validateStep(1)) {
      setCurrentStep(1);
      return;
    }

    if (formData.type === 'Bet' && !account) {
      addToast('Connect your Neo wallet before creating an on-chain bet.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      // Create dispute via API
      const response = await fetch('http://localhost:8000/api/disputes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          type: formData.type,
          description: formData.description,
          opponent_id: formData.opponentIdentifier,
          opponent_wallet: formData.opponentWalletAddress,
          creator_position: formData.creatorPosition,
          opponent_position: formData.opponentPosition,
          stake_amount: formData.stakeAmount,
          opponent_stake_amount: formData.opponentStakeAmount,
          token: formData.token,
          validator_type: formData.validatorType,
          validator_id: formData.validatorType === 'human' ? formData.validatorIdentifier : undefined,
          deadline: formData.deadline ? formData.deadline.toISOString() : undefined,
          evidence_requirements: formData.evidenceRequirements,
          resolution_method: formData.resolutionMethod || (formData.type === 'Bet' ? 'ai' : 'human'),
          creator_wallet: account?.address,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create dispute');
      }

      const createdDispute = await response.json();

      if (formData.type === 'Bet' && account) {
        setIsOnChainPending(true);
        try {
          const txid = await createBetOnChain({
            disputeId: createdDispute.id,
            creatorStake: formData.stakeAmount,
            opponentStake: formData.opponentStakeAmount,
            token: formData.token,
            opponentAddress: formData.opponentWalletAddress || formData.opponentIdentifier,
            neofsObjectId: createdDispute.neofs_object_id || createdDispute.id,
          });
          addToast(`On-chain escrow submitted (tx: ${txid.substring(0, 10)}...)`, 'success');
        } catch (chainError) {
          console.error('Failed to submit on-chain escrow:', chainError);
          addToast('Dispute saved, but on-chain escrow failed. Retry from the dispute page.', 'error');
        } finally {
          setIsOnChainPending(false);
        }
      }

      // If Bet with AI resolution, immediately resolve
      if (formData.type === 'Bet' && formData.resolutionMethod === 'ai') {
        try {
          const resolveResponse = await fetch(`http://localhost:8000/api/disputes/${createdDispute.id}/resolve`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              method: 'ai',
            }),
          });

          if (resolveResponse.ok) {
            await resolveResponse.json();
            addToast('Bet resolved instantly with AI!', 'success');
            // Refresh disputes
            await fetchDisputes();
            navigate(`/dispute/${createdDispute.id}`);
            return;
          }
        } catch (error) {
          console.error('Failed to auto-resolve bet:', error);
        }
      }

      addToast('Dispute created successfully!', 'success');
      // Refresh disputes
      await fetchDisputes();
      navigate(`/dispute/${createdDispute.id}`);
    } catch (error: any) {
      console.error('Failed to create dispute:', error);
      addToast(error.message || 'Failed to create dispute. Make sure the backend is running.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <Step1Basics
              formData={formData}
              onChange={updateFormData}
              errors={errors}
            />
            <Step2Parties
              formData={formData}
              onChange={updateFormData}
              errors={errors}
            />
          </div>
        );
      case 2:
        return (
          <Step3Validator
            formData={formData}
            onChange={updateFormData}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-1">Create Dispute</h1>
      </div>

      {steps.length > 1 && (
        <div className="mb-6">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>
      )}

      <div className="mt-6">{renderStep()}</div>

      <div className="flex justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        {currentStep > 1 && (
          <Button
            variant="secondary"
            onClick={handleBack}
          >
            Back
          </Button>
        )}
        <div className="flex gap-3 ml-auto">
          {currentStep < steps.length ? (
            <>
              <Button variant="secondary" onClick={handleSubmit} disabled={isSubmitting}>
                Skip & Create
              </Button>
              <Button variant="primary" onClick={handleNext} disabled={isSubmitting}>
                Next
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting || isOnChainPending}>
              {isSubmitting || isOnChainPending ? 'Processing...' : 'Create Dispute'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
