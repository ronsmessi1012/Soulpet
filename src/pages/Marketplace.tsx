import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  Heart, 
  TrendingUp, 
  Crown, 
  Zap,
  Eye,
  ShoppingCart,
  Users,
  Wallet,
  Shield,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Coins,
  Globe,
  Lock,
  Unlock,
  RefreshCw,
  ArrowUpRight,
  DollarSign,
  CreditCard,
  Loader
} from 'lucide-react';
import { algorandService, AlgorandWallet, PetNFT, MarketplaceListing } from '../services/algorandService';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [connectedWallet, setConnectedWallet] = useState<AlgorandWallet | null>(null);
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [networkInfo, setNetworkInfo] = useState({ network: '', explorer: '' });

  const categories = [
    { id: 'all', name: 'All Pets', count: 1247 },
    { id: 'dogs', name: 'Dogs', count: 423 },
    { id: 'cats', name: 'Cats', count: 367 },
    { id: 'dragons', name: 'Dragons', count: 189 },
    { id: 'unicorns', name: 'Unicorns', count: 156 },
    { id: 'rare', name: 'Rare Pets', count: 112 }
  ];

  // Mock enhanced listings with Algorand integration
  const mockListings: MarketplaceListing[] = [
    {
      id: 'listing-1',
      assetId: 1001,
      seller: 'SELLER1ALGORANDADDRESS123456789ABCDEFGHIJKLMNOP',
      price: 15.5,
      currency: 'ALGO',
      listingDate: new Date().toISOString(),
      status: 'active',
      pet: {
        assetId: 1001,
        name: 'Golden Retriever Max',
        description: 'A loyal and energetic companion with verified blockchain ownership',
        image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
        attributes: {
          type: 'Dog',
          personality: 'Playful',
          level: 25,
          rarity: 'Epic',
          creator: 'CREATOR1ALGORANDADDRESS123456789ABCDEFGHIJKLMNOP',
          birthDate: '2024-01-15'
        },
        owner: 'SELLER1ALGORANDADDRESS123456789ABCDEFGHIJKLMNOP',
        forSale: true
      }
    },
    {
      id: 'listing-2',
      assetId: 1002,
      seller: 'SELLER2ALGORANDADDRESS123456789ABCDEFGHIJKLMNOP',
      price: 45.2,
      currency: 'ALGO',
      listingDate: new Date().toISOString(),
      status: 'active',
      pet: {
        assetId: 1002,
        name: 'Mystical Dragon Blaze',
        description: 'An ancient dragon with programmable smart contract abilities',
        image: 'https://images.pexels.com/photos/2835436/pexels-photo-2835436.jpeg?auto=compress&cs=tinysrgb&w=400',
        attributes: {
          type: 'Dragon',
          personality: 'Wise',
          level: 42,
          rarity: 'Legendary',
          creator: 'CREATOR2ALGORANDADDRESS123456789ABCDEFGHIJKLMNOP',
          birthDate: '2024-01-10'
        },
        owner: 'SELLER2ALGORANDADDRESS123456789ABCDEFGHIJKLMNOP',
        forSale: true
      }
    },
    {
      id: 'listing-3',
      assetId: 1003,
      seller: 'SELLER3ALGORANDADDRESS123456789ABCDEFGHIJKLMNOP',
      price: 8.7,
      currency: 'ALGO',
      listingDate: new Date().toISOString(),
      status: 'active',
      pet: {
        assetId: 1003,
        name: 'Persian Cat Luna',
        description: 'Elegant feline with verifiable provenance on Algorand',
        image: 'https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=400',
        attributes: {
          type: 'Cat',
          personality: 'Mysterious',
          level: 18,
          rarity: 'Rare',
          creator: 'CREATOR3ALGORANDADDRESS123456789ABCDEFGHIJKLMNOP',
          birthDate: '2024-01-20'
        },
        owner: 'SELLER3ALGORANDADDRESS123456789ABCDEFGHIJKLMNOP',
        forSale: true
      }
    }
  ];

  useEffect(() => {
    // Initialize marketplace
    loadMarketplaceData();
    setNetworkInfo(algorandService.getNetworkInfo());
    
    // Check for existing wallet connection
    const existingWallet = algorandService.getConnectedWallet();
    if (existingWallet) {
      setConnectedWallet(existingWallet);
    }
  }, []);

  const loadMarketplaceData = async () => {
    setLoading(true);
    try {
      // In production, this would fetch from Algorand indexer
      const marketplaceListings = algorandService.getMarketplaceListings();
      
      // Use mock data if no real listings
      if (marketplaceListings.length === 0) {
        setListings(mockListings);
      } else {
        setListings(marketplaceListings);
      }
    } catch (error) {
      console.error('Failed to load marketplace data:', error);
      setListings(mockListings);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = async (walletType: 'pera' | 'defly' = 'pera') => {
    setConnecting(true);
    try {
      const wallet = await algorandService.connectWallet(walletType);
      setConnectedWallet(wallet);
      console.log('Wallet connected:', wallet);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert(`Failed to connect ${walletType} wallet. Please make sure you have the wallet installed and try again.`);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    algorandService.disconnectWallet();
    setConnectedWallet(null);
  };

  const handlePurchase = async (listing: MarketplaceListing) => {
    if (!connectedWallet) {
      alert('Please connect your Algorand wallet first');
      return;
    }

    if (connectedWallet.balance < listing.price) {
      alert(`Insufficient ALGO balance. You need ${listing.price} ALGO but only have ${connectedWallet.balance.toFixed(2)} ALGO`);
      return;
    }

    setSelectedListing(listing);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = async () => {
    if (!selectedListing || !connectedWallet) return;

    setPurchasing(selectedListing.id);
    try {
      const txId = await algorandService.buyPet(selectedListing.id);
      
      // Update listings
      setListings(prev => prev.map(listing => 
        listing.id === selectedListing.id 
          ? { ...listing, status: 'sold' as const }
          : listing
      ));
      
      // Update wallet balance (approximate)
      setConnectedWallet(prev => prev ? {
        ...prev,
        balance: prev.balance - selectedListing.price
      } : null);
      
      alert(`Successfully purchased ${selectedListing.pet.name}! Transaction ID: ${txId}`);
      setShowPurchaseModal(false);
      
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-600 bg-gray-100 border-gray-300';
      case 'Rare': return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'Epic': return 'text-purple-600 bg-purple-100 border-purple-300';
      case 'Legendary': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'Mythical': return 'text-pink-600 bg-pink-100 border-pink-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.pet.attributes.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           listing.pet.attributes.type.toLowerCase() === selectedCategory.slice(0, -1);
    const isActive = listing.status === 'active';
    
    return matchesSearch && matchesCategory && isActive;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Purchase Confirmation Modal */}
      {showPurchaseModal && selectedListing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="backdrop-blur-2xl bg-white/95 border border-white/40 rounded-3xl shadow-2xl p-8 max-w-lg w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Confirm Purchase</h3>
            
            <div className="text-center mb-6">
              <img
                src={selectedListing.pet.image}
                alt={selectedListing.pet.name}
                className="w-32 h-32 rounded-2xl mx-auto mb-4 object-cover"
              />
              <h4 className="text-xl font-bold text-gray-800">{selectedListing.pet.name}</h4>
              <p className="text-gray-600">{selectedListing.pet.attributes.type} • {selectedListing.pet.attributes.personality}</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700">Price:</span>
                <span className="text-2xl font-bold text-blue-600">{selectedListing.price} ALGO</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700">Your Balance:</span>
                <span className="font-bold text-gray-800">{connectedWallet?.balance.toFixed(2)} ALGO</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">After Purchase:</span>
                <span className="font-bold text-green-600">
                  {((connectedWallet?.balance || 0) - selectedListing.price).toFixed(2)} ALGO
                </span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-6">
              <div className="flex items-center mb-2">
                <Shield className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="font-bold text-yellow-800">Blockchain Security</span>
              </div>
              <p className="text-yellow-700 text-sm">
                This transaction will be secured on the Algorand blockchain with instant finality and low fees.
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-2xl font-semibold hover:bg-gray-300 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmPurchase}
                disabled={purchasing === selectedListing.id}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
              >
                {purchasing === selectedListing.id ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Confirm Purchase
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-8 w-full">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header with Algorand Branding */}
          <div className="text-center mb-12">
            <div className="backdrop-blur-2xl bg-white/30 border border-white/30 p-8 rounded-3xl shadow-2xl">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                <Globe className="h-10 w-10 mr-4 text-blue-600 animate-pulse" />
                Algorand Pet Marketplace
                <Shield className="h-8 w-8 ml-4 text-green-600" />
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Discover, collect, and trade unique AI pets on the Algorand blockchain
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                  Instant Transactions
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-green-500" />
                  Trustless Payments
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-blue-500" />
                  Global Scale
                </div>
              </div>
            </div>

            {/* Wallet Connection Section */}
            <div className="mt-8">
              {!connectedWallet ? (
                <div className="backdrop-blur-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-white/30 p-6 rounded-3xl shadow-2xl">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center">
                    <Wallet className="h-6 w-6 mr-3 text-blue-600" />
                    Connect Your Algorand Wallet
                  </h3>
                  <p className="text-gray-600 mb-6">Connect your wallet to buy, sell, and manage your pet NFTs</p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => handleConnectWallet('pera')}
                      disabled={connecting}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center"
                    >
                      {connecting ? (
                        <Loader className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <Wallet className="h-5 w-5 mr-2" />
                      )}
                      Pera Wallet
                    </button>
                    <button
                      onClick={() => handleConnectWallet('defly')}
                      disabled={connecting}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center"
                    >
                      {connecting ? (
                        <Loader className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <Wallet className="h-5 w-5 mr-2" />
                      )}
                      Defly Wallet
                    </button>
                  </div>
                </div>
              ) : (
                <div className="backdrop-blur-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-white/30 p-6 rounded-3xl shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">Wallet Connected</div>
                        <div className="text-gray-600">{formatAddress(connectedWallet.address)}</div>
                        <div className="text-sm text-gray-500">
                          Network: {networkInfo.network} • Balance: {connectedWallet.balance.toFixed(2)} ALGO
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <a
                        href={`${networkInfo.explorer}/address/${connectedWallet.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors duration-300"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                      <button
                        onClick={handleDisconnectWallet}
                        className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors duration-300"
                      >
                        <Unlock className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search and Filter Bar */}
            <div className="max-w-4xl mx-auto mt-8">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search pets by name, type, or traits..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="level">Highest Level</option>
                    <option value="newest">Newest</option>
                  </select>
                  
                  <button className="px-6 py-3 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors duration-300 flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1 w-full">
              <div className="backdrop-blur-2xl bg-white/95 border border-white/40 rounded-3xl shadow-2xl p-8 sticky top-24 categories-sidebar">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Filter className="h-6 w-6 mr-3 text-purple-500" />
                  Categories
                </h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-6 py-4 rounded-2xl transition-all duration-300 border ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-xl border-purple-300'
                          : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600 bg-white/60 border-white/40 hover:border-purple-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-lg">{category.name}</span>
                        <span className={`text-sm px-3 py-1 rounded-full ${
                          selectedCategory === category.id 
                            ? 'bg-white/20 text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {category.count}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Algorand Network Stats */}
                <div className="mt-8 p-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl text-white shadow-xl">
                  <h4 className="font-bold mb-4 text-lg flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Algorand Stats
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <Zap className="h-4 w-4 mr-2" />
                        Transaction Speed:
                      </span>
                      <span className="font-bold">4.5 seconds</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Transaction Fee:
                      </span>
                      <span className="font-bold">0.001 ALGO</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Security:
                      </span>
                      <span className="font-bold">Pure PoS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pet Listings Grid */}
            <div className="lg:col-span-3 w-full">
              {loading ? (
                <div className="text-center py-20">
                  <Loader className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-600" />
                  <p className="text-xl text-gray-600">Loading marketplace...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="backdrop-blur-2xl bg-white/95 border border-white/40 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden group cursor-pointer hover:scale-105"
                    >
                      <div className="relative">
                        <img
                          src={listing.pet.image}
                          alt={listing.pet.name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Blockchain Verification Badge */}
                        <div className="absolute top-3 left-3">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center shadow-lg">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </div>
                        </div>
                        
                        <div className="absolute top-3 right-3">
                          <div className={`px-3 py-2 rounded-xl text-xs font-bold shadow-lg border ${getRarityColor(listing.pet.attributes.rarity)}`}>
                            {listing.pet.attributes.rarity}
                          </div>
                        </div>
                        
                        <div className="absolute bottom-3 left-3">
                          <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center shadow-lg">
                            <Star className="h-3 w-3 mr-1" />
                            Level {listing.pet.attributes.level}
                          </div>
                        </div>
                        
                        <div className="absolute bottom-3 right-3 flex space-x-2">
                          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-xl hover:bg-white transition-colors duration-300 shadow-lg hover:scale-110">
                            <Heart className="h-4 w-4 text-red-500" />
                          </button>
                          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-xl hover:bg-white transition-colors duration-300 shadow-lg hover:scale-110">
                            <Eye className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{listing.pet.name}</h3>
                            <p className="text-gray-600">{listing.pet.attributes.type} • {listing.pet.attributes.personality}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600 flex items-center">
                              {listing.price} ALGO
                              <Globe className="h-4 w-4 ml-1" />
                            </div>
                            <div className="text-xs text-gray-500">≈ ${(listing.price * 0.25).toFixed(2)} USD</div>
                          </div>
                        </div>
                        
                        {/* Blockchain Info */}
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-xl mb-4">
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Shield className="h-4 w-4 mr-2 text-blue-600" />
                            <span>Asset ID: {listing.assetId}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-1" />
                            <span className="mr-4">Owner: {formatAddress(listing.seller)}</span>
                            <a
                              href={`${networkInfo.explorer}/asset/${listing.assetId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 flex items-center"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View on Explorer
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-xl text-xs font-medium border border-white/40">
                            {listing.pet.attributes.type}
                          </span>
                          <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-xl text-xs font-medium border border-white/40">
                            {listing.pet.attributes.personality}
                          </span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handlePurchase(listing)}
                            disabled={!connectedWallet || purchasing === listing.id}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-2xl font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {purchasing === listing.id ? (
                              <Loader className="h-4 w-4 animate-spin" />
                            ) : !connectedWallet ? (
                              <>
                                <Lock className="h-4 w-4 mr-2" />
                                Connect Wallet
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Buy Now
                              </>
                            )}
                          </button>
                          <button className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 p-3 rounded-2xl hover:bg-gradient-to-r hover:from-purple-200 hover:to-pink-200 transition-all duration-300 hover:scale-110">
                            <Heart className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loading && filteredListings.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">No pets found</h3>
                  <p className="text-gray-600 text-lg">Try adjusting your search or filters!</p>
                  <button 
                    onClick={loadMarketplaceData}
                    className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-xl transition-all duration-300 flex items-center mx-auto"
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Refresh Marketplace
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;