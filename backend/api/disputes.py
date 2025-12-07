"""API routes for dispute management with database."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
import database as db

router = APIRouter(prefix="/api/disputes", tags=["Disputes"])


# Request/Response Models
class EvidenceItem(BaseModel):
    id: str
    type: str
    content: str
    submitted_by: str
    timestamp: str
    description: Optional[str] = None


class Decision(BaseModel):
    winner: Optional[str] = None  # Optional - AI decisions don't have winners
    reason: str
    decided_at: str
    decided_by: str


class DisputeResponse(BaseModel):
    id: str
    title: str
    type: str
    description: str
    creator_id: str
    opponent_id: str
    creator_position: Optional[str] = None
    opponent_position: Optional[str] = None
    validator_id: Optional[str] = None
    validator_type: str
    resolution_method: Optional[str] = None
    status: str
    stake_amount: float
    opponent_stake_amount: float
    token: str
    creator_wallet: Optional[str] = None
    opponent_wallet: Optional[str] = None
    escrow_tx_id: Optional[str] = None
    payout_tx_id: Optional[str] = None
    neofs_object_id: Optional[str] = None
    deadline: Optional[str] = None
    evidence_requirements: Optional[str] = None
    evidence: List[EvidenceItem] = []
    decision: Optional[Decision] = None
    created_at: str
    funded_at: Optional[str] = None
    evidence_submitted_at: Optional[str] = None
    in_review_at: Optional[str] = None
    resolved_at: Optional[str] = None


class CreateDisputeRequest(BaseModel):
    title: str
    type: str  # 'Promise' or 'Bet'
    description: str
    opponent_id: str
    creator_position: Optional[str] = None
    opponent_position: Optional[str] = None
    stake_amount: float
    opponent_stake_amount: float
    token: str
    validator_type: Optional[str] = None  # For Promise
    validator_id: Optional[str] = None  # For Promise
    deadline: Optional[str] = None  # For Promise
    evidence_requirements: Optional[str] = None
    resolution_method: Optional[str] = None  # 'ai' or 'human'
    creator_wallet: Optional[str] = None
    opponent_wallet: Optional[str] = None




@router.get("/", response_model=List[DisputeResponse])
async def get_all_disputes():
    """Get all disputes."""
    disputes = await db.get_all_disputes()
    result = []
    
    for dispute in disputes:
        evidence_list = await db.get_evidence_by_dispute(dispute['id'])
        evidence = [
            EvidenceItem(
                id=e['id'],
                type=e['type'],
                content=e['content'],
                submitted_by=e['submitted_by'],
                timestamp=e['timestamp'],
                description=e.get('description'),
            )
            for e in evidence_list
        ]
        
        decision = None
        if dispute.get('decision_reason'):  # Check if there's a decision reason
            decision = Decision(
                winner=dispute.get('decision_winner'),  # Can be None for AI decisions
                reason=dispute['decision_reason'] or '',
                decided_at=dispute['decision_decided_at'] or '',
                decided_by=dispute['decision_decided_by'] or '',
            )
        
        result.append(DisputeResponse(
            id=dispute['id'],
            title=dispute['title'],
            type=dispute['type'],
            description=dispute['description'],
            creator_id=dispute['creator_id'],
            opponent_id=dispute['opponent_id'],
            creator_position=dispute.get('creator_position'),
            opponent_position=dispute.get('opponent_position'),
            validator_id=dispute.get('validator_id'),
            validator_type=dispute['validator_type'],
            resolution_method=dispute.get('resolution_method'),
            status=dispute['status'],
            stake_amount=dispute['stake_amount'],
            opponent_stake_amount=dispute['opponent_stake_amount'],
            token=dispute['token'],
            creator_wallet=dispute.get('creator_wallet'),
            opponent_wallet=dispute.get('opponent_wallet'),
            escrow_tx_id=dispute.get('escrow_tx_id'),
            payout_tx_id=dispute.get('payout_tx_id'),
            neofs_object_id=dispute.get('neofs_object_id'),
            deadline=dispute.get('deadline'),
            evidence_requirements=dispute.get('evidence_requirements'),
            evidence=evidence,
            decision=decision,
            created_at=dispute['created_at'],
            funded_at=dispute.get('funded_at'),
            evidence_submitted_at=dispute.get('evidence_submitted_at'),
            in_review_at=dispute.get('in_review_at'),
            resolved_at=dispute.get('resolved_at'),
        ))
    
    return result


@router.get("/{dispute_id}", response_model=DisputeResponse)
async def get_dispute(dispute_id: str):
    """Get a dispute by ID."""
    dispute = await db.get_dispute_by_id(dispute_id)
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute not found")
    
    evidence_list = await db.get_evidence_by_dispute(dispute_id)
    evidence = [
        EvidenceItem(
            id=e['id'],
            type=e['type'],
            content=e['content'],
            submitted_by=e['submitted_by'],
            timestamp=e['timestamp'],
            description=e.get('description'),
        )
        for e in evidence_list
    ]
    
    decision = None
    if dispute.get('decision_reason'):  # Check if there's a decision reason
        decision = Decision(
            winner=dispute.get('decision_winner'),  # Can be None for AI decisions
            reason=dispute['decision_reason'] or '',
            decided_at=dispute['decision_decided_at'] or '',
            decided_by=dispute['decision_decided_by'] or '',
        )
    
    return DisputeResponse(
        id=dispute['id'],
        title=dispute['title'],
        type=dispute['type'],
        description=dispute['description'],
        creator_id=dispute['creator_id'],
        opponent_id=dispute['opponent_id'],
        creator_position=dispute.get('creator_position'),
        opponent_position=dispute.get('opponent_position'),
        validator_id=dispute.get('validator_id'),
        validator_type=dispute['validator_type'],
        resolution_method=dispute.get('resolution_method'),
        status=dispute['status'],
        stake_amount=dispute['stake_amount'],
        opponent_stake_amount=dispute['opponent_stake_amount'],
        token=dispute['token'],
        creator_wallet=dispute.get('creator_wallet'),
        opponent_wallet=dispute.get('opponent_wallet'),
        escrow_tx_id=dispute.get('escrow_tx_id'),
        payout_tx_id=dispute.get('payout_tx_id'),
        neofs_object_id=dispute.get('neofs_object_id'),
        deadline=dispute.get('deadline'),
        evidence_requirements=dispute.get('evidence_requirements'),
        evidence=evidence,
        decision=decision,
        created_at=dispute['created_at'],
        funded_at=dispute.get('funded_at'),
        evidence_submitted_at=dispute.get('evidence_submitted_at'),
        in_review_at=dispute.get('in_review_at'),
        resolved_at=dispute.get('resolved_at'),
    )


@router.post("/", response_model=DisputeResponse)
async def create_dispute(request: CreateDisputeRequest):
    """Create a new dispute."""
    import uuid
    from datetime import datetime
    
    dispute_id = f"dispute_{int(datetime.now().timestamp() * 1000)}_{uuid.uuid4().hex[:8]}"
    
    # Validator can be chosen after creation - set defaults
    if request.type == 'Bet':
        # Bet type defaults to AI validator
        validator_type = 'ai'
        validator_id = 'ai-agent-spoonos'
        resolution_method = request.resolution_method or 'ai'
    else:
        # Promise type - validator can be set later
        validator_type = request.validator_type or None
        validator_id = request.validator_id if validator_type == 'human' else None
        resolution_method = request.resolution_method or None
    
    dispute_data = {
        'id': dispute_id,
        'title': request.title,
        'type': request.type,
        'description': request.description or '',  # Allow empty description
        'creator_id': 'user1',  # TODO: Get from auth
        'opponent_id': request.opponent_id,
        'creator_wallet': request.creator_wallet,
        'opponent_wallet': request.opponent_wallet,
        'creator_position': request.creator_position,
        'opponent_position': request.opponent_position,
        'validator_id': validator_id,
        'validator_type': validator_type or 'pending',  # Use 'pending' if not set
        'resolution_method': resolution_method,
        'status': 'Draft',
        'stake_amount': request.stake_amount,
        'opponent_stake_amount': request.opponent_stake_amount,
        'token': request.token,
        'deadline': request.deadline,
        'evidence_requirements': request.evidence_requirements,
        'created_at': datetime.now().isoformat(),
        'escrow_tx_id': None,
        'payout_tx_id': None,
        'neofs_object_id': None,
    }
    
    await db.create_dispute(dispute_data)
    
    # If Bet type with AI resolution, immediately resolve
    if request.type == 'Bet' and resolution_method == 'ai':
        # This will be handled by a separate endpoint
        pass
    
    return await get_dispute(dispute_id)


@router.put("/{dispute_id}", response_model=DisputeResponse)
async def update_dispute(dispute_id: str, updates: dict):
    """Update a dispute."""
    # Convert decision object if present
    if 'decision' in updates and updates['decision']:
        decision = updates.pop('decision')
        updates['decision_winner'] = decision.get('winner')
        updates['decision_reason'] = decision.get('reason')
        updates['decision_decided_at'] = decision.get('decidedAt')
        updates['decision_decided_by'] = decision.get('decidedBy')
    
    # Handle evidence separately
    if 'evidence' in updates:
        evidence_list = updates.pop('evidence')
        # Delete old evidence and add new
        existing = await db.get_evidence_by_dispute(dispute_id)
        for e in existing:
            # In a real implementation, you'd have a delete_evidence function
            pass
        for e in evidence_list:
            await db.add_evidence({
                'id': e.get('id', f"evid_{datetime.now().timestamp()}"),
                'dispute_id': dispute_id,
                'type': e['type'],
                'content': e['content'],
                'submitted_by': e['submittedBy'],
                'timestamp': e.get('timestamp', datetime.now()).isoformat() if isinstance(e.get('timestamp'), datetime) else e.get('timestamp', datetime.now().isoformat()),
                'description': e.get('description'),
            })
    
    await db.update_dispute(dispute_id, updates)
    return await get_dispute(dispute_id)


@router.post("/{dispute_id}/evidence")
async def add_evidence(dispute_id: str, evidence: dict):
    """Add evidence to a dispute."""
    import uuid
    evidence_data = {
        'id': f"evid_{int(datetime.now().timestamp() * 1000)}_{uuid.uuid4().hex[:8]}",
        'dispute_id': dispute_id,
        'type': evidence['type'],
        'content': evidence['content'],
        'submitted_by': evidence['submittedBy'],
        'timestamp': datetime.now().isoformat(),
        'description': evidence.get('description'),
    }
    await db.add_evidence(evidence_data)
    return {"id": evidence_data['id'], "message": "Evidence added"}


@router.post("/{dispute_id}/resolve")
async def resolve_dispute(dispute_id: str, resolution: dict):
    """Resolve a dispute with AI or human decision."""
    dispute = await db.get_dispute_by_id(dispute_id)
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute not found")
    
    method = resolution.get('method')  # 'ai' or 'human'
    decision_data = resolution.get('decision')
    
    if method == 'ai':
        # Use SpoonOS to resolve
        from agents import get_dispute_agent, analyze_dispute as run_dispute_analysis
        
        # For Bet type, use positions to create a focused query
        if dispute['type'] == 'Bet':
            creator_pos = dispute.get('creator_position', 'Not specified')
            opponent_pos = dispute.get('opponent_position', 'Not specified')
            
            # Create a focused prompt for bet resolution
            bet_query = f"""Bet Dispute: {dispute['title']}

