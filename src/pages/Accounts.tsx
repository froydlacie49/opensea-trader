import React from 'react';
import { ImportAccount } from '../components/ImportAccount';
import { AccountList } from '../components/AccountList';
import type { Account } from '../types';

interface AccountsPageProps {
  accounts: Account[];
  onImport: (account: { address: string; type: 'privateKey' | 'seedPhrase' }) => void;
  onDeleteAccount: (id: string) => void;
}

export function AccountsPage({ accounts, onImport, onDeleteAccount }: AccountsPageProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Import Accounts</h2>
        <ImportAccount onImport={onImport} />
      </div>
      
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Managed Accounts ({accounts.length})
        </h2>
        <AccountList accounts={accounts} onDeleteAccount={onDeleteAccount} />
      </div>
    </div>
  );
}