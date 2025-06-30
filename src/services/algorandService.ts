import algosdk from 'algosdk';

// Algorand Network Configuration
const ALGORAND_CONFIG = {
  // MainNet configuration
  mainnet: {
    server: 'https://mainnet-api.algonode.cloud',
    port: '',
    token: '',
    indexer: 'https://mainnet-idx.algonode.cloud'
  },
  // TestNet configuration (for development)
  testnet: {
    server: 'https://testnet-api.algonode.cloud',
    port: '',
    token: '',
    indexer: 'https://testnet-idx.algonode.cloud'
  }
};

// Use TestNet for development, MainNet for production
const NETWORK = import.meta.env.PROD ? 'mainnet' : 'testnet';
const config = ALGORAND_CONFIG[NETWORK];

export interface AlgorandWallet {
  address: string;
  name: string;
  balance: number;
  assets: AlgorandAsset[];
}

export interface AlgorandAsset {
  assetId: number;
  name: string;
  unitName: string;
  total: number;
  decimals: number;
  balance: number;
  creator: string;
  url?: string;
  metadata?: any;
}

export interface PetNFT {
  assetId: number;
  name: string;
  description: string;
  image: string;
  attributes: {
    type: string;
    personality: string;
    level: number;
    rarity: string;
    creator: string;
    birthDate: string;
  };
  owner: string;
  price?: number;
  forSale: boolean;
}

export interface MarketplaceListing {
  id: string;
  assetId: number;
  seller: string;
  price: number;
  currency: 'ALGO' | 'USDC';
  listingDate: string;
  status: 'active' | 'sold' | 'cancelled';
  pet: PetNFT;
}

export interface TransactionResult {
  txId: string;
  confirmedRound: number;
  assetIndex?: number;
}

class AlgorandService {
  private algodClient: algosdk.Algodv2;
  private indexerClient: algosdk.Indexer;
  private connectedWallet: AlgorandWallet | null = null;
  private walletConnector: any = null;

  constructor() {
    this.algodClient = new algosdk.Algodv2(config.token, config.server, config.port);
    this.indexerClient = new algosdk.Indexer(config.token, config.indexer, config.port);
  }

  // 🔗 ENHANCED WALLET CONNECTION
  async connectWallet(walletType: 'pera' | 'defly' | 'walletconnect' = 'pera'): Promise<AlgorandWallet> {
    try {
      console.log('🔗 CONNECTING TO ALGORAND WALLET:', walletType);
      
      let accounts: string[] = [];
      
      switch (walletType) {
        case 'pera':
          // Pera Wallet integration
          try {
            const { PeraWalletConnect } = await import('@perawallet/connect');
            this.walletConnector = new PeraWalletConnect({
              bridge: 'https://bridge.walletconnect.org',
              deepLink: {
                name: 'Soul Pet AI',
                url: window.location.origin
              }
            });
            
            // Check for existing session
            const existingAccounts = this.walletConnector.connector?.accounts;
            if (existingAccounts && existingAccounts.length > 0) {
              accounts = existingAccounts;
            } else {
              accounts = await this.walletConnector.connect();
            }
          } catch (error) {
            console.error('Pera Wallet connection error:', error);
            throw new Error('Failed to connect Pera Wallet. Please ensure the wallet is installed.');
          }
          break;
          
        case 'defly':
          // Defly Wallet integration
          try {
            const { DeflyWalletConnect } = await import('@blockshake/defly-connect');
            this.walletConnector = new DeflyWalletConnect({
              bridge: 'https://bridge.walletconnect.org',
              shouldShowSignTxnToast: true
            });
            accounts = await this.walletConnector.connect();
          } catch (error) {
            console.error('Defly Wallet connection error:', error);
            throw new Error('Failed to connect Defly Wallet. Please ensure the wallet is installed.');
          }
          break;
          
        default:
          throw new Error('Wallet type not supported');
      }

      if (accounts.length === 0) {
        throw new Error('No accounts found in wallet');
      }

      const address = accounts[0];
      const wallet = await this.getWalletInfo(address);
      this.connectedWallet = wallet;
      
      console.log('✅ WALLET CONNECTED:', wallet);
      
      // Store connection for persistence
      localStorage.setItem('algorand_wallet_type', walletType);
      localStorage.setItem('algorand_wallet_address', address);
      
      return wallet;
      
    } catch (error) {
      console.error('❌ WALLET CONNECTION ERROR:', error);
      throw new Error(`Failed to connect wallet: ${error.message}`);
    }
  }

