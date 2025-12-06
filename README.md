# Settleit – On-chain Dispute & Promise Resolution

A modern, responsive web application frontend for Settleit, a platform where users can create disputes, bets, or promises, lock crypto stakes, and have validators (human or future AI agents via SpoonOS) make fair decisions.

## Features

- 🎯 **Landing Page** - Clean introduction with "How It Works" section
- 📊 **Dashboard** - Overview of active disputes, stats, and quick access
- ➕ **Create Dispute Flow** - Multi-step wizard for creating disputes
- 📋 **Dispute Detail** - Comprehensive dispute view with evidence management
- ⚖️ **Validator Console** - Dedicated view for validators to review cases
- 👤 **Profile & Settings** - User preferences and wallet management
- 🎨 **Modern UI** - Built with React, TypeScript, and Tailwind CSS

## Tech Stack

- **React 18** with TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Routing
- **Lucide React** - Icons
- **date-fns** - Date formatting

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+ (for backend)
- At least one LLM API key (Gemini, OpenAI, or Anthropic)

### First Time Setup

**1. Install Backend Dependencies:**
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**2. Install Frontend Dependencies:**
```powershell
npm install
```

**3. Configure API Keys:**
- Edit `backend/.env`
- Add at least one: `GEMINI_API_KEY`, `OPENAI_API_KEY`, or `ANTHROPIC_API_KEY`

### Running the Application

**Terminal 1 - Start Backend:**
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python -m uvicorn main:app --reload --port 8000
```

**Terminal 2 - Start Frontend:**
```powershell
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── assets/           # Static assets (logos, images)
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components (Button, Card, Modal, etc.)
│   └── Logo.tsx     # Logo component
├── hooks/           # Custom React hooks
│   ├── useWallet.ts          # Wallet integration (placeholder)
│   ├── useNeoIntegration.ts  # Neo blockchain hooks (placeholder)
│   └── useSpoonOS.ts         # SpoonOS agent hooks (placeholder)
├── layouts/         # Layout components
│   └── AppLayout.tsx  # Main app layout with navigation
├── mock/            # Mock data generators
├── pages/           # Page components
│   ├── Landing.tsx
│   ├── Dashboard.tsx
│   ├── CreateDispute/
│   ├── DisputeDetail.tsx
│   ├── ValidatorConsole.tsx
│   └── Profile.tsx
├── store/           # Zustand stores
│   ├── userStore.ts
│   ├── disputesStore.ts
│   └── uiStore.ts
├── styles/          # Global styles
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Backend Integration

The frontend is fully integrated with the SpoonOS backend:

- **SpoonOS AI Analysis** - Real AI-powered dispute analysis via backend API
- **Agent Status Checking** - Automatic detection of backend availability
- **Evidence Analysis** - Submit disputes with evidence for AI evaluation

The backend runs on `http://localhost:8000` and provides:
- `/api/spoon/status` - Check agent configuration
- `/api/spoon/analyze` - Full AI dispute analysis
- `/api/spoon/quick-analysis` - Quick preliminary assessment

## Future Integrations

- **Neo Blockchain** - For on-chain dispute creation, stake locking, and automated payouts

## Mock Data

The application uses mock data for dispute management (local state). AI analysis is powered by the real SpoonOS backend.

## Development Notes

- SpoonOS backend integration is fully functional
- Wallet connection is mocked (UI only)
- Dispute state is in-memory (resets on page refresh)
- AI analysis requires backend API keys to be configured

## License

This is a hackathon prototype for demonstration purposes.

## Contributing

This is a prototype project. For production use, implement:
- Real Neo blockchain integration
- SpoonOS agent integration
- Backend API for dispute management
- Persistent data storage
- Authentication system