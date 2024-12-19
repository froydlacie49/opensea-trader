import React from 'react';
import { X } from 'lucide-react';
import type { ActiveOffer } from '../types';

interface ActiveOffersProps {
  offers: ActiveOffer[];
  onCancelOffer: (id: string) => void;
}

export function ActiveOffers({ offers, onCancelOffer }: ActiveOffersProps) {
  const getTimeLeft = (offerTime: number) => {
    const timeLeft = offerTime + 24 * 60 * 60 * 1000 - Date.now();
    if (timeLeft <= 0) return '00:00:00';
    
    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Active Offers</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {offers.map((offer) => (
          <div key={offer.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {offer.collectionName} #{offer.itemNumber}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Floor: {offer.floorPrice} ETH | Offer: {offer.offerAmount} ETH
                  </p>
                </div>
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full capitalize bg-blue-100 text-blue-800">
                  {offer.network}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium text-gray-500">
                {getTimeLeft(offer.offerTime)}
              </div>
              <button
                onClick={() => onCancelOffer(offer.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Cancel offer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {offers.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No active offers
          </div>
        )}
      </div>
    </div>
  );
}