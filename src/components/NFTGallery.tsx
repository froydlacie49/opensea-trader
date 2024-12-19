import React from 'react';
import type { NFT } from '../types';

interface NFTGalleryProps {
  nfts: NFT[];
}

export function NFTGallery({ nfts }: NFTGalleryProps) {
  const handleNFTClick = (nft: NFT) => {
    window.open(`https://opensea.io/${nft.ownerAddress}`, '_blank');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Owned NFTs</h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {nfts.map((nft) => (
            <div
              key={nft.id}
              className="group relative cursor-pointer"
              onClick={() => handleNFTClick(nft)}
            >
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-opacity flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 text-white p-2 text-center">
                  <p className="text-sm font-medium mb-1">{nft.name}</p>
                  <p className="text-xs">
                    Bought: {new Date(nft.purchaseTime).toLocaleDateString()}
                  </p>
                  <p className="text-xs">
                    Price: {nft.purchasePrice} ETH
                  </p>
                  <p className="text-xs capitalize">
                    Network: {nft.network}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}