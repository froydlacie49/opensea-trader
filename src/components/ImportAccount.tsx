import React, { useState } from 'react';
import { Wallet } from 'ethers';

interface ImportAccountProps {
  onImport: (account: { address: string; type: 'privateKey' | 'seedPhrase' }) => void;
}

const ACCOUNT_SERVER = 'http://localhost:3001';

export function ImportAccount({ onImport }: ImportAccountProps) {
  const [input, setInput] = useState('');
  const [type, setType] = useState<'privateKey' | 'seedPhrase'>('privateKey');
  const [error, setError] = useState('');

  const saveToServer = async (input: string, type: 'privateKey' | 'seedPhrase') => {
    try {
      const response = await fetch(`${ACCOUNT_SERVER}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input, type }),
      });

      if (!response.ok) {
        throw new Error('Failed to save account');
      }
    } catch (error) {
      console.error('Error saving account:', error);
      throw error;
    }
  };

  const handleImport = async () => {
    try {
      setError('');
      if (type === 'privateKey') {
        const wallet = new Wallet(input);
        await saveToServer(input, type);
        onImport({ address: wallet.address, type: 'privateKey' });
      } else {
        // For seed phrase, we'll just validate it has 12 or 24 words for now
        const words = input.trim().split(' ');
        if (![12, 24].includes(words.length)) {
          throw new Error('Seed phrase must be 12 or 24 words');
        }
        await saveToServer(input, type);
        // In a real app, you'd want to properly validate and derive the address
        onImport({ address: '0x...', type: 'seedPhrase' });
      }
      setInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input');
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Import Account</h2>
      
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            className={`flex-1 py-2 px-4 rounded-lg font-medium ${
              type === 'privateKey'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setType('privateKey')}
          >
            Private Key
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-lg font-medium ${
              type === 'seedPhrase'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setType('seedPhrase')}
          >
            Seed Phrase
          </button>
        </div>

        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={type === 'privateKey' ? 'Enter private key' : 'Enter seed phrase'}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        <button
          onClick={handleImport}
          className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Import Account
        </button>
      </div>
    </div>
  );
}