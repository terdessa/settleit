import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useDisputesStore } from '../store/disputesStore';
import { useUserStore } from '../store/userStore';
import { useUIStore } from '../store/uiStore';
import { useSpoonOS } from '../hooks/useSpoonOS';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Timeline } from '../components/ui/Timeline';
import { Input, Textarea, Select } from '../components/ui';
import { Evidence, EvidenceType } from '../types';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Plus,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  File,
  Sparkles,
} from 'lucide-react';

export const DisputeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDisputeById, updateDispute, fetchDispute } = useDisputesStore();
  const { currentUser } = useUserStore();
  const { addToast } = useUIStore();
  const { submitForAnalysis, checkAgentStatus } = useSpoonOS();
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [agentStatus, setAgentStatus] = useState<any>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [selectedResolutionMethod, setSelectedResolutionMethod] = useState<'ai' | 'human' | null>(null);
  const [decisionWinner, setDecisionWinner] = useState<'creator' | 'opponent'>('creator');
  const [decisionReason, setDecisionReason] = useState('');
  const [newEvidence, setNewEvidence] = useState({
    type: 'text' as EvidenceType,
    content: '',
    description: '',
  });

  const dispute = id ? getDisputeById(id) : null;

  useEffect(() => {
    if (id) {
      if (!dispute) {
        // Try to fetch from API
        fetchDispute(id).then((fetched) => {
          if (!fetched) {
            addToast('Dispute not found', 'error');
            navigate('/dashboard');
          }
        });
      }
    }
  }, [id, dispute, fetchDispute, navigate, addToast]);

  useEffect(() => {
    // Check agent status on mount
    const checkStatus = async () => {
      try {
        const status = await checkAgentStatus();
        setAgentStatus(status);
      } catch (error) {
        console.error('Failed to check agent status:', error);
      }
    };
    checkStatus();
  }, [checkAgentStatus]);

  if (!dispute) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Loading dispute...</p>
      </div>
    );
  }

  const userId = currentUser?.id || 'user1';
  const isCreator = dispute.creatorId === userId;
  const isOpponent = dispute.opponentId === userId;
  const isValidator = dispute.validatorType === 'human' && dispute.validatorId === userId;
  const isAIAgent = dispute.validatorType === 'ai';
  const canAddEvidence = isCreator || isOpponent;
  const canMakeDecision = isValidator && dispute.status === 'In Review';

  const handleAddEvidence = () => {
    if (!newEvidence.content.trim()) {
      addToast('Please provide evidence content', 'error');
      return;
    }

    const evidence: Evidence = {
      id: `evid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      disputeId: dispute.id,
      type: newEvidence.type,
      content: newEvidence.content,
      submittedBy: userId,
      timestamp: new Date(),
      description: newEvidence.description || undefined,
    };

    updateDispute(dispute.id, {
      evidence: [...dispute.evidence, evidence],
    });

    addToast('Evidence added successfully', 'success');
    setShowEvidenceModal(false);
    setNewEvidence({ type: 'text', content: '', description: '' });
  };

  const handleSimulateAgentAnalysis = async () => {
    try {
      setIsLoadingAnalysis(true);
      addToast('Requesting AI analysis...', 'info');
      
      // Convert evidence to the format expected by the API
      const creatorEvidence = dispute.evidence
        .filter(e => e.submittedBy === dispute.creatorId)
        .map(e => ({
          id: e.id,
          type: e.type,
          content: e.content,
          submitted_by: 'creator' as const,
        }));
      
      const opponentEvidence = dispute.evidence
        .filter(e => e.submittedBy === dispute.opponentId)
        .map(e => ({
          id: e.id,
          type: e.type,
          content: e.content,
          submitted_by: 'opponent' as const,
        }));

      const analysis = await submitForAnalysis(
        dispute.id,
        dispute.title,
        dispute.description,
        creatorEvidence,
        opponentEvidence,
        dispute.stakeAmount
      );

      // Transform API response to match component expectations
      setAiAnalysis({
        recommendation: analysis.recommendation || 'undecided',
        confidence: analysis.confidence,
        reasoning: analysis.reasoning,
        evidenceScore: analysis.evidence_scores,
        timestamp: new Date(),
      });
      setShowAIAnalysis(true);
      addToast('AI analysis completed', 'success');
    } catch (error: any) {
      console.error('AI analysis failed:', error);
      addToast(
        error.message || 'Failed to get AI analysis. Make sure the backend is running and API keys are configured.',
        'error'
      );
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handleSubmitDecision = () => {
    if (!decisionReason.trim()) {
      addToast('Please provide a reason for your decision', 'error');
      return;
    }

    updateDispute(dispute.id, {
      status: 'Resolved',
      decision: {
        winner: decisionWinner,
        reason: decisionReason,
        decidedAt: new Date(),
        decidedBy: userId,
      },
      resolvedAt: new Date(),
    });

    addToast('Decision submitted successfully', 'success');
    setShowDecisionModal(false);
    setDecisionReason('');
  };

  const getEvidenceIcon = (type: EvidenceType) => {
    switch (type) {
      case 'text':
        return <FileText className="h-5 w-5" />;
      case 'image':
        return <ImageIcon className="h-5 w-5" />;
      case 'link':
        return <LinkIcon className="h-5 w-5" />;
      case 'file':
        return <File className="h-5 w-5" />;
    }
  };

  const evidenceTypeOptions = [
    { value: 'text', label: 'Text' },
    { value: 'image', label: 'Image' },
    { value: 'link', label: 'Link' },
    { value: 'file', label: 'File' },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{dispute.title}</h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
            <span>{dispute.type}</span>
            <span>•</span>
            <span>{dispute.stakeAmount + dispute.opponentStakeAmount} {dispute.token}</span>
            {dispute.deadline && (
              <>
                <span>•</span>
                <span>{formatDistanceToNow(dispute.deadline, { addSuffix: true })}</span>
              </>
            )}
          </div>
        </div>
        <Badge status={dispute.status}>{dispute.status}</Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick Info */}
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Parties</p>
                <p className="text-gray-900 dark:text-gray-50">
                  {isCreator ? 'You' : 'Creator'} ({dispute.stakeAmount} {dispute.token}) vs {isOpponent ? 'You' : 'Opponent'} ({dispute.opponentStakeAmount} {dispute.token})
                </p>
              </div>
              {dispute.type === 'Bet' && (
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Positions</p>
                  <p className="text-gray-900 dark:text-gray-50 text-xs">
                    You: {dispute.creatorPosition || 'N/A'} | Them: {dispute.opponentPosition || 'N/A'}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Description - Only show if provided */}
          {dispute.description && dispute.description.trim() && (
            <Card className="p-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">Description</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{dispute.description}</p>
            </Card>
          )}

          {/* Evidence Section - Only show if there's evidence or can add */}
          {(dispute.evidence.length > 0 || (canAddEvidence && dispute.status !== 'Resolved')) && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Evidence</h2>
                {canAddEvidence && dispute.status !== 'Resolved' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowEvidenceModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                )}
              </div>
              {dispute.evidence.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">No evidence yet</p>
              ) : (
                <div className="space-y-2">
                  {dispute.evidence.map((evidence) => (
                    <div
                      key={evidence.id}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded bg-gray-50/50 dark:bg-gray-800/50"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {getEvidenceIcon(evidence.type)}
                          <span className="text-xs font-medium text-gray-900 dark:text-gray-50">
                            {evidence.type}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            by {evidence.submittedBy === userId ? 'You' : evidence.submittedBy}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {format(evidence.timestamp, 'MMM d, HH:mm')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {evidence.type === 'link' ? (
                          <a
                            href={evidence.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            {evidence.content}
                          </a>
                        ) : (
                          <p className="whitespace-pre-wrap line-clamp-2">{evidence.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Decision Section */}
          {dispute.status === 'Resolved' && dispute.decision ? (
            <Card className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-3">
                {dispute.decision.decidedBy === 'ai-agent-spoonos' ? 'AI Analysis' : 'Decision'}
              </h2>
              {dispute.decision.winner && dispute.decision.decidedBy !== 'ai-agent-spoonos' && (
                <div className="mb-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Winner</p>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {dispute.decision.winner === 'creator'
                      ? isCreator ? 'You' : 'Creator'
                      : isOpponent ? 'You' : 'Opponent'}
                  </p>
                </div>
              )}
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-base font-bold mb-1 text-gray-900 dark:text-gray-50" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-sm font-bold mb-1 text-gray-900 dark:text-gray-50" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xs font-bold mb-1 text-gray-900 dark:text-gray-50" {...props} />,
                    p: ({node, ...props}) => <p className="mb-1.5 text-gray-700 dark:text-gray-300" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside mb-1.5 space-y-0.5 ml-3" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-1.5 space-y-0.5 ml-3" {...props} />,
                    li: ({node, ...props}) => <li className="text-gray-700 dark:text-gray-300" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-gray-900 dark:text-gray-50" {...props} />,
                    code: ({node, ...props}) => <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-xs font-mono" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-gray-300 dark:border-gray-600 pl-3 italic my-1.5 text-gray-600 dark:text-gray-400" {...props} />,
                  }}
                >
                  {dispute.decision.reason}
                </ReactMarkdown>
              </div>
            </Card>
          ) : canMakeDecision ? (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-4">Make Decision</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={decisionWinner === 'creator' ? 'primary' : 'secondary'}
                    onClick={() => setDecisionWinner('creator')}
                  >
                    Award to Creator
                  </Button>
                  <Button
                    variant={decisionWinner === 'opponent' ? 'primary' : 'secondary'}
                    onClick={() => setDecisionWinner('opponent')}
                  >
                    Award to Opponent
                  </Button>
                </div>
                <Textarea
                  label="Reason"
                  placeholder="Explain your decision (visible to both parties)"
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  rows={4}
                />
                <Button
                  variant="primary"
                  onClick={() => setShowDecisionModal(true)}
                  disabled={!decisionReason.trim()}
                >
                  Submit Decision
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-3">Resolution</h2>
              {dispute.status !== 'Resolved' && (isCreator || isOpponent) && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={selectedResolutionMethod === 'ai' ? 'primary' : 'secondary'}
                      onClick={async () => {
                        if (selectedResolutionMethod === 'ai') {
                          setIsResolving(true);
                          try {
                            const response = await fetch(`http://localhost:8000/api/disputes/${dispute.id}/resolve`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ method: 'ai' }),
                            });
                            if (response.ok) {
                              await fetchDispute(dispute.id);
                              addToast('Resolved with AI!', 'success');
                              setSelectedResolutionMethod(null);
                            } else {
                              const error = await response.json();
                              throw new Error(error.detail || 'Failed to resolve');
                            }
                          } catch (error: any) {
                            addToast(error.message || 'Failed to resolve', 'error');
                          } finally {
                            setIsResolving(false);
                          }
                        } else {
                          setSelectedResolutionMethod('ai');
                        }
                      }}
                      disabled={isResolving || selectedResolutionMethod === 'human'}
                      size="sm"
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      {selectedResolutionMethod === 'ai' ? (isResolving ? 'Resolving...' : 'Confirm AI') : 'AI'}
                    </Button>
                    <Button
                      variant={selectedResolutionMethod === 'human' ? 'primary' : 'secondary'}
                      onClick={() => {
                        if (selectedResolutionMethod === 'human') {
                          addToast('Invite a validator to resolve', 'info');
                          setSelectedResolutionMethod(null);
                        } else {
                          setSelectedResolutionMethod('human');
                        }
                      }}
                      disabled={selectedResolutionMethod === 'ai'}
                      size="sm"
                    >
                      {selectedResolutionMethod === 'human' ? 'Confirm Human' : 'Human'}
                    </Button>
                  </div>
                  {selectedResolutionMethod && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedResolutionMethod(null)}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              )}
              {dispute.status === 'In Review' && !isCreator && !isOpponent && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Waiting for resolution...
                </p>
              )}
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* AI Agent Preview Panel */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">AI Analysis</h2>
            </div>
            {agentStatus && (
              <div className="mb-3 p-2 rounded bg-gray-50 dark:bg-gray-800/50">
                <span className={`text-xs font-semibold ${
                  agentStatus.status === 'ready' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {agentStatus.status === 'ready' ? '✓ Ready' : '⚠ Not Configured'}
                </span>
              </div>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSimulateAgentAnalysis}
              disabled={isLoadingAnalysis || agentStatus?.status !== 'ready'}
              className="w-full"
            >
              {isLoadingAnalysis ? 'Analyzing...' : 'Get Analysis'}
            </Button>
            {showAIAnalysis && aiAnalysis && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                <div className="text-xs text-blue-800 dark:text-blue-200 max-h-[400px] overflow-y-auto">
                  <ReactMarkdown
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-sm font-bold mb-1 text-blue-900 dark:text-blue-100" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xs font-bold mb-1 text-blue-900 dark:text-blue-100" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-xs font-bold mb-0.5 text-blue-900 dark:text-blue-100" {...props} />,
                      p: ({node, ...props}) => <p className="mb-1 text-blue-800 dark:text-blue-200" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-1 space-y-0.5 ml-2" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-1 space-y-0.5 ml-2" {...props} />,
                      li: ({node, ...props}) => <li className="text-blue-800 dark:text-blue-200" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-semibold text-blue-900 dark:text-blue-100" {...props} />,
                      code: ({node, ...props}) => <code className="bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded text-xs font-mono" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-blue-300 dark:border-blue-700 pl-2 italic my-1 text-blue-700 dark:text-blue-300" {...props} />,
                    }}
                  >
                    {aiAnalysis.reasoning}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Add Evidence Modal */}
      <Modal
        isOpen={showEvidenceModal}
        onClose={() => setShowEvidenceModal(false)}
        title="Add Evidence"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="Evidence Type"
            options={evidenceTypeOptions}
            value={newEvidence.type}
            onChange={(e) =>
              setNewEvidence({ ...newEvidence, type: e.target.value as EvidenceType })
            }
          />
          <Input
            label="Description (Optional)"
            placeholder="Brief description of this evidence"
            value={newEvidence.description}
            onChange={(e) =>
              setNewEvidence({ ...newEvidence, description: e.target.value })
            }
          />
          <Textarea
            label={
              newEvidence.type === 'link'
                ? 'Link URL'
                : newEvidence.type === 'image'
                ? 'Image URL'
                : 'Content'
            }
            placeholder={
              newEvidence.type === 'link'
                ? 'https://example.com/proof'
                : newEvidence.type === 'image'
                ? 'https://example.com/image.png'
                : 'Enter your evidence content...'
            }
            value={newEvidence.content}
            onChange={(e) =>
              setNewEvidence({ ...newEvidence, content: e.target.value })
            }
            rows={6}
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowEvidenceModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddEvidence}>
              Add Evidence
            </Button>
          </div>
        </div>
      </Modal>

      {/* Decision Confirmation Modal */}
      <Modal
        isOpen={showDecisionModal}
        onClose={() => setShowDecisionModal(false)}
        title="Confirm Decision"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to award the dispute to{' '}
            <strong>
              {decisionWinner === 'creator' ? 'the Creator' : 'the Opponent'}
            </strong>
            ?
          </p>
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Reason:</p>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{decisionReason}</p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This decision is final and will trigger the payout automatically.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowDecisionModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmitDecision}>
              Confirm Decision
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
