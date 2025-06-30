import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Heart, 
  Star, 
  Crown, 
  Sparkles,
  TrendingUp,
  Users,
  MessageCircle,
  ShoppingBag,
  Gift,
  Zap,
  Coins,
  Play,
  X,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ExternalLink,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, canFeedPet, canPetPet, getFeedCooldownTime, getPetCooldownTime, currentCoins, coinUpdateTrigger } = useAuth();
  const [showDemoVideo, setShowDemoVideo] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);

  // Mock data for trending pets and marketplace items
  const trendingPets = [
    {
      id: 1,
      name: 'Luna the Mystic',
      type: 'Unicorn',
      owner: 'StarKeeper',
      price: '25.5 ALGO',
      image: 'https://images.pexels.com/photos/1996333/pexels-photo-1996333.jpeg?auto=compress&cs=tinysrgb&w=300',
      trending: true
    },
    {
      id: 2,
      name: 'Blaze the Wise',
      type: 'Dragon',
      owner: 'FireMaster',
      price: '45.2 ALGO',
      image: 'https://images.pexels.com/photos/2835436/pexels-photo-2835436.jpeg?auto=compress&cs=tinysrgb&w=300',
      trending: true
    },
    {
      id: 3,
      name: 'Whiskers the Cute',
      type: 'Cat',
      owner: 'CatLover',
      price: '12.8 ALGO',
      image: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=300',
      trending: false
    }
  ];

  const dreamClosetItems = [
    {
      id: 1,
      name: 'Celestial Crown of Eternity',
      price: 5000,
      image: 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=300',
      rarity: 'Divine'
    },
    {
      id: 2,
      name: 'Rainbow Butterfly Wings',
      price: 5000,
      image: 'https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=300',
      rarity: 'Mythical'
    },
    {
      id: 3,
      name: 'Moonbeam Collar of Dreams',
      price: 5000,
      image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300',
      rarity: 'Legendary'
    }
  ];

  const handleDemoVideoOpen = () => {
    setShowDemoVideo(true);
  };

  const handleDemoVideoClose = () => {
    setShowDemoVideo(false);
    setIsVideoFullscreen(false);
    setIsVideoMuted(true);
  };

  const toggleVideoMute = () => {
    setIsVideoMuted(!isVideoMuted);
  };

  const toggleVideoFullscreen = () => {
    setIsVideoFullscreen(!isVideoFullscreen);
  };

  const handleExternalDemo = () => {
    window.open('https://jade-rolypoly-12ce25.netlify.app', '_blank');
    handleDemoVideoClose();
  };

  // Close video with Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showDemoVideo) {
        handleDemoVideoClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showDemoVideo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative">
      {/* Enhanced Demo Video Modal */}
      {showDemoVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`relative bg-black rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ${
            isVideoFullscreen 
              ? 'w-full h-full' 
              : 'w-full max-w-6xl h-auto max-h-[90vh]'
          }`}>
            {/* Enhanced Video Header with Controls */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-white font-bold text-lg">Live AI Demo</span>
                  </div>
                  <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                    Interactive Experience
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {/* Enhanced Close Button */}
                  <button
                    onClick={handleDemoVideoClose}
                    className="p-3 bg-red-500/80 backdrop-blur-sm text-white rounded-2xl hover:bg-red-600 transition-all duration-300 hover:scale-110 hover:rotate-90"
                    title="Close Demo"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Video Content Area */}
            <div className={`relative ${isVideoFullscreen ? 'h-full' : 'aspect-video'} bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900`}>
              {/* Demo Video Background */}
              <div className="absolute inset-0">
                <img
                  src="https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="AI Pet Demo"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
              </div>

              {/* Enhanced Demo Content */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="text-center text-white max-w-4xl">
                  <div className="mb-8">
                    <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 mx-auto shadow-2xl animate-pulse">
                      <Play className="h-16 w-16 text-white ml-2" />
                    </div>
                    <h3 className="text-5xl font-bold mb-6 drop-shadow-lg">Experience the Magic</h3>
                    <p className="text-2xl font-medium drop-shadow-md mb-8 leading-relaxed">
                      Watch AI pets come to life with realistic video responses, emotional intelligence, and genuine personality
                    </p>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleExternalDemo}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 flex items-center justify-center"
                    >
                      <ExternalLink className="h-6 w-6 mr-3" />
                      Try Interactive Demo
                    </button>
                    <button
                      onClick={handleDemoVideoClose}
                      className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all duration-300 hover:scale-105 border border-white/30"
                    >
                      Close Demo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Video Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-white">
                    <div className="text-sm opacity-80">Powered by Advanced AI</div>
                    <div className="font-bold">Soul Pet AI Technology</div>
                  </div>
                </div>
                <div className="text-white text-right">
                  <div className="text-sm opacity-80">Press ESC to close</div>
                  <div className="font-bold">Interactive Demo Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Welcome Header */}
          <div className="text-center mb-12">
            <div className="backdrop-blur-2xl bg-white/30 border border-white/30 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
                  Welcome back, {user?.name}! 🎉
                </h1>
                <p className="text-xl text-gray-700 mb-6">Your magical companions are waiting for you ✨</p>
                
                {/* Enhanced Demo Video Button */}
                <button 
                  onClick={handleDemoVideoOpen}
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 flex items-center mx-auto"
                >
                  <Play className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  Watch AI Demo
                  <Sparkles className="h-5 w-5 ml-3 group-hover:rotate-12 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>

          {/* ULTIMATE: Quick Stats with direct currentCoins */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="backdrop-blur-2xl bg-white/30 border border-white/30 p-6 rounded-3xl shadow-2xl text-center hover:scale-105 transition-transform duration-300">
              <Heart className="h-8 w-8 mx-auto mb-3 text-pink-500 animate-pulse" />
              <div className="text-3xl font-bold text-gray-800">{user?.totalPets || 0}</div>
              <div className="text-sm text-gray-600">Soul Companions</div>
            </div>
            <div 
              key={`dashboard-coins-${currentCoins}-${coinUpdateTrigger}-${Date.now()}`}
              className="backdrop-blur-2xl bg-white/30 border border-white/30 p-6 rounded-3xl shadow-2xl text-center hover:scale-105 transition-transform duration-300"
            >
              <Coins className="h-8 w-8 mx-auto mb-3 text-yellow-500 animate-bounce" />
              <div className="text-3xl font-bold text-gray-800">{currentCoins.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Cuddle Coins</div>
            </div>
            <div className="backdrop-blur-2xl bg-white/30 border border-white/30 p-6 rounded-3xl shadow-2xl text-center hover:scale-105 transition-transform duration-300">
              <Star className="h-8 w-8 mx-auto mb-3 text-purple-500 animate-pulse" />
              <div className="text-3xl font-bold text-gray-800">{user?.level || 1}</div>
              <div className="text-sm text-gray-600">Soul Level</div>
            </div>
            <div className="backdrop-blur-2xl bg-white/30 border border-white/30 p-6 rounded-3xl shadow-2xl text-center hover:scale-105 transition-transform duration-300">
              <TrendingUp className="h-8 w-8 mx-auto mb-3 text-green-500 animate-bounce" />
              <div className="text-3xl font-bold text-gray-800">
                {Math.floor((Date.now() - new Date(user?.joinDate || Date.now()).getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-sm text-gray-600">Days Active</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Your Pets Section */}
            <div className="lg:col-span-2">
              <div className="backdrop-blur-2xl bg-white/30 border border-white/30 rounded-3xl shadow-2xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                    <Heart className="h-8 w-8 mr-3 text-pink-500 animate-pulse" />
                    Your Soul Companions
                  </h2>
                  <Link
                    to="/create"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Pet
                  </Link>
                </div>

                {user?.pets && user.pets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.pets.map((pet) => {
                      const canFeed = canFeedPet(pet.id);
                      const canPet = canPetPet(pet.id);
                      const feedCooldown = getFeedCooldownTime(pet.id);
                      const petCooldown = getPetCooldownTime(pet.id);

                      return (
                        <div key={pet.id} className="group backdrop-blur-sm bg-white/60 border border-white/40 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:scale-105">
                          <div className="relative">
                            <img
                              src={pet.image}
                              alt={pet.name}
                              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-br ${pet.moodAura} opacity-40`}></div>
                            
                            <div className="absolute top-4 left-4">
                              <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-xl text-sm font-semibold flex items-center">
                                <Star className="h-4 w-4 mr-1" />
                                Level {pet.level}
                              </div>
                            </div>
                            
                            <div className="absolute top-4 right-4">
                              <div className={`px-3 py-2 rounded-xl text-sm font-semibold ${
                                pet.status === 'online' 
                                  ? 'bg-green-500/80 text-white' 
                                  : 'bg-gray-500/80 text-white'
                              }`}>
                                {pet.status}
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
                                <p className="text-gray-600">{pet.type} • {pet.personality}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-purple-600 font-semibold">{pet.outfit}</div>
                                <div className="text-xs text-gray-500">Current Outfit</div>
                              </div>
                            </div>
                            
                            {/* Enhanced Stats with Cooldown Indicators */}
                            <div className="space-y-3 mb-6">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-600 flex items-center">
                                    <Heart className="h-4 w-4 mr-1 text-pink-500" />
                                    Affection
                                  </span>
                                  <span className="font-semibold">{pet.affection}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-pink-400 to-red-400 h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${pet.affection}%` }}
                                  ></div>
                                </div>
                                {!canPet && petCooldown && (
                                  <div className="flex items-center mt-1 text-xs text-gray-500">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pet cooldown: {petCooldown}
                                  </div>
                                )}
                              </div>
                              
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-600">🍽️ Nourishment</span>
                                  <span className="font-semibold">{pet.hunger}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${pet.hunger}%` }}
                                  ></div>
                                </div>
                                {!canFeed && feedCooldown && (
                                  <div className="flex items-center mt-1 text-xs text-gray-500">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Feed cooldown: {feedCooldown}
                                  </div>
                                )}
                              </div>
                              
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-600 flex items-center">
                                    <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
                                    Happiness
                                  </span>
                                  <span className="font-semibold">{pet.happiness}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${pet.happiness}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>

                            {/* Cooldown Warning */}
                            {(!canFeed || !canPet) && (
                              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                                <div className="flex items-center text-blue-700">
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  <span className="text-sm font-medium">
                                    {!canFeed && !canPet ? 'Both actions on cooldown' : 
                                     !canFeed ? 'Feeding on cooldown' : 'Petting on cooldown'}
                                  </span>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex justify-center">
                              <Link
                                to={`/pet/${pet.id}`}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-2xl font-semibold hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                              >
                                Visit Soul
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                      <Heart className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">No Soul Companions Yet</h3>
                    <p className="text-gray-600 mb-8 text-lg">Create your first AI pet and begin your magical journey!</p>
                    <Link
                      to="/create"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 inline-flex items-center"
                    >
                      <Plus className="h-6 w-6 mr-3" />
                      Create Your First Pet
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Trending Pets */}
              <div className="backdrop-blur-2xl bg-white/30 border border-white/30 rounded-3xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-3 text-green-500" />
                  Trending Pets
                </h3>
                <div className="space-y-4">
                  {trendingPets.map((pet) => (
                    <div key={pet.id} className="flex items-center space-x-4 p-4 backdrop-blur-sm bg-white/60 rounded-2xl border border-white/40 hover:bg-white/80 transition-all duration-300 hover:scale-105 cursor-pointer">
                      <img
                        src={pet.image}
                        alt={pet.name}
                        className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="font-bold text-gray-800">{pet.name}</h4>
                          {pet.trending && (
                            <div className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">🔥</div>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">{pet.type} by {pet.owner}</p>
                        <p className="text-purple-600 font-semibold">{pet.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/marketplace"
                  className="block w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-2xl font-semibold text-center hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105"
                >
                  Explore Marketplace
                </Link>
              </div>

              {/* Dream Closet Preview */}
              <div className="backdrop-blur-2xl bg-white/30 border border-white/30 rounded-3xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <ShoppingBag className="h-6 w-6 mr-3 text-yellow-500" />
                  Dream Closet
                </h3>
                <div className="space-y-4">
                  {dreamClosetItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 backdrop-blur-sm bg-white/60 rounded-2xl border border-white/40 hover:bg-white/80 transition-all duration-300 hover:scale-105 cursor-pointer">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                        <p className="text-purple-600 text-xs">{item.rarity}</p>
                        <div className="flex items-center mt-1">
                          <Coins className="h-4 w-4 text-yellow-600 mr-1" />
                          <span className="text-yellow-600 font-bold">{item.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/dream-closet"
                  className="block w-full mt-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-4 rounded-2xl font-semibold text-center hover:shadow-xl hover:shadow-yellow-500/25 transition-all duration-300 hover:scale-105"
                >
                  Browse Dream Closet
                </Link>
              </div>

              {/* Quick Actions */}
              <div className="backdrop-blur-2xl bg-white/30 border border-white/30 rounded-3xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <Link
                    to="/daily-wags"
                    className="block w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-2xl font-semibold text-center hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                  >
                    Daily Wags
                  </Link>
                  <Link
                    to="/connect-all-hearts"
                    className="block w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-4 rounded-2xl font-semibold text-center hover:shadow-xl hover:shadow-pink-500/25 transition-all duration-300 hover:scale-105"
                  >
                    Connect Hearts
                  </Link>
                  <Link
                    to="/soul-premium"
                    className="block w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-4 rounded-2xl font-semibold text-center hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 flex items-center justify-center"
                  >
                    <Crown className="h-5 w-5 mr-2" />
                    Soul Premium
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;