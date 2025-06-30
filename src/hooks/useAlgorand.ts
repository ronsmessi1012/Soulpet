import { useState, useEffect, useCallback } from 'react';
import { algorandService, AlgorandWallet, MarketplaceListing, TransactionResult } from '../services/algorandService';

export interface UseAlgorandReturn {
  // Wallet state
  connectedWallet: AlgorandWallet | null;
  connecting: boolean;
  
  // Marketplace state
  listings: MarketplaceListing[];
  loadingListings: boolean;
  
  // Transaction state
  transacting: boolean;
  
  // Network info
  networkInfo: { network: string; explorer: string };
  
  // Actions
  connectWallet: (walletType: 'pera' | 'defly') => Promise<void>;
  disconnectWallet: () => void;
  refreshWallet: () => Promise<void>;
  loadMarketplace: () => Promise<void>;
  createPetNFT: (petData: any) => Promise<TransactionResult>;
  buyPet: (listingId: string) => Promise<string>;
  listPetForSale: (assetId: number, price: number) => Promise<string>;
}

export const useAlgorand = (): UseAlgorandReturn => {
  const [connectedWallet, setConnectedWallet] = useState<AlgorandWallet | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [transacting, setTransacting] = useState(false);
  const [networkInfo, setNetworkInfo] = useState({ network: '', explorer: '' });

  // Initialize
  useEffect(() => {
    setNetworkInfo(algorandService.getNetworkInfo());
    
    // Check for existing wallet connection
    const existingWallet = algorandService.getConnectedWallet();
    if (existingWallet) {
      setConnectedWallet(existingWallet);
    }
    
    // Load marketplace
    loadMarketplace();
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async (walletType: 'pera' | 'defly') => {
    setConnecting(true);
    try {
      const wallet = await algorandService.connectWallet(walletType);
      setConnectedWallet(wallet);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setConnecting(false);
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    algorandService.disconnectWallet();
    setConnectedWallet(null);
  }, []);

  // Refresh wallet info
  const refreshWallet = useCallback(async () => {
    if (!connectedWallet) return;
    
    try {
      const updatedWallet = await algorandService.getWalletInfo(connectedWallet.address);
      setConnectedWallet(updatedWallet);
    } catch (error) {
      console.error('Failed to refresh wallet:', error);
    }
  }, [connectedWallet]);

  // Load marketplace listings
  const loadMarketplace = useCallback(async () => {
    setLoadingListings(true);
    try {
      const marketplaceListings = algorandService.getMarketplaceListings();
      setListings(marketplaceListings);
    } catch (error) {
      console.error('Failed to load marketplace:', error);
    } finally {
      setLoadingListings(false);
    }
  }, []);

  // Create pet NFT
  const createPetNFT = useCallback(async (petData: any): Promise<TransactionResult> => {
    if (!connectedWallet) {
      throw new Error('No wallet connected');
    }
    
    setTransacting(true);
    try {
      const result = await algorandService.createPetNFT(petData);
      await refreshWallet(); // Refresh wallet after transaction
      return result;
    } catch (error) {
      console.error('Failed to create pet NFT:', error);
      throw error;
    } finally {
      setTransacting(false);
    }
  }, [connectedWallet, refreshWallet]);

  // Buy pet
  const buyPet = useCallback(async (listingId: string): Promise<string> => {
    if (!connectedWallet) {
      throw new Error('No wallet connected');
    }
    
    setTransacting(true);
    try {
      const txId = await algorandService.buyPet(listingId);
      await refreshWallet(); // Refresh wallet after transaction
      await loadMarketplace(); // Refresh marketplace
      return txId;
    } catch (error) {
      console.error('Failed to buy pet:', error);
      throw error;
    } finally {
      setTransacting(false);
    }
  }, [connectedWallet, refreshWallet, loadMarketplace]);

  // List pet for sale
  const listPetForSale = useCallback(async (assetId: number, price: number): Promise<string> => {
    if (!connectedWallet) {
      throw new Error('No wallet connected');
    }
    
    setTransacting(true);
    try {
      const listingId = await algorandService.listPetForSale(assetId, price);
      await loadMarketplace(); // Refresh marketplace
      return listingId;
    } catch (error) {
      console.error('Failed to list pet:', error);
      throw error;
    } finally {
      setTransacting(false);
    }
  }, [connectedWallet, loadMarketplace]);

  return {
    // State
    connectedWallet,
    connecting,
    listings,
    loadingListings,
    transacting,
    networkInfo,
    
    // Actions
    connectWallet,
    disconnectWallet,
    refreshWallet,
    loadMarketplace,
    createPetNFT,
    buyPet,
    listPetForSale
  };
};

export default useAlgorand;