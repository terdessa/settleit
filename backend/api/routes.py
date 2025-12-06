"""API routes for SpoonOS agent integration."""
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from typing import Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from agents import get_dispute_agent, analyze_dispute as run_dispute_analysis

router = APIRouter(prefix="/api/spoon", tags=["SpoonOS"])


# Request/Response Models
class EvidenceItem(BaseModel):
    """Evidence item model."""
    id: str
    type: str  # text, image, document, link
    content: str
    submitted_by: str  # creator or opponent


class AnalyzeDisputeRequest(BaseModel):
    """Request model for dispute analysis."""
    dispute_id: str
    title: str
    description: str
    creator_evidence: list[EvidenceItem] = []
    opponent_evidence: list[EvidenceItem] = []
    stake_amount: float = 0


class AnalysisResponse(BaseModel):
    """Response model for dispute analysis."""
    dispute_id: str
    recommendation: str | None  # creator, opponent, or null if undecided
    confidence: float
    reasoning: str
    evidence_scores: dict[str, float]
    status: str


class AgentStatusResponse(BaseModel):
    """Response model for agent status check."""
    status: str
    provider: str
    model: str
    message: str


@router.get("/status", response_model=AgentStatusResponse)
async def get_agent_status() -> AgentStatusResponse:
    """Check if the SpoonOS agent is properly configured and ready."""
    try:
        from config import settings
        provider, _ = settings.get_available_provider()
        return AgentStatusResponse(
            status="ready",
            provider=provider,
            model=settings.DEFAULT_MODEL,
            message="SpoonOS agent is configured and ready",
        )
    except ValueError as e:
        return AgentStatusResponse(
            status="not_configured",
            provider="none",
            model="none",
            message=str(e),
        )


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_dispute(request: AnalyzeDisputeRequest) -> AnalysisResponse:
    """
    Submit a dispute for AI analysis.

    The SpoonOS agent will:
    1. Analyze all submitted evidence
    2. Evaluate each party's case
    3. Provide a recommendation with reasoning
    """
    try:
        agent = get_dispute_agent()

        # Convert evidence to dict format
        creator_evidence = [e.model_dump() for e in request.creator_evidence]
        opponent_evidence = [e.model_dump() for e in request.opponent_evidence]

        # Run the agent analysis
        result = await run_dispute_analysis(
            agent=agent,
            dispute_id=request.dispute_id,
            title=request.title,
            description=request.description,
            creator_evidence=creator_evidence,
            opponent_evidence=opponent_evidence,
            stake_amount=request.stake_amount,
        )

        # Parse agent response into structured format
        # result can be a dict or string depending on agent response
        if isinstance(result, str):
            agent_response = result
            status = "completed"
        else:
            agent_response = result.get("agent_response", "")
            status = result.get("status", "completed")

        # Convert response to string if it's not already
        if not isinstance(agent_response, str):
            agent_response = str(agent_response)

        return AnalysisResponse(
            dispute_id=request.dispute_id,
            recommendation=None,  # Could parse from agent response
            confidence=0.0,
            reasoning=agent_response,
            evidence_scores={
                "creator": 0.0,
                "opponent": 0.0,
            },
            status=status,
        )

    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/quick-analysis")
async def quick_analysis(request: AnalyzeDisputeRequest) -> dict[str, Any]:
    """
    Get a quick preliminary analysis without full agent reasoning.
    Useful for real-time UI feedback.
    """
    # This is a simplified analysis for quick responses
    total_creator_evidence = len(request.creator_evidence)
    total_opponent_evidence = len(request.opponent_evidence)

    # Simple heuristic for quick feedback
    if total_creator_evidence > total_opponent_evidence:
        preliminary = "creator"
    elif total_opponent_evidence > total_creator_evidence:
        preliminary = "opponent"
    else:
        preliminary = "undecided"

    return {
        "dispute_id": request.dispute_id,
        "preliminary_leaning": preliminary,
        "creator_evidence_count": total_creator_evidence,
        "opponent_evidence_count": total_opponent_evidence,
        "message": "This is a preliminary assessment. Full analysis pending.",
    }
