export interface Account {
  id: string;
  address: string;
  type: 'privateKey' | 'seedPhrase';
  name?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: number;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export interface NetworkSettings {
  enabled: boolean;
  minPrice: number;
  maxPrice: number;
  maxDailyBuyLimit: number;
}

export interface Settings {
  networks: {
    ethereum: NetworkSettings;
    bsc: NetworkSettings;
    polygon: NetworkSettings;
    arbitrum: NetworkSettings;
    base: NetworkSettings;
  };
}

export interface NFT {
  id: string;
  name: string;
  image: string;
  network: keyof Settings['networks'];
  purchaseTime: number;
  purchasePrice: number;
  ownerAddress: string;
}

export interface ActiveOffer {
  id: string;
  collectionName: string;
  itemNumber: string;
  floorPrice: number;
  offerAmount: number;
  offerTime: number;
  network: keyof Settings['networks'];
}