# SettleIt SpoonOS Backend

AI-powered dispute resolution backend using SpoonOS agents.

## Quick Start

### 1. Install Dependencies

```bash
# Using uv (recommended - faster)
cd backend
uv venv .venv
uv pip install -r requirements.txt

# OR using pip
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add at least one API key:
# - GEMINI_API_KEY (recommended - free tier available)
# - OPENAI_API_KEY
# - ANTHROPIC_API_KEY
```

### 3. Run the Server

```bash
# From the backend directory
python -m uvicorn main:app --reload --port 8000

# OR from project root
python -m backend.main
```

### 4. Verify Setup

- Open http://localhost:8000 - should show API info
- Open http://localhost:8000/docs - Swagger UI documentation
- Test status: http://localhost:8000/api/spoon/status

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/spoon/status` | GET | Check agent configuration status |
| `/api/spoon/analyze` | POST | Full AI dispute analysis |
| `/api/spoon/quick-analysis` | POST | Quick preliminary analysis |

## Project Structure

```
backend/
├── __init__.py
├── main.py              # FastAPI application entry point
├── requirements.txt     # Python dependencies
├── .env.example        # Environment variables template
├── agents/
│   ├── __init__.py
│   └── dispute_agent.py # SpoonOS dispute analysis agent
├── api/
│   ├── __init__.py
│   └── routes.py        # API route handlers
├── config/
│   ├── __init__.py
│   └── settings.py      # Configuration management
└── tools/
    ├── __init__.py
    └── dispute_tools.py # Custom SpoonOS tools
```

## SpoonOS Agent Architecture

The backend uses SpoonOS's ReAct agent pattern:

1. **DisputeAnalysisAgent** - Main agent that orchestrates dispute resolution
2. **EvidenceAnalysisTool** - Analyzes evidence submitted by parties
3. **DisputeResolutionTool** - Generates resolution recommendations

### How It Works

```
User submits dispute → API receives request → Agent analyzes evidence
                                                     ↓
                                              Tool: Analyze each piece of evidence
                                                     ↓
                                              Tool: Generate recommendation
                                                     ↓
                                              Return structured response
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | One of these | Google Gemini API key |
| `OPENAI_API_KEY` | required | OpenAI API key |
| `ANTHROPIC_API_KEY` | | Anthropic Claude API key |
| `DEFAULT_LLM_PROVIDER` | No | Provider to use (default: gemini) |
| `DEFAULT_MODEL` | No | Model name (default: gemini-2.5-pro) |
| `API_PORT` | No | Server port (default: 8000) |
| `FRONTEND_URL` | No | CORS origin (default: http://localhost:5173) |
