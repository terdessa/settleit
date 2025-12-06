"""Custom SpoonOS tools for dispute analysis and resolution."""
from typing import Any
from spoon_ai.tools import BaseTool


class EvidenceAnalysisTool(BaseTool):
    """Tool for analyzing evidence submitted in a dispute."""

    name: str = "evidence_analysis"
    description: str = """Analyze evidence submitted by parties in a dispute.
    Evaluates the strength, relevance, and credibility of submitted evidence.
    Returns a score and analysis for each piece of evidence."""

    parameters: dict = {
        "type": "object",
        "properties": {
            "evidence_list": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "string"},
                        "type": {"type": "string", "enum": ["text", "image", "document", "link"]},
                        "content": {"type": "string"},
                        "submitted_by": {"type": "string", "enum": ["creator", "opponent"]},
                    },
                },
                "description": "List of evidence items to analyze",
            },
            "dispute_context": {
                "type": "string",
                "description": "The context and description of the dispute",
            },
        },
        "required": ["evidence_list", "dispute_context"],
    }

    async def execute(self, evidence_list: list[dict], dispute_context: str) -> dict[str, Any]:
        """Analyze the provided evidence in the context of the dispute."""
        analysis_results = []

        for evidence in evidence_list:
            # In a real implementation, this would use more sophisticated analysis
            analysis = {
                "evidence_id": evidence.get("id"),
                "submitted_by": evidence.get("submitted_by"),
                "relevance_score": 0.0,
                "credibility_score": 0.0,
                "analysis": "",
            }
            analysis_results.append(analysis)

        return {
            "evidence_analyses": analysis_results,
            "dispute_context": dispute_context,
            "total_evidence_count": len(evidence_list),
        }


class DisputeResolutionTool(BaseTool):
    """Tool for making dispute resolution recommendations."""

    name: str = "dispute_resolution"
    description: str = """Make a resolution recommendation for a dispute based on analyzed evidence.
    Considers all evidence, party arguments, and dispute terms to recommend a fair outcome."""

    parameters: dict = {
        "type": "object",
        "properties": {
            "dispute_id": {
                "type": "string",
                "description": "Unique identifier for the dispute",
            },
            "dispute_title": {
                "type": "string",
                "description": "Title/summary of the dispute",
            },
            "dispute_description": {
                "type": "string",
                "description": "Full description of the dispute",
            },
            "creator_argument": {
                "type": "string",
                "description": "The creator's argument and position",
            },
            "opponent_argument": {
                "type": "string",
                "description": "The opponent's argument and position",
            },
            "evidence_analysis": {
                "type": "object",
                "description": "Results from evidence analysis",
            },
            "stake_amount": {
                "type": "number",
                "description": "Amount at stake in the dispute",
            },
        },
        "required": ["dispute_id", "dispute_title", "dispute_description"],
    }

    async def execute(
        self,
        dispute_id: str,
        dispute_title: str,
        dispute_description: str,
        creator_argument: str = "",
        opponent_argument: str = "",
        evidence_analysis: dict = None,
        stake_amount: float = 0,
    ) -> dict[str, Any]:
        """Generate a resolution recommendation for the dispute."""
        return {
            "dispute_id": dispute_id,
            "recommendation": None,  # Will be filled by agent reasoning
            "confidence": 0.0,
            "reasoning": "",
            "evidence_summary": evidence_analysis or {},
        }
