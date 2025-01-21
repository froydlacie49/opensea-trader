import axios from 'axios';
import { ethers } from 'ethers';
import type { NetworkSettings } from '../types';

const OPENSEA_API_KEY = '0f7d7b10d31641b8a99cbf9a7d61899d';
const OPENSEA_API_URL = 'https://api.opensea.io/v2';
const OPENSEA_SEAPORT_ADDRESS = '0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC';

class OpenSeaService {
  private readonly apiKey: string;
  private provider?: ethers.providers.Web3Provider;

  constructor() {
    this.apiKey = OPENSEA_API_KEY;
    this.initializeProvider();
  }

  private async initializeProvider() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
    } else {
      console.warn('MetaMask not detected. Please install MetaMask to use this application.');
    }
  }

  private getProvider(): ethers.providers.Web3Provider {
    if (!this.provider) {
      throw new Error('Web3 provider not initialized. Please install MetaMask and refresh the page.');
    }
    return this.provider;
  }

  private async getAxiosConfig() {
    return {
      headers: {
        'X-API-KEY': this.apiKey,
        'Content-Type': 'application/json',
      },
    };
  }

  async getTopCollections(chain: string = 'ethereum') {
    try {
      const response = await axios.get(
        `${OPENSEA_API_URL}/collections/top`,
        {
          ...await this.getAxiosConfig(),
          params: {
            chain,
            limit: 50,
          },
        }
      );
      return response.data.collections;
    } catch (error) {
      console.error('Error fetching top collections:', error);
      throw error;
    }
  }

  async getRandomNFTFromCollection(collectionSlug: string, chain: string = 'ethereum') {
    try {
      const response = await axios.get(
        `${OPENSEA_API_URL}/collection/${collectionSlug}/nfts`,
        {
          ...await this.getAxiosConfig(),
          params: {
            chain,
            limit: 50,
          },
        }
      );
      const nfts = response.data.nfts;
      return nfts[Math.floor(Math.random() * nfts.length)];
    } catch (error) {
      console.error('Error fetching NFTs from collection:', error);
      throw error;
    }
  }

  async makeOffer(nftContract: string, tokenId: string, price: string, expirationTime: number) {
    try {
      const signer = this.getProvider().getSigner();
      const address = await signer.getAddress();
      
      const offerData = {
        offerer: address,
        contract: nftContract,
        tokenId,
        quantity: 1,
        paymentToken: '0x0000000000000000000000000000000000000000', // ETH
        price,
        expirationTime,
      };

      const response = await axios.post(
        `${OPENSEA_API_URL}/offers`,
        offerData,
        await this.getAxiosConfig()
      );
      
      return response.data;
    } catch (error) {
      console.error('Error making offer:', error);
      throw error;
    }
  }

  async buyNFT(nftContract: string, tokenId: string, price: string) {
    try {
      const signer = this.getProvider().getSigner();
      const address = await signer.getAddress();

      const fulfillData = {
        fulfiller: address,
        contract: nftContract,
        tokenId,
        quantity: 1,
        price,
      };

      const response = await axios.post(
        `${OPENSEA_API_URL}/fulfillments`,
        fulfillData,
        await this.getAxiosConfig()
      );

      return response.data;
    } catch (error) {
      console.error('Error buying NFT:', error);
      throw error;
    }
  }

  async getFloorPrice(collectionSlug: string, chain: string = 'ethereum') {
    try {
      const response = await axios.get(
        `${OPENSEA_API_URL}/collection/${collectionSlug}/stats`,
        await this.getAxiosConfig()
      );
      return response.data.stats.floor_price;
    } catch (error) {
      console.error('Error fetching floor price:', error);
      throw error;
    }
  }
}

export const openSeaService = new OpenSeaService();