**Question**: {dispute.get('description', 'No description provided')}

**Creator's Position**: {creator_pos}
**Opponent's Position**: {opponent_pos}

**Instructions:**
1. Analyze the Creator's position first
2. Analyze the Opponent's position second
3. Conduct research to determine which position is factually correct
4. After analyzing both sides, provide your verdict (creator or opponent)
5. Keep response under 200 words - be concise

Format in markdown with clear sections for each side's analysis and final verdict.
"""
            # Use a simpler agent call for bets
            try:
                agent = get_dispute_agent()
                # For bets, we can use a direct query
                result = await run_dispute_analysis(
                    agent=agent,
                    dispute_id=dispute_id,
                    title=dispute['title'],
                    description=bet_query,
                    creator_evidence=[],
                    opponent_evidence=[],
                    stake_amount=dispute['stake_amount'],
                )
                agent_response = result.get('agent_response', '') if isinstance(result, dict) else str(result)
            except Exception as e:
                agent_response = f"AI analysis error: {str(e)}"
        else:
            # For Promise type, use full evidence analysis
            evidence_list = await db.get_evidence_by_dispute(dispute_id)
            creator_evidence = [e for e in evidence_list if e['submitted_by'] == dispute['creator_id']]
            opponent_evidence = [e for e in evidence_list if e['submitted_by'] == dispute['opponent_id']]
            
            agent = get_dispute_agent()
            result = await run_dispute_analysis(
                agent=agent,
                dispute_id=dispute_id,
                title=dispute['title'],
                description=dispute['description'],
                creator_evidence=creator_evidence,
                opponent_evidence=opponent_evidence,
                stake_amount=dispute['stake_amount'],
            )
            agent_response = result.get('agent_response', '') if isinstance(result, dict) else str(result)
        
        # For AI decisions, just store the analysis - no winner selection
        # The AI provides analysis, not a definitive winner
        decision = {
            'winner': None,  # No winner for AI analysis
            'reason': agent_response,  # Full AI analysis response
            'decidedAt': datetime.now(),
            'decidedBy': 'ai-agent-spoonos',
        }
    else:
        # Human decision
        decision = {
            'winner': decision_data['winner'],
            'reason': decision_data['reason'],
            'decidedAt': datetime.now(),
            'decidedBy': decision_data.get('decidedBy', 'human-validator'),
        }
    
    await db.update_dispute(dispute_id, {
        'status': 'Resolved',
        'resolved_at': datetime.now().isoformat(),
        'decision': decision,
    })
    
    return await get_dispute(dispute_id)

