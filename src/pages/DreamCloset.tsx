import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Coins, 
  Star, 
  Crown, 
  Sparkles,
  Heart,
  Filter,
  Search,
  Gift,
  Zap,
  Lock,
  Unlock,
  TrendingUp,
  Award,
  Gem,
  Palette,
  Wand2,
  Shirt,
  Glasses,
  Watch,
  Headphones,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DreamCloset = () => {
  const { user, updateCuddleCoins, boostAllPets, coinUpdateTrigger } = useAuth(); // NEW: Use boostAllPets
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchasedItem, setPurchasedItem] = useState(null);

  const categories = [
    { id: 'all', name: 'All Items', count: 156 },
    { id: 'crowns', name: 'Crowns & Tiaras', count: 24 },
    { id: 'accessories', name: 'Accessories', count: 45 },
    { id: 'outfits', name: 'Magical Outfits', count: 38 },
    { id: 'wings', name: 'Wings & Auras', count: 29 },
    { id: 'special', name: 'Special Effects', count: 20 }
  ];

  const rarities = [
    { id: 'all', name: 'All Rarities', color: 'from-gray-400 to-gray-500' },
    { id: 'common', name: 'Common', color: 'from-gray-400 to-gray-500' },
    { id: 'rare', name: 'Rare', color: 'from-blue-400 to-blue-600' },
    { id: 'epic', name: 'Epic', color: 'from-purple-400 to-purple-600' },
    { id: 'legendary', name: 'Legendary', color: 'from-orange-400 to-orange-600' },
    { id: 'mythical', name: 'Mythical', color: 'from-pink-400 to-pink-600' },
    { id: 'divine', name: 'Divine', color: 'from-yellow-400 to-yellow-600' }
  ];

  const dreamItems = [
    // Crowns & Tiaras
    {
      id: 1,
      name: 'Celestial Crown of Eternity',
      category: 'crowns',
      rarity: 'divine',
      price: 5000,
      originalPrice: 7500,
      emoji: '👑',
      description: 'A crown forged from stardust and moonbeams, granting eternal wisdom',
      effects: ['Wisdom +50', 'Charisma +30', 'Magical Aura'],
      image: 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=400',
      trending: true,
      limited: true,
      owned: false
    },
    {
      id: 2,
      name: 'Rainbow Butterfly Wings',
      category: 'wings',
      rarity: 'mythical',
      price: 5000,
      emoji: '🦋',
      description: 'Iridescent wings that shimmer with all colors of the rainbow',
      effects: ['Flight Ability', 'Grace +40', 'Beauty +35'],
      image: 'https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=400',
      trending: true,
      owned: false
    },
    {
      id: 3,
      name: 'Moonbeam Collar of Dreams',
      category: 'accessories',
      rarity: 'legendary',
      price: 5000,
      emoji: '🌙',
      description: 'A collar that glows with the soft light of moonbeams',
      effects: ['Dream Vision', 'Serenity +25', 'Night Sight'],
      image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
      owned: false
    },
    {
      id: 4,
      name: 'Phoenix Feather Cloak',
      category: 'outfits',
      rarity: 'mythical',
      price: 5000,
      emoji: '🔥',
      description: 'A magnificent cloak woven from phoenix feathers',
      effects: ['Rebirth Power', 'Fire Immunity', 'Courage +45'],
      image: 'https://images.pexels.com/photos/1591939/pexels-photo-1591939.jpeg?auto=compress&cs=tinysrgb&w=400',
      limited: true,
      owned: false
    },
    {
      id: 5,
      name: 'Crystal Heart Pendant',
      category: 'accessories',
      rarity: 'epic',
      price: 5000,
      emoji: '💎',
      description: 'A pendant that amplifies the power of love and friendship',
      effects: ['Love Amplifier', 'Empathy +30', 'Healing Aura'],
      image: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400',
      owned: false
    },
    {
      id: 6,
      name: 'Starlight Tiara',
      category: 'crowns',
      rarity: 'legendary',
      price: 5000,
      emoji: '⭐',
      description: 'A tiara that captures the light of distant stars',
      effects: ['Stellar Power', 'Intelligence +35', 'Cosmic Sight'],
      image: 'https://images.pexels.com/photos/1996333/pexels-photo-1996333.jpeg?auto=compress&cs=tinysrgb&w=400',
      owned: false
    },
    {
      id: 7,
      name: 'Dragon Scale Armor',
      category: 'outfits',
      rarity: 'legendary',
      price: 5000,
      emoji: '🐉',
      description: 'Armor crafted from ancient dragon scales',
      effects: ['Dragon Strength', 'Fire Resistance', 'Intimidation +40'],
      image: 'https://images.pexels.com/photos/2835436/pexels-photo-2835436.jpeg?auto=compress&cs=tinysrgb&w=400',
      owned: false
    },
    {
      id: 8,
      name: 'Fairy Dust Aura',
      category: 'special',
      rarity: 'epic',
      price: 5000,
      emoji: '✨',
      description: 'A magical aura that surrounds your pet with sparkling fairy dust',
      effects: ['Magical Presence', 'Luck +25', 'Charm +30'],
      image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
      trending: true,
      owned: false
    },
    {
      id: 9,
      name: 'Golden Paw Boots',
      category: 'accessories',
      rarity: 'rare',
      price: 5000,
      emoji: '👢',
      description: 'Elegant golden boots that never get dirty',
      effects: ['Speed +20', 'Elegance +15', 'Clean Paws'],
      image: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=400',
      owned: false
    },
    {
      id: 10,
      name: 'Unicorn Horn of Purity',
      category: 'special',
      rarity: 'divine',
      price: 5000,
      emoji: '🦄',
      description: 'A sacred horn that purifies all negative energy',
      effects: ['Purification', 'Healing Power', 'Divine Protection'],
      image: 'https://images.pexels.com/photos/1996333/pexels-photo-1996333.jpeg?auto=compress&cs=tinysrgb&w=400',
      limited: true,
      owned: false
    }
  ];

  const getRarityColor = (rarity) => {
    const rarityObj = rarities.find(r => r.id === rarity);
    return rarityObj ? rarityObj.color : 'from-gray-400 to-gray-500';
  };

  const getRarityBorder = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-400';
      case 'rare': return 'border-blue-400';
      case 'epic': return 'border-purple-400';
      case 'legendary': return 'border-orange-400';
      case 'mythical': return 'border-pink-400';
      case 'divine': return 'border-yellow-400';
      default: return 'border-gray-400';
    }
  };

  const filteredItems = dreamItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesRarity = selectedRarity === 'all' || item.rarity === selectedRarity;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesRarity && matchesSearch;
  });

  // 🌟 ULTIMATE PURCHASE FUNCTION - NOW USES boostAllPets! 🌟
  const handlePurchase = (item) => {
    console.log('🛒 ULTIMATE PURCHASE INITIATED:', {
      item: item.name,
      price: item.price,
      userCoins: user?.cuddleCoins,
      totalPets: user?.pets?.length || 0,
      canAfford: user && user.cuddleCoins >= item.price,
      timestamp: new Date().toISOString()
    });

    if (!user) {
      console.error('❌ NO USER FOUND');
      alert('Error: No user found!');
      return;
    }

    if (user.cuddleCoins < item.price) {
      console.log('❌ INSUFFICIENT COINS');
      alert(`Insufficient Cuddle Coins! You need ${item.price.toLocaleString()} but only have ${user.cuddleCoins.toLocaleString()}.`);
      return;
    }

    console.log('💰 PROCESSING PURCHASE...');
    
    // Step 1: Deduct coins
    console.log('Step 1: Deducting coins');
    updateCuddleCoins(-item.price);
    
    // Step 2: 🌟 BOOST ALL PETS TO MAXIMUM STATS USING NEW FUNCTION! 🌟
    if (user.pets && user.pets.length > 0) {
      console.log(`🚀 BOOSTING ALL ${user.pets.length} SOUL COMPANIONS TO MAXIMUM POWER!`);
      boostAllPets(); // NEW: Use the dedicated function to boost all pets at once
    } else {
      console.log('ℹ️ No pets to boost (user has no pets yet)');
    }
    
    // Step 3: Show success modal
    console.log('Step 3: Showing success modal');
    setPurchasedItem(item);
    setShowPurchaseModal(true);
    
    console.log('✅ ULTIMATE PURCHASE COMPLETE - ALL SOULS BLESSED!');
  };

  // Get current coins with trigger dependency
  const currentCoins = user?.cuddleCoins || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50/80 via-orange-50/60 to-pink-50/80 relative overflow-hidden">
      {/* Enhanced Purchase Success Modal */}
      {showPurchaseModal && purchasedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="backdrop-blur-2xl bg-white/95 border border-white/40 rounded-3xl shadow-2xl p-8 max-w-lg w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10"></div>
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
                <Gift className="h-12 w-12 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-gray-800 mb-4">🎉 Purchase Successful!</h3>
              <p className="text-gray-600 text-lg mb-6">
                You've acquired the magical {purchasedItem.name}!
              </p>

              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl border border-white/40 mb-6">
                <div className="text-6xl mb-4">{purchasedItem.emoji}</div>
                <h4 className="font-bold text-gray-800 text-xl mb-2">{purchasedItem.name}</h4>
                <p className="text-gray-600 text-sm mb-4">{purchasedItem.description}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {purchasedItem.effects.map((effect, index) => (
                    <span key={index} className="px-3 py-1 bg-white/60 text-purple-700 rounded-full text-xs font-medium">
                      ✨ {effect}
                    </span>
                  ))}
                </div>
              </div>

              {/* 🌟 ENHANCED BONUS MESSAGE FOR ALL PETS 🌟 */}
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-2xl border border-green-300 mb-6">
                <div className="flex items-center justify-center mb-3">
                  <Sparkles className="h-8 w-8 text-green-600 mr-3 animate-spin" />
                  <span className="text-xl font-bold text-gray-800">🌟 ALL SOUL COMPANIONS BLESSED! 🌟</span>
                  <Heart className="h-8 w-8 text-pink-500 ml-3 animate-pulse" />
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white/60 p-4 rounded-xl">
                    <div className="text-lg font-bold text-gray-800 mb-2">
                      ✨ {user?.pets?.length || 0} Soul Companion{(user?.pets?.length || 0) !== 1 ? 's' : ''} Enhanced!
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 text-pink-500 mr-2" />
                        <span>Affection: <strong>100%</strong></span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-500 mr-2">🍽️</span>
                        <span>Nourishment: <strong>100%</strong></span>
                      </div>
                      <div className="flex items-center">
                        <Sparkles className="h-4 w-4 text-yellow-500 mr-2" />
                        <span>Happiness: <strong>100%</strong></span>
                      </div>
                      <div className="flex items-center">
                        <Zap className="h-4 w-4 text-blue-500 mr-2" />
                        <span>Energy: <strong>100%</strong></span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded-xl">
                    <div className="text-sm font-bold text-purple-800 mb-1">🎁 Bonus Rewards:</div>
                    <div className="text-xs text-purple-700 space-y-1">
                      <div>• All pets now have "Transcendent" mood</div>
                      <div>• +10 Emotional Bond for each companion</div>
                      <div>• +50 Cuddle Coins earned per pet</div>
                      <div>• Special "Blessed" status activated</div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowPurchaseModal(false)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-2xl font-bold hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105"
              >
                Visit Your Blessed Companions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-32 h-32 bg-gradient-to-r from-pink-200/30 to-rose-200/30 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-40 left-1/3 w-48 h-48 bg-gradient-to-r from-purple-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="flex items-center mb-8">
            <Link
              to="/dashboard"
              className="mr-6 p-4 rounded-3xl backdrop-blur-2xl bg-white/30 border border-white/30 hover:bg-white/50 transition-all duration-500 hover:scale-110 shadow-xl"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </Link>
            <div className="backdrop-blur-2xl bg-white/25 border border-white/30 p-8 rounded-3xl shadow-2xl flex-1">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-pink-600 bg-clip-text text-transparent mb-4 flex items-center">
                <ShoppingBag className="h-12 w-12 mr-4 text-yellow-600 animate-bounce" />
                Dream Closet
                <Sparkles className="h-10 w-10 ml-4 text-pink-500 animate-pulse" />
              </h1>
              <p className="text-xl text-gray-700">Transform your pets with magical items and divine accessories! ✨👑</p>
              
              {/* 🌟 ENHANCED BONUS NOTICE 🌟 */}
              <div className="mt-4 bg-gradient-to-r from-green-100/80 to-emerald-100/80 backdrop-blur-sm p-6 rounded-2xl border border-green-300/40 shadow-lg">
                <div className="flex items-center justify-center mb-3">
                  <Sparkles className="h-8 w-8 mr-3 text-green-600 animate-spin" />
                  <span className="text-2xl font-bold text-gray-800">🌟 MAGICAL BLESSING SYSTEM 🌟</span>
                  <Heart className="h-8 w-8 ml-3 text-pink-500 animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                  <div className="bg-white/60 p-4 rounded-xl">
                    <div className="text-lg font-bold text-gray-800 mb-2">💰 All Items: 5,000 Coins</div>
                    <div className="text-sm text-gray-600">Uniform pricing for all magical items</div>
                  </div>
                  <div className="bg-white/60 p-4 rounded-xl">
                    <div className="text-lg font-bold text-gray-800 mb-2">✨ Bless ALL Companions</div>
                    <div className="text-sm text-gray-600">Every purchase boosts all pets to 100%</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-sm font-bold text-green-700 mb-2">🎁 What happens when you purchase:</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-700">
                    <div>💖 100% Affection</div>
                    <div>🍽️ 100% Nourishment</div>
                    <div>😊 100% Happiness</div>
                    <div>⚡ 100% Energy</div>
                  </div>
                  <div className="mt-2 text-xs text-purple-700 font-medium">
                    Plus: Transcendent mood, +10 emotional bond, +50 coins per pet, and blessed status!
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Coins Display with trigger dependency */}
            <div 
              key={`dream-closet-coins-${currentCoins}-${user?.coinUpdateId || 0}-${coinUpdateTrigger}`}
              className="ml-6 backdrop-blur-2xl bg-gradient-to-r from-yellow-400/30 to-orange-400/30 border border-white/40 p-6 rounded-3xl shadow-2xl"
            >
              <div className="flex items-center text-2xl font-bold text-gray-800">
                <Coins className="h-8 w-8 mr-3 text-yellow-600 animate-pulse" />
                {currentCoins.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mt-1">Cuddle Coins</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="backdrop-blur-2xl bg-white/30 border border-white/30 rounded-3xl shadow-2xl p-8 mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                <input
                  type="text"
                  placeholder="Search magical items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl focus:ring-2 focus:ring-yellow-500/25 focus:border-yellow-400 transition-all duration-300 shadow-lg text-lg"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-3 overflow-x-auto">
                {categories.map((category) => {
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center px-6 py-4 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/40 shadow-lg hover:scale-105 whitespace-nowrap ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                          : 'bg-white/80 text-gray-700 hover:bg-white/90'
                      }`}
                    >
                      {category.name}
                      <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rarity Filter */}
            <div className="flex gap-3 mt-6 overflow-x-auto">
              {rarities.map((rarity) => (
                <button
                  key={rarity.id}
                  onClick={() => setSelectedRarity(rarity.id)}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/40 shadow-lg hover:scale-105 whitespace-nowrap ${
                    selectedRarity === rarity.id
                      ? `bg-gradient-to-r ${rarity.color} text-white`
                      : 'bg-white/80 text-gray-700 hover:bg-white/90'
                  }`}
                >
                  {rarity.name}
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`group backdrop-blur-2xl bg-white/90 border-4 ${getRarityBorder(item.rarity)} rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden hover:scale-105 relative`}
              >
                {/* Special Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  {item.trending && (
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center shadow-lg">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </div>
                  )}
                  {item.limited && (
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center shadow-lg">
                      <Award className="h-3 w-3 mr-1" />
                      Limited
                    </div>
                  )}
                  {item.owned && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center shadow-lg">
                      <Unlock className="h-3 w-3 mr-1" />
                      Owned
                    </div>
                  )}
                </div>

                {/* Rarity Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className={`px-3 py-1 bg-gradient-to-r ${getRarityColor(item.rarity)} text-white rounded-xl text-xs font-bold shadow-lg capitalize`}>
                    {item.rarity}
                  </div>
                </div>

                {/* Item Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${getRarityColor(item.rarity)} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
                  
                  {/* Item Emoji */}
                  <div className="absolute bottom-4 left-4">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl shadow-xl">
                      {item.emoji}
                    </div>
                  </div>
                </div>

                {/* Item Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-yellow-600 transition-colors duration-300">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Effects */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {item.effects.slice(0, 2).map((effect, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-medium border border-white/40"
                      >
                        ✨ {effect}
                      </span>
                    ))}
                    {item.effects.length > 2 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        +{item.effects.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-center mb-4">
                    <div>
                      <div className="flex items-center justify-center text-2xl font-bold text-yellow-600">
                        <Coins className="h-6 w-6 mr-2" />
                        {item.price.toLocaleString()}
                      </div>
                      {item.originalPrice && (
                        <div className="text-sm text-gray-500 line-through text-center">
                          {item.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 🌟 ENHANCED BLESSING NOTICE 🌟 */}
                  <div className="bg-gradient-to-r from-green-100/80 to-emerald-100/80 p-3 rounded-xl mb-4 border border-green-300/40">
                    <div className="text-center">
                      <div className="text-xs font-bold text-green-700 mb-1">✨ BLESSING BONUS ✨</div>
                      <div className="text-xs text-gray-700">
                        Boosts ALL {user?.pets?.length || 0} companion{(user?.pets?.length || 0) !== 1 ? 's' : ''} to 100%!
                      </div>
                    </div>
                  </div>

                  {/* Purchase Button */}
                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={item.owned || currentCoins < item.price}
                    className={`w-full py-4 px-6 rounded-2xl font-bold transition-all duration-500 hover:scale-105 flex items-center justify-center ${
                      item.owned
                        ? 'bg-green-500 text-white cursor-not-allowed'
                        : currentCoins >= item.price
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-xl hover:shadow-yellow-500/25'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {item.owned ? (
                      <>
                        <Unlock className="h-5 w-5 mr-2" />
                        Owned
                      </>
                    ) : currentCoins >= item.price ? (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Bless All Souls
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5 mr-2" />
                        Insufficient Coins
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamCloset;