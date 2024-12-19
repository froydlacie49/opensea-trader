import React from 'react';
import type { Settings } from '../types';

interface NetworkSettingsProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

const NETWORK_ICONS = {
  ethereum: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  bsc: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
  polygon: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
  arbitrum: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
  base: 'https://raw.githubusercontent.com/base/brand-kit/refs/heads/main/logo/symbol/Base_Symbol_Blue.png'
};

const NETWORK_NAMES = {
  ethereum: 'Ethereum',
  bsc: 'BSC',
  polygon: 'Polygon',
  arbitrum: 'Arbitrum',
  base: 'Base'
};

export function NetworkSettings({ settings, onSettingsChange }: NetworkSettingsProps) {
  const handleNetworkToggle = (network: keyof Settings['networks']) => {
    onSettingsChange({
      ...settings,
      networks: {
        ...settings.networks,
        [network]: {
          ...settings.networks[network],
          enabled: !settings.networks[network].enabled
        }
      }
    });
  };

  const handleSettingChange = (
    network: keyof Settings['networks'],
    setting: keyof NetworkSettings,
    value: number
  ) => {
    onSettingsChange({
      ...settings,
      networks: {
        ...settings.networks,
        [network]: {
          ...settings.networks[network],
          [setting]: value
        }
      }
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Network Settings</h2>
      
      <div className="grid grid-cols-5 gap-4 mb-8">
        {Object.entries(NETWORK_ICONS).map(([network, icon]) => (
          <div key={network} className="flex flex-col items-center">
            <img
              src={icon}
              alt={`${network} logo`}
              className="w-12 h-12 object-contain mb-2"
            />
            <span className="text-sm font-medium text-gray-900 mb-2">
              {NETWORK_NAMES[network as keyof Settings['networks']]}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.networks[network as keyof Settings['networks']].enabled}
                onChange={() => handleNetworkToggle(network as keyof Settings['networks'])}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {Object.entries(settings.networks).map(([network, networkSettings]) => (
          networkSettings.enabled && (
            <div key={network} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {NETWORK_NAMES[network as keyof Settings['networks']]} Settings
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Price (ETH)
                  </label>
                  <input
                    type="number"
                    value={networkSettings.minPrice}
                    onChange={(e) => handleSettingChange(
                      network as keyof Settings['networks'],
                      'minPrice',
                      parseFloat(e.target.value)
                    )}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Price (ETH)
                  </label>
                  <input
                    type="number"
                    value={networkSettings.maxPrice}
                    onChange={(e) => handleSettingChange(
                      network as keyof Settings['networks'],
                      'maxPrice',
                      parseFloat(e.target.value)
                    )}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Daily Buy Limit
                  </label>
                  <input
                    type="number"
                    value={networkSettings.maxDailyBuyLimit}
                    onChange={(e) => handleSettingChange(
                      network as keyof Settings['networks'],
                      'maxDailyBuyLimit',
                      parseInt(e.target.value)
                    )}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}