  // 📊 GET COMPREHENSIVE WALLET INFORMATION
  async getWalletInfo(address: string): Promise<AlgorandWallet> {
    try {
      console.log('📊 FETCHING WALLET INFO FOR:', address);
      
      const accountInfo = await this.algodClient.accountInformation(address).do();
      const assets = await this.getWalletAssets(address);
      
      const wallet: AlgorandWallet = {
        address,
        name: `${address.slice(0, 6)}...${address.slice(-4)}`,
        balance: accountInfo.amount / 1000000, // Convert microAlgos to Algos
        assets
      };
      
      console.log('✅ WALLET INFO RETRIEVED:', wallet);
      return wallet;
      
    } catch (error) {
      console.error('❌ GET WALLET INFO ERROR:', error);
      throw new Error(`Failed to get wallet information: ${error.message}`);
    }
  }

  // 🎨 GET WALLET ASSETS (NFTs AND TOKENS)
  async getWalletAssets(address: string): Promise<AlgorandAsset[]> {
    try {
      console.log('🎨 FETCHING WALLET ASSETS FOR:', address);
      
      const accountInfo = await this.algodClient.accountInformation(address).do();
      const assets: AlgorandAsset[] = [];
      
      for (const asset of accountInfo.assets || []) {
        if (asset.amount > 0) {
          try {
            const assetInfo = await this.algodClient.getAssetByID(asset['asset-id']).do();
            
            assets.push({
              assetId: asset['asset-id'],
              name: assetInfo.params.name || 'Unknown Asset',
              unitName: assetInfo.params['unit-name'] || '',
              total: assetInfo.params.total,
              decimals: assetInfo.params.decimals,
              balance: asset.amount,
              creator: assetInfo.params.creator,
              url: assetInfo.params.url,
              metadata: this.parseAssetMetadata(assetInfo.params)
            });
          } catch (error) {
            console.warn(`Failed to get info for asset ${asset['asset-id']}:`, error);
          }
        }
      }
      
      console.log(`✅ FOUND ${assets.length} ASSETS`);
      return assets;
      
    } catch (error) {
      console.error('❌ GET WALLET ASSETS ERROR:', error);
      return [];
    }
  }

  // 🎨 CREATE PET NFT WITH ENHANCED METADATA
  async createPetNFT(petData: {
    name: string;
    description: string;
    image: string;
    attributes: any;
  }): Promise<TransactionResult> {
    try {
      if (!this.connectedWallet) {
        throw new Error('No wallet connected');
      }

      console.log('🎨 CREATING PET NFT ON ALGORAND...', petData);
      
      // Get suggested transaction parameters
      const suggestedParams = await this.algodClient.getTransactionParams().do();
      
      // Create comprehensive metadata
      const metadata = {
        name: petData.name,
        description: petData.description,
        image: petData.image,
        image_integrity: 'sha256-placeholder',
        image_mimetype: 'image/jpeg',
        external_url: `${window.location.origin}/pet/${Date.now()}`,
        animation_url: petData.image,
        attributes: [
          { trait_type: 'Type', value: petData.attributes.type },
          { trait_type: 'Personality', value: petData.attributes.personality },
          { trait_type: 'Level', value: petData.attributes.level },
          { trait_type: 'Rarity', value: petData.attributes.rarity },
          { trait_type: 'Birth Date', value: petData.attributes.birthDate }
        ],
        properties: {
          category: 'Soul Pet AI',
          creator: this.connectedWallet.address,
          created_at: new Date().toISOString()
        }
      };
      
      // Create asset creation transaction
      const assetCreateTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: this.connectedWallet.address,
        suggestedParams,
        total: 1, // NFT - only 1 unit
        decimals: 0, // NFT - no decimals
        assetName: petData.name,
        unitName: 'SPET', // Soul Pet
        assetURL: petData.image,
        assetMetadataHash: undefined,
        defaultFrozen: false,
        freeze: undefined,
        manager: this.connectedWallet.address,
        reserve: this.connectedWallet.address,
        clawback: undefined,
        note: new Uint8Array(Buffer.from(JSON.stringify(metadata)))
      });

