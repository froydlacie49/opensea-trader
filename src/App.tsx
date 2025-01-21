import React, { useState, useEffect, useCallback } from 'react';
import { Wallet, LayoutDashboard, Settings as SettingsIcon } from 'lucide-react';
import { AccountsPage } from './pages/Accounts';
import { DashboardPage } from './pages/Dashboard';
import { SettingsPage } from './pages/Settings';
import type { Account, ActivityLog, Settings, NFT, ActiveOffer } from './types';

const DEFAULT_SETTINGS: Settings = {
  networks: {
    ethereum: { enabled: true, minPrice: 0.01, maxPrice: 1, maxDailyBuyLimit: 5, maxOfferPrice: -20, buyFreeNFTs: false },
    bsc: { enabled: false, minPrice: 0.01, maxPrice: 1, maxDailyBuyLimit: 5, maxOfferPrice: -20, buyFreeNFTs: false },
    polygon: { enabled: true, minPrice: 0.01, maxPrice: 1, maxDailyBuyLimit: 5, maxOfferPrice: -20, buyFreeNFTs: false },
    arbitrum: { enabled: false, minPrice: 0.01, maxPrice: 1, maxDailyBuyLimit: 5, maxOfferPrice: -20, buyFreeNFTs: false },
    base: { enabled: false, minPrice: 0.01, maxPrice: 1, maxDailyBuyLimit: 5, maxOfferPrice: -20, buyFreeNFTs: false }
  }
};

const ACCOUNT_SERVER = 'http://localhost:3001';

function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [currentPage, setCurrentPage] = useState<'dashboard' | 'accounts' | 'settings'>('dashboard');
  const [isRunning, setIsRunning] = useState(false);
  const [offers, setOffers] = useState<ActiveOffer[]>([]);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const initializeAccounts = async () => {
      try {
        // Initialize with an empty array since we don't have a server yet
        setAccounts([]);
      } catch (error) {
        console.error('Error initializing accounts:', error);
        // Initialize with empty array on error
        setAccounts([]);
      }
    };

    initializeAccounts();
  }, []);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const addLog = useCallback((message: string, type: ActivityLog['type'] = 'info') => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      message,
      type,
    };
    setLogs(prev => [newLog, ...prev]);
  }, []);

  const handleImport = ({ address, type }: { address: string; type: 'privateKey' | 'seedPhrase' }) => {
    const newAccount: Account = {
      id: crypto.randomUUID(),
      address,
      type,
      name: `Account ${accounts.length + 1}`,
    };
    setAccounts([...accounts, newAccount]);
    addLog(`Imported new ${type} account: ${address}`);
  };

  const handleDelete = (id: string) => {
    const account = accounts.find(a => a.id === id);
    setAccounts(accounts.filter(account => account.id !== id));
    if (account) {
      addLog(`Removed account: ${account.address}`, 'warning');
    }
  };

  const handleCancelOffer = (id: string) => {
    const offer = offers.find(o => o.id === id);
    setOffers(offers.filter(o => o.id !== id));
    if (offer) {
      addLog(`Cancelled offer for ${offer.collectionName} #${offer.itemNumber}`, 'warning');
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    addLog('Activity generation started', 'success');
  };

  const handleStop = () => {
    setIsRunning(false);
    addLog('Activity generation stopped', 'warning');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex space-x-8">
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    currentPage === 'dashboard'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentPage('accounts')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    currentPage === 'accounts'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Accounts
                </button>
                <button
                  onClick={() => setCurrentPage('settings')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    currentPage === 'settings'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'dashboard' && (
          <DashboardPage
            settings={settings}
            accounts={accounts}
            logs={logs}
            nfts={nfts}
            offers={offers}
            onCancelOffer={handleCancelOffer}
            onActivityLog={addLog}
          />
        )}
        {currentPage === 'accounts' && (
          <AccountsPage
            accounts={accounts}
            onImport={handleImport}
            onDeleteAccount={handleDelete}
          />
        )}
        {currentPage === 'settings' && (
          <SettingsPage
            settings={settings}
            onSettingsChange={setSettings}
          />
        )}
      </main>
    </div>
  );
}

export default App;