import React from 'react';
import { X } from 'lucide-react';
import type { Account } from '../types';

interface AccountListProps {
  accounts: Account[];
  onDeleteAccount: (id: string) => void;
}

export function AccountList({ accounts, onDeleteAccount }: AccountListProps) {
  return (
    <div className="space-y-3">
      {accounts.map((account) => (
        <div
          key={account.id}
          className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-900">
                {account.name || 'Unnamed Account'}
              </span>
              <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                {account.type === 'privateKey' ? 'Private Key' : 'Seed Phrase'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1 font-mono">
              {account.address}
            </p>
          </div>
          <button
            onClick={() => onDeleteAccount(account.id)}
            className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Delete account"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
}