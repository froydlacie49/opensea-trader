import { openSeaService } from './opensea';
import type { NetworkSettings, Settings, ActivityLog } from '../types';
import { ethers } from 'ethers';

export class AutomationService {
  private isRunning: boolean = false;
  private settings: Settings;
  private activityCallback: (message: string, type?: ActivityLog['type']) => void;

  constructor(settings: Settings, activityCallback: (message: string, type?: ActivityLog['type']) => void) {
    this.settings = settings;
    this.activityCallback = activityCallback;
  }

  private log(message: string, type: ActivityLog['type'] = 'info') {
    this.activityCallback(message, type);
  }

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getRandomNetwork(): [string, NetworkSettings] {
    const enabledNetworks = Object.entries(this.settings.networks)
      .filter(([_, settings]) => settings.enabled);
    
    if (enabledNetworks.length === 0) {
      throw new Error('No networks enabled');
    }

    return enabledNetworks[Math.floor(Math.random() * enabledNetworks.length)];
  }

  private isPriceWithinLimits(price: number, networkSettings: NetworkSettings): boolean {
    return price >= networkSettings.minPrice && price <= networkSettings.maxPrice;
  }

  private calculateOfferPrice(floorPrice: number, maxOfferPrice: number): number {
    // maxOfferPrice is a percentage below floor price (e.g. -20 means 20% below floor)
    return floorPrice * (1 + maxOfferPrice / 100);
  }

  async start() {
    if (this.isRunning) {
      this.log('Automation is already running', 'warning');
      return;
    }

    this.isRunning = true;
    this.log('Starting automation', 'info');

    // Start the automation loop
    this.runAutomation();
  }

  private async runAutomation() {
    while (this.isRunning) {
      try {
        // Randomly choose between making an offer or buying
        const action = Math.random() > 0.5 ? 'offer' : 'buy';
        const [network, networkSettings] = this.getRandomNetwork();

        this.log(`Checking ${network} network for opportunities...`, 'info');

        // Get top collections
        const collections = await openSeaService.getTopCollections(network);
        const randomCollection = collections[Math.floor(Math.random() * collections.length)];
        
        this.log(`Analyzing collection: ${randomCollection.name}`, 'info');
        
        const floorPrice = await openSeaService.getFloorPrice(randomCollection.slug, network);
        
        if (!this.isPriceWithinLimits(floorPrice, networkSettings)) {
          this.log(`Floor price ${floorPrice} outside limits for collection ${randomCollection.name}`, 'info');
          await this.sleep(30000); // Wait 30 seconds before next attempt
          continue;
        }

        // Get a random NFT from the collection
        const nft = await openSeaService.getRandomNFTFromCollection(randomCollection.slug, network);

        if (action === 'offer') {
          const offerPrice = this.calculateOfferPrice(floorPrice, networkSettings.maxOfferPrice);
          
          this.log(`Making offer for ${nft.name} at ${offerPrice} ETH`, 'info');
          await openSeaService.makeOffer(
            nft.contract,
            nft.tokenId,
            ethers.utils.parseEther(offerPrice.toString()).toString(),
            Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 24 hours expiration
          );
          this.log(`Successfully made offer for ${nft.name}`, 'success');
        } else {
          if (networkSettings.buyFreeNFTs || floorPrice > 0) {
            this.log(`Attempting to buy ${nft.name} at ${floorPrice} ETH`, 'info');
            await openSeaService.buyNFT(
              nft.contract,
              nft.tokenId,
              ethers.utils.parseEther(floorPrice.toString()).toString()
            );
            this.log(`Successfully bought ${nft.name}`, 'success');
          }
        }

        // Random delay between 5 and 15 minutes
        const delay = 5 * 60 * 1000 + Math.random() * 10 * 60 * 1000;
        this.log(`Waiting ${Math.floor(delay / 1000 / 60)} minutes before next action`, 'info');
        await this.sleep(delay);

      } catch (error) {
        this.log(`Error during automation: ${error.message}`, 'error');
        await this.sleep(60000); // Wait 1 minute before retrying after error
      }
    }
  }

  stop() {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    this.log('Stopping automation', 'warning');
  }

  updateSettings(settings: Settings) {
    this.settings = settings;
  }
}
