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

**CRITICAL INSTRUCTIONS:**
1. **DO NOT** pick a winner immediately - analyze both sides first
2. Analyze each party's position and evidence separately
3. If no evidence is provided, conduct your own research to determine the facts
4. Only after thorough analysis, provide your final verdict
5. Keep your response SHORT and CONCISE (max 300 words)

**Response Structure (in markdown):**
1. **Creator's Side**: Brief analysis of their position/evidence
2. **Opponent's Side**: Brief analysis of their position/evidence  
3. **Research/Findings**: If no evidence, what you found through research
4. **Verdict**: Final decision (creator or opponent) with brief reasoning

Be impartial, concise, and base your verdict on facts and analysis, not assumptions.
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
    has_evidence = len(creator_evidence) > 0 or len(opponent_evidence) > 0
    
    evidence_section = ""
    if has_evidence:
        evidence_section = f"""
## Evidence from Creator (Party A)
{_format_evidence(creator_evidence)}

## Evidence from Opponent (Party B)
{_format_evidence(opponent_evidence)}
"""
    else:
        evidence_section = """
**No evidence provided by either party.**
You must conduct your own research to determine the facts and reach a verdict.
"""
    
    prompt = f"""Analyze this dispute and provide a verdict:

**Dispute**: {title}
**Description**: {description}
**Stake**: {stake_amount}
{evidence_section}

**Instructions:**
1. First analyze the Creator's side (position/evidence)
2. Then analyze the Opponent's side (position/evidence)
3. If no evidence was provided, conduct research to find the facts
4. After analyzing both sides, provide your final verdict (creator or opponent)
5. Keep your response under 300 words and be concise

Format your response in markdown with clear sections for each side's analysis and the final verdict.
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
