"""SpoonOS Agent for dispute analysis and resolution."""
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from typing import Any

# SpoonOS imports
from spoon_ai.chat import ChatBot

from config import settings

# System prompt for dispute analysis
SYSTEM_PROMPT = """You are an impartial AI arbitrator for the SettleIt dispute resolution platform.

Your role is to:
1. Carefully analyze all evidence submitted by both parties
2. Evaluate the credibility and relevance of each piece of evidence
3. Consider the original terms and context of the dispute
4. Provide a fair and well-reasoned recommendation

Guidelines:
- Be completely impartial - do not favor either party without evidence
- Base your decision only on the evidence provided
- Explain your reasoning clearly so both parties understand the decision
- If evidence is insufficient, state what additional information would help
- Consider the stake amount and ensure proportional analysis

Always structure your response with:
- Summary of the dispute
- Analysis of each party's evidence
- Your recommendation (creator or opponent)
- Confidence level (0-1)
- Detailed reasoning for your decision
"""


def create_dispute_agent() -> ChatBot:
    """Create and return a ChatBot for dispute analysis."""
    # Initialize ChatBot - it will use env variables for configuration
    chatbot = ChatBot()
    return chatbot


async def analyze_dispute(
    agent: ChatBot,
    dispute_id: str,
    title: str,
    description: str,
    creator_evidence: list[dict],
    opponent_evidence: list[dict],
    stake_amount: float = 0,
) -> dict[str, Any]:
    """
    Analyze a dispute and provide a resolution recommendation.
    Uses SpoonOS ChatBot directly for LLM calls.
    """
    prompt = f"""Please analyze the following dispute and provide your recommendation:

## Dispute Information
- **ID**: {dispute_id}
- **Title**: {title}
- **Description**: {description}
- **Stake Amount**: {stake_amount}

## Evidence from Creator (Party A)
{_format_evidence(creator_evidence)}

## Evidence from Opponent (Party B)
{_format_evidence(opponent_evidence)}

Please analyze all evidence carefully and provide your final recommendation with reasoning.
Structure your response as:
1. Summary of the dispute
2. Analysis of creator's evidence
3. Analysis of opponent's evidence
4. Your recommendation (creator or opponent)
5. Confidence level (0.0 to 1.0)
6. Detailed reasoning
"""

    # Use ChatBot.ask() to get response from LLM
    # This is the Agent → SpoonOS → LLM flow
    # ask() expects messages as a list of dicts with 'role' and 'content'
    messages = [
        {"role": "user", "content": prompt}
    ]

    response = await agent.ask(
        messages=messages,
        system_msg=SYSTEM_PROMPT,
    )

    return {
        "dispute_id": dispute_id,
        "agent_response": response,
        "status": "completed",
    }


def _format_evidence(evidence_list: list[dict]) -> str:
    """Format evidence list for the prompt."""
    if not evidence_list:
        return "No evidence submitted."

    formatted = []
    for i, evidence in enumerate(evidence_list, 1):
        formatted.append(f"{i}. [{evidence.get('type', 'unknown')}] {evidence.get('content', 'No content')}")

    return "\n".join(formatted)


# Singleton instance for the API
_agent_instance: ChatBot | None = None


def get_dispute_agent() -> ChatBot:
    """Get or create the singleton ChatBot instance."""
    global _agent_instance
    if _agent_instance is None:
        _agent_instance = create_dispute_agent()
    return _agent_instance
