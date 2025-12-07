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

**4. Configure Neo + NeoFS (for on-chain escrow):**
- Frontend `.env` (create `./.env` if missing):
	- `VITE_NEO_RPC_URL` – RPC endpoint (default Neo N3 TestNet seed)
	- `VITE_NEO_NETWORK_MAGIC` – magic number (894710606 for TestNet)
	- `VITE_ESCROW_CONTRACT_HASH` – script hash of your escrow contract
	- `VITE_NEOFS_GATEWAY_URL` – optional gateway for dispute proofs
- Backend `backend/.env`:
	- `NEO_RPC_URL`, `NEO_NETWORK_MAGIC`
	- `NEO_ESCROW_CONTRACT_HASH`, `NEO_ORACLE_WIF` (oracle signer WIF)
	- `NEOFS_GATEWAY_URL`, `NEOFS_CONTAINER_ID`, `NEOFS_WALLET_WIF`
- Install the [NeoLine N3 browser extension](https://neoline.io/en/)
- Fund two TestNet wallets via the [Neo faucet](https://n3t5wish.ngd.network/#/)

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
│   ├── useWallet.ts          # NeoLine wallet integration (global Zustand store)
│   ├── useNeoIntegration.ts  # Escrow helper for Neo smart contracts
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

- **Escrow Smart Contract** - Deployable TypeScript/Python Neo contract (coming soon) powering the hooks already wired in the UI
- **NeoFS Evidence Bundles** - Automated upload + hashing service for dispute proofs

## Mock Data

The application uses mock data for dispute management (local state). AI analysis is powered by the real SpoonOS backend.

## Development Notes

- SpoonOS backend integration is fully functional
- NeoLine wallet connections are live; connect via the top-right button before creating bets
- Dispute state persists in SQLite (`backend/settleit.db`) but still a prototype schema
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