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

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd settleit
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

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

## Future Integrations

This frontend is designed to easily integrate with:

- **Neo Blockchain** - For on-chain dispute creation, stake locking, and automated payouts
- **SpoonOS Agents** - For AI-powered dispute analysis and decision-making

Integration hooks are already in place as placeholders in `src/hooks/`.

## Mock Data

The application uses mock data for demonstration purposes. All disputes, users, and evidence are generated locally and reset on page refresh.

## Development Notes

- All blockchain and agent integrations are placeholder implementations
- Wallet connection is mocked (UI only)
- No persistence - state resets on page refresh
- Designed to be easily extended with real backend/blockchain integrations

## License

This is a hackathon prototype for demonstration purposes.

## Contributing

This is a prototype project. For production use, implement:
- Real Neo blockchain integration
- SpoonOS agent integration
- Backend API for dispute management
- Persistent data storage
- Authentication system