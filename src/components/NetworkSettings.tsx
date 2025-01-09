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
    value: number | boolean
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Network Settings</h2>
      <div className="space-y-4">
        {Object.entries(settings.networks).map(([network, networkSettings]) => (
          <div key={network} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <img
                src={NETWORK_ICONS[network as keyof Settings['networks']]}
                alt={network}
                className="w-8 h-8"
              />
              <span className="font-semibold">
                {NETWORK_NAMES[network as keyof Settings['networks']]}
              </span>
              <label className="flex items-center cursor-pointer ml-auto">
                <input
                  type="checkbox"
                  checked={networkSettings.enabled}
                  onChange={() => handleNetworkToggle(network as keyof Settings['networks'])}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
              </label>
            </div>
            {networkSettings.enabled && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Min Price (ETH)
                    </label>
                    <input
                      type="number"
                      value={networkSettings.minPrice}
                      onChange={(e) =>
                        handleSettingChange(
                          network as keyof Settings['networks'],
                          'minPrice',
                          parseFloat(e.target.value)
                        )
                      }
                      step="0.01"
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Max Price (ETH)
                    </label>
                    <input
                      type="number"
                      value={networkSettings.maxPrice}
                      onChange={(e) =>
                        handleSettingChange(
                          network as keyof Settings['networks'],
                          'maxPrice',
                          parseFloat(e.target.value)
                        )
                      }
                      step="0.01"
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Max Daily Buy Limit
                    </label>
                    <input
                      type="number"
                      value={networkSettings.maxDailyBuyLimit}
                      onChange={(e) =>
                        handleSettingChange(
                          network as keyof Settings['networks'],
                          'maxDailyBuyLimit',
                          parseInt(e.target.value)
                        )
                      }
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Max Offer Price (%)
                    </label>
                    <input
                      type="number"
                      value={networkSettings.maxOfferPrice}
                      onChange={(e) =>
                        handleSettingChange(
                          network as keyof Settings['networks'],
                          'maxOfferPrice',
                          parseFloat(e.target.value)
                        )
                      }
                      step="1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={networkSettings.buyFreeNFTs}
                      onChange={(e) =>
                        handleSettingChange(
                          network as keyof Settings['networks'],
                          'buyFreeNFTs',
                          e.target.checked
                        )
                      }
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Buy Free NFTs
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}