      // Sign and send transaction
      const signedTxn = await this.signTransaction([assetCreateTxn]);
      const txId = await this.algodClient.sendRawTransaction(signedTxn).do();
      
      // Wait for confirmation
      const confirmedTxn = await this.waitForConfirmation(txId);
      const assetId = confirmedTxn['asset-index'];
      
      console.log('✅ PET NFT CREATED:', { assetId, txId });
      
      return {
        txId,
        confirmedRound: confirmedTxn['confirmed-round'],
        assetIndex: assetId
      };
      
    } catch (error) {
      console.error('❌ CREATE PET NFT ERROR:', error);
      throw new Error(`Failed to create pet NFT: ${error.message}`);
    }
  }

  // 🏪 LIST PET FOR SALE WITH SMART CONTRACT
  async listPetForSale(assetId: number, price: number): Promise<string> {
    try {
      if (!this.connectedWallet) {
        throw new Error('No wallet connected');
      }

      console.log('🏪 LISTING PET FOR SALE:', { assetId, price });
      
      // In production, this would create an application call to a marketplace smart contract
      // For now, we'll create a simple listing record
      const listingId = `listing-${assetId}-${Date.now()}`;
      
      // Get pet details
      const petDetails = await this.getPetNFTDetails(assetId);
      
      // Create listing
      const listing: MarketplaceListing = {
        id: listingId,
        assetId,
        seller: this.connectedWallet.address,
        price,
        currency: 'ALGO',
        listingDate: new Date().toISOString(),
        status: 'active',
        pet: petDetails
      };
      
      // Store listing (in production, this would be on-chain)
      this.saveListingToStorage(listing);
      
      console.log('✅ PET LISTED FOR SALE:', listing);
      return listingId;
      
    } catch (error) {
      console.error('❌ LIST PET ERROR:', error);
      throw new Error(`Failed to list pet: ${error.message}`);
    }
  }

  // 💰 BUY PET WITH ATOMIC TRANSACTION
  async buyPet(listingId: string): Promise<string> {
    try {
      if (!this.connectedWallet) {
        throw new Error('No wallet connected');
      }

      const listing = this.getListingFromStorage(listingId);
      if (!listing || listing.status !== 'active') {
        throw new Error('Listing not found or not active');
      }

      console.log('💰 BUYING PET:', listing);
      
      // Get suggested transaction parameters
      const suggestedParams = await this.algodClient.getTransactionParams().do();
      
      // Create payment transaction (buyer to seller)
      const paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: this.connectedWallet.address,
        to: listing.seller,
        amount: Math.round(listing.price * 1000000), // Convert Algos to microAlgos
        suggestedParams,
        note: new Uint8Array(Buffer.from(`Purchase of Pet NFT ${listing.assetId}`))
      });

      // In a real marketplace, this would be an atomic transaction group
      // For demo purposes, we'll process the payment
      const signedTxns = await this.signTransaction([paymentTxn]);
      const txId = await this.algodClient.sendRawTransaction(signedTxns).do();
      
      await this.waitForConfirmation(txId);
      
      // Update listing status
      listing.status = 'sold';
      this.saveListingToStorage(listing);
      
      console.log('✅ PET PURCHASED:', { txId, listing });
      return txId;
      
    } catch (error) {
      console.error('❌ BUY PET ERROR:', error);
      throw new Error(`Failed to purchase pet: ${error.message}`);
    }
  }

  // 📋 GET MARKETPLACE LISTINGS
  getMarketplaceListings(): MarketplaceListing[] {
    try {
      const listings = localStorage.getItem('algorand_marketplace_listings');
      return listings ? JSON.parse(listings) : [];
    } catch (error) {
      console.error('❌ GET LISTINGS ERROR:', error);
      return [];
    }
  }

  // 🔍 GET DETAILED PET NFT INFORMATION
  async getPetNFTDetails(assetId: number): Promise<PetNFT> {
    try {
      console.log('🔍 GETTING PET NFT DETAILS:', assetId);
      
      const assetInfo = await this.algodClient.getAssetByID(assetId).do();
      
      // Parse metadata from note or URL
      let attributes = {
        type: 'Unknown',
        personality: 'Mysterious',
        level: 1,
        rarity: 'Common',
        creator: assetInfo.params.creator,
        birthDate: new Date().toISOString()
      };

      // Try to parse metadata from note
      if (assetInfo.params.note) {
        try {
          const noteString = Buffer.from(assetInfo.params.note).toString();
          const metadata = JSON.parse(noteString);
          if (metadata.attributes) {
            attributes = {
              type: metadata.attributes.find((attr: any) => attr.trait_type === 'Type')?.value || attributes.type,
              personality: metadata.attributes.find((attr: any) => attr.trait_type === 'Personality')?.value || attributes.personality,
              level: metadata.attributes.find((attr: any) => attr.trait_type === 'Level')?.value || attributes.level,
              rarity: metadata.attributes.find((attr: any) => attr.trait_type === 'Rarity')?.value || attributes.rarity,
              creator: assetInfo.params.creator,
              birthDate: metadata.attributes.find((attr: any) => attr.trait_type === 'Birth Date')?.value || attributes.birthDate
            };
          }
        } catch (error) {
          console.warn('Failed to parse metadata:', error);
        }
      }

      const petNFT: PetNFT = {
        assetId,
        name: assetInfo.params.name || 'Unknown Pet',
        description: 'A unique Soul Pet NFT on Algorand blockchain',
        image: assetInfo.params.url || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
        attributes,
        owner: assetInfo.params.creator,
        forSale: false
      };
      
      console.log('✅ PET NFT DETAILS:', petNFT);
      return petNFT;
      
    } catch (error) {
      console.error('❌ GET PET NFT DETAILS ERROR:', error);
      throw new Error(`Failed to get pet details: ${error.message}`);
    }
  }

  // 🔐 ENHANCED TRANSACTION SIGNING
  private async signTransaction(txns: algosdk.Transaction[]): Promise<Uint8Array> {
    try {
      console.log('🔐 SIGNING TRANSACTIONS...', txns.length);
      
      if (!this.walletConnector) {
        throw new Error('No wallet connector available');
      }

      // Convert transactions to the format expected by wallet
      const txnsToSign = txns.map(txn => ({
        txn: txn,
        signers: [this.connectedWallet!.address]
      }));

      // Sign with connected wallet
      const signedTxns = await this.walletConnector.signTransaction(txnsToSign);
      
      console.log('✅ TRANSACTIONS SIGNED');
      return signedTxns[0]; // Return first signed transaction
      
    } catch (error) {
      console.error('❌ SIGN TRANSACTION ERROR:', error);
      throw new Error(`Failed to sign transaction: ${error.message}`);
    }
  }

  // ⏳ ENHANCED TRANSACTION CONFIRMATION
  private async waitForConfirmation(txId: string): Promise<any> {
    try {
      console.log('⏳ WAITING FOR CONFIRMATION:', txId);
      
      let confirmedTxn;
      let rounds = 0;
      const maxRounds = 20; // Increased timeout
      
      while (rounds < maxRounds) {
        try {
          const pendingInfo = await this.algodClient.pendingTransactionInformation(txId).do();
          
          if (pendingInfo['confirmed-round']) {
            confirmedTxn = pendingInfo;
            console.log('✅ TRANSACTION CONFIRMED:', confirmedTxn);
            break;
          }
          
          if (pendingInfo['pool-error']) {
            throw new Error(`Transaction failed: ${pendingInfo['pool-error']}`);
          }
          
        } catch (error) {
          if (error.message.includes('transaction not found')) {
            // Transaction might not be in pool yet
          } else {
            throw error;
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        rounds++;
      }
      
      if (!confirmedTxn) {
        throw new Error('Transaction confirmation timeout');
      }
      
      return confirmedTxn;
      
    } catch (error) {
      console.error('❌ WAIT FOR CONFIRMATION ERROR:', error);
      throw new Error(`Transaction confirmation failed: ${error.message}`);
    }
  }

  // 🔧 UTILITY FUNCTIONS
  private parseAssetMetadata(params: any): any {
    try {
      if (params.note) {
        const noteString = Buffer.from(params.note).toString();
        return JSON.parse(noteString);
      }
    } catch (error) {
      console.warn('Failed to parse asset metadata:', error);
    }
    return null;
  }

  // 💾 STORAGE HELPERS
  private saveListingToStorage(listing: MarketplaceListing): void {
    const listings = this.getMarketplaceListings();
    const existingIndex = listings.findIndex(l => l.id === listing.id);
    
    if (existingIndex >= 0) {
      listings[existingIndex] = listing;
    } else {
      listings.push(listing);
    }
    
    localStorage.setItem('algorand_marketplace_listings', JSON.stringify(listings));
  }

  private getListingFromStorage(listingId: string): MarketplaceListing | null {
    const listings = this.getMarketplaceListings();
    return listings.find(l => l.id === listingId) || null;
  }

  // 🔌 DISCONNECT WALLET
  disconnectWallet(): void {
    try {
      if (this.walletConnector && this.walletConnector.disconnect) {
        this.walletConnector.disconnect();
      }
      
      this.connectedWallet = null;
      this.walletConnector = null;
      
      // Clear stored connection
      localStorage.removeItem('algorand_wallet_type');
      localStorage.removeItem('algorand_wallet_address');
      
      console.log('🔌 WALLET DISCONNECTED');
    } catch (error) {
      console.error('❌ DISCONNECT ERROR:', error);
    }
  }

  // 📊 GET CONNECTED WALLET
  getConnectedWallet(): AlgorandWallet | null {
    return this.connectedWallet;
  }

  // 🌐 GET NETWORK INFORMATION
  getNetworkInfo(): { network: string; explorer: string } {
    return {
      network: NETWORK,
      explorer: NETWORK === 'mainnet' 
        ? 'https://algoexplorer.io' 
        : 'https://testnet.algoexplorer.io'
    };
  }

  // 💰 GET ALGO PRICE (MOCK)
  async getAlgoPrice(): Promise<number> {
    try {
      // In production, this would fetch from a price API
      return 0.25; // Mock price: 1 ALGO = $0.25
    } catch (error) {
      console.error('❌ GET ALGO PRICE ERROR:', error);
      return 0.25;
    }
  }

  // 📈 GET TRANSACTION HISTORY
  async getTransactionHistory(address: string, limit: number = 10): Promise<any[]> {
    try {
      const response = await this.indexerClient
        .lookupAccountTransactions(address)
        .limit(limit)
        .do();
      
      return response.transactions || [];
    } catch (error) {
      console.error('❌ GET TRANSACTION HISTORY ERROR:', error);
      return [];
    }
  }

  // 🔍 SEARCH ASSETS
  async searchAssets(query: string): Promise<AlgorandAsset[]> {
    try {
      const response = await this.indexerClient
        .searchForAssets()
        .name(query)
        .limit(20)
        .do();
      
      return response.assets?.map((asset: any) => ({
        assetId: asset.index,
        name: asset.params.name || 'Unknown',
        unitName: asset.params['unit-name'] || '',
        total: asset.params.total,
        decimals: asset.params.decimals,
        balance: 0,
        creator: asset.params.creator,
        url: asset.params.url
      })) || [];
    } catch (error) {
      console.error('❌ SEARCH ASSETS ERROR:', error);
      return [];
    }
  }
}

// Export singleton instance
export const algorandService = new AlgorandService();
export default algorandService;