import React from 'react';
import type { Settings } from '../types';

const NETWORK_ICONS = {
  ethereum: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  bsc: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
  polygon: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
  arbitrum: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
  base: 'https://raw.githubusercontent.com/base/brand-kit/refs/heads/main/logo/symbol/Base_Symbol_Blue.png'
};

interface ActiveNetworksProps {
  settings: Settings;
}

export function ActiveNetworks({ settings }: ActiveNetworksProps) {
  const activeNetworks = Object.entries(settings.networks)
    .filter(([_, settings]) => settings.enabled);

  if (activeNetworks.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 mt-4">
      <span className="text-sm text-gray-500">Active Networks:</span>
      <div className="flex space-x-3">
        {activeNetworks.map(([network]) => (
          <img
            key={network}
            src={NETWORK_ICONS[network as keyof Settings['networks']]}
            alt={`${network} logo`}
            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
            title={network.charAt(0).toUpperCase() + network.slice(1)}
          />
        ))}
      </div>
    </div>
  );
}