import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/Button';
import { Shield, Users, Scale, CheckCircle } from 'lucide-react';

export const Landing: React.FC = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" />
            <Link to="/dashboard">
              <Button variant="primary">Launch App</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-50 mb-6">
            Settleit – Fair Dispute Resolution,
            <br />
            <span className="text-primary-600 dark:text-primary-400">Powered by On-Chain Agents</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Transparent, trustworthy dispute and promise resolution platform where
            parties lock stakes and validators (human or AI) make fair decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button variant="primary" size="lg">
                Launch App
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => scrollToSection('how-it-works')}
            >
              How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="bg-gray-50 dark:bg-gray-900 py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-50 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: 'Create Dispute & Lock Stakes',
                description:
                  'Two or more parties create a dispute, bet, or promise and lock their crypto stakes.',
                icon: Shield,
              },
              {
                step: 2,
                title: 'Add Opponent and Validator',
                description:
                  'Invite your opponent and choose a validator (human or future AI agent) to review the case.',
                icon: Users,
              },
              {
                step: 3,
                title: 'Submit Evidence & Review',
                description:
                  'Parties submit evidence. The validator or AI agent reviews all information fairly.',
                icon: Scale,
              },
              {
                step: 4,
                title: 'Winner Chosen & Payout',
                description:
                  'The validator makes a decision. The winner receives the locked stakes automatically.',
                icon: CheckCircle,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                    Step {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Future AI + Web3 Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-50 mb-8">
            Built for the Future
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Settleit is designed to integrate with Neo blockchain and SpoonOS agents,
            bringing AI-powered dispute resolution to Web3.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-4">Neo</div>
              <p className="text-gray-600 dark:text-gray-400">
                Built on Neo blockchain for secure, transparent on-chain dispute resolution
                and automated payouts.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <div className="text-4xl font-bold text-secondary-600 dark:text-secondary-400 mb-4">
                SpoonOS
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Future integration with SpoonOS agents will enable AI-powered dispute
                analysis and decision-making.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo size="sm" />
              <p className="mt-4 text-sm">
                Fair dispute resolution powered by on-chain agents.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/dashboard" className="hover:text-white">
                    App
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Docs (Coming Soon)
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">About</h3>
              <p className="text-sm">
                This is a hackathon prototype. For demonstration purposes only.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 Settleit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
