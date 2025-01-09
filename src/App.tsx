import React, { useState, useEffect } from 'react';
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

const SAMPLE_NFTS: NFT[] = [
  {
    id: '1',
    name: 'Bored Ape #1234',
    image: 'https://images.unsplash.com/photo-1614812513172-567d2fe96a75?w=800',
    network: 'ethereum',
    purchaseTime: Date.now() - 86400000,
    purchasePrice: 0.5,
    ownerAddress: '0x1234567890abcdef1234567890abcdef12345678'
  },
  {
    id: '2',
    name: 'Cool Cat #4567',
    image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800',
    network: 'polygon',
    purchaseTime: Date.now() - 172800000,
    purchasePrice: 0.2,
    ownerAddress: '0x1234567890abcdef1234567890abcdef12345678'
  },
  {
    id: '3',
    name: 'Doodle #7890',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    network: 'ethereum',
    purchaseTime: Date.now() - 259200000,
    purchasePrice: 0.8,
    ownerAddress: '0x1234567890abcdef1234567890abcdef12345678'
  }
];

const SAMPLE_OFFERS: ActiveOffer[] = [
  {
    id: '1',
    collectionName: 'DeGods',
    itemNumber: '2156',
    floorPrice: 8.95,
    offerAmount: 8.75,
    offerTime: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    network: 'ethereum'
  },
  {
    id: '2',
    collectionName: 'Pudgy Penguins',
    itemNumber: '4521',
    floorPrice: 6.49,
    offerAmount: 6.2,
    offerTime: Date.now() - 5 * 60 * 60 * 1000, // 5 hours ago
    network: 'ethereum'
  },
  {
    id: '3',
    collectionName: 'Milady',
    itemNumber: '7823',
    floorPrice: 2.89,
    offerAmount: 2.75,
    offerTime: Date.now() - 1 * 60 * 60 * 1000, // 1 hour ago
    network: 'ethereum'
  },
  {
    id: '4',
    collectionName: 'Checks',
    itemNumber: '3467',
    floorPrice: 3.45,
    offerAmount: 3.2,
    offerTime: Date.now() - 30 * 60 * 1000, // 30 mins ago
    network: 'ethereum'
  },
  {
    id: '5',
    collectionName: 'Moonbirds',
    itemNumber: '9124',
    floorPrice: 3.85,
    offerAmount: 3.7,
    offerTime: Date.now() - 15 * 60 * 1000, // 15 mins ago
    network: 'ethereum'
  }
];

function App() {
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('accounts');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [currentPage, setCurrentPage] = useState<'dashboard' | 'accounts' | 'settings'>('dashboard');
  const [isRunning, setIsRunning] = useState(false);
  const [offers, setOffers] = useState<ActiveOffer[]>(SAMPLE_OFFERS);
  const [logs, setLogs] = useState<ActivityLog[]>([
    {
      id: '1',
      timestamp: Date.now() - 15 * 60 * 1000, // 15 mins ago
      message: 'Placed offer on DeGods #2156 for 8.75 ETH (2.2% below floor)',
      type: 'info'
    },
    {
      id: '2',
      timestamp: Date.now() - 45 * 60 * 1000, // 45 mins ago
      message: 'Offer accepted! Successfully purchased Checks #3467 for 3.2 ETH',
      type: 'success'
    },
    {
      id: '3',
      timestamp: Date.now() - 90 * 60 * 1000, // 1.5 hours ago
      message: 'Listed Moonbirds #9124 for 4.2 ETH',
      type: 'info'
    },
    {
      id: '4',
      timestamp: Date.now() - 3 * 60 * 60 * 1000, // 3 hours ago
      message: 'Offer expired for Pudgy Penguins #4521',
      type: 'warning'
    },
    {
      id: '5',
      timestamp: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
      message: 'Floor price alert: Milady floor dropped 15% to 2.89 ETH',
      type: 'info'
    },
    {
      id: '6',
      timestamp: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
      message: 'Scanning top 100 collections for potential opportunities...',
      type: 'info'
    }
  ]);

  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

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

  const addLog = (message: string, type: ActivityLog['type'] = 'info') => {
    const newLog: ActivityLog = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      message,
      type,
    };
    setLogs(prev => [newLog, ...prev]);
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/opensea-logo.svg" alt="OpenSea" className="w-8 h-8" />
              <h1 className="text-xl font-bold text-gray-900">OpenSea Activity Generator</h1>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  currentPage === 'dashboard'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setCurrentPage('accounts')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  currentPage === 'accounts'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Wallet className="w-5 h-5" />
                <span>Accounts</span>
              </button>
              <button
                onClick={() => setCurrentPage('settings')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  currentPage === 'settings'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <SettingsIcon className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'dashboard' ? (
          <DashboardPage
            isRunning={isRunning}
            onStart={handleStart}
            onStop={handleStop}
            logs={logs}
            settings={settings}
            nfts={SAMPLE_NFTS}
            offers={offers}
            onCancelOffer={handleCancelOffer}
          />
        ) : currentPage === 'accounts' ? (
          <AccountsPage
            accounts={accounts}
            onImport={handleImport}
            onDeleteAccount={handleDelete}
          />
        ) : (
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