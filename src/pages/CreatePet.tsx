import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  Sparkles, 
  Heart, 
  Zap,
  Volume2,
  Palette,
  Brain,
  Camera,
  Coins,
  Gift,
  Star,
  AlertCircle,
  Lock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CreatePet = () => {
  const navigate = useNavigate();
  const { createPet, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showInsufficientCoinsModal, setShowInsufficientCoinsModal] = useState(false);
  const [petData, setPetData] = useState({
    name: '',
    type: '',
    personality: '',
    voice: '',
    appearance: '',
    backstory: ''
  });

  const steps = [
    { number: 1, title: 'Basic Info', icon: Heart },
    { number: 2, title: 'Appearance', icon: Camera },
    { number: 3, title: 'Personality', icon: Brain },
    { number: 4, title: 'Voice', icon: Volume2 },
    { number: 5, title: 'Finalize', icon: Sparkles }
  ];

  const petTypes = [
    { id: 'dog', name: 'Dog', emoji: '🐕', description: 'Loyal and playful companion' },
    { id: 'cat', name: 'Cat', emoji: '🐱', description: 'Independent and mysterious' },
    { id: 'dragon', name: 'Dragon', emoji: '🐉', description: 'Magical and powerful' },
    { id: 'unicorn', name: 'Unicorn', emoji: '🦄', description: 'Graceful and enchanting' },
    { id: 'phoenix', name: 'Phoenix', emoji: '🔥', description: 'Majestic and reborn' },
    { id: 'custom', name: 'Custom', emoji: '✨', description: 'Create something unique' }
  ];

  const personalities = [
    { id: 'playful', name: 'Playful', description: 'Energetic and fun-loving', color: 'from-yellow-400 to-orange-500' },
    { id: 'wise', name: 'Wise', description: 'Thoughtful and intelligent', color: 'from-blue-500 to-indigo-600' },
    { id: 'mischievous', name: 'Mischievous', description: 'Cheeky and unpredictable', color: 'from-purple-500 to-pink-500' },
    { id: 'gentle', name: 'Gentle', description: 'Calm and nurturing', color: 'from-green-400 to-emerald-500' },
    { id: 'brave', name: 'Brave', description: 'Bold and adventurous', color: 'from-red-500 to-pink-500' },
    { id: 'quirky', name: 'Quirky', description: 'Unique and eccentric', color: 'from-indigo-500 to-purple-600' }
  ];

  const voices = [
    { id: 'cute', name: 'Cute & Sweet', sample: 'High-pitched and adorable' },
    { id: 'deep', name: 'Deep & Wise', sample: 'Rich and authoritative' },
    { id: 'playful', name: 'Playful & Energetic', sample: 'Bouncy and enthusiastic' },
    { id: 'mysterious', name: 'Mysterious', sample: 'Soft and enigmatic' },
    { id: 'grumpy', name: 'Grumpy & Sarcastic', sample: 'Dry and witty' },
    { id: 'royal', name: 'Royal & Elegant', sample: 'Refined and sophisticated' }
  ];

  const CREATION_COST = 10000;
  const hasEnoughCoins = user && user.cuddleCoins >= CREATION_COST;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Check if user has enough coins before creating pet
      if (!hasEnoughCoins) {
        setShowInsufficientCoinsModal(true);
        return;
      }
      
      // Create pet (this will deduct 10,000 coins and add 15 bonus coins)
      createPet(petData);
      setShowRewardModal(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRewardModalClose = () => {
    setShowRewardModal(false);
    navigate('/dashboard');
  };

  const handleInsufficientCoinsModalClose = () => {
    setShowInsufficientCoinsModal(false);
    navigate('/dashboard');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                What's your pet's name?
              </label>
              <input
                type="text"
                value={petData.name}
                onChange={(e) => setPetData({ ...petData, name: e.target.value })}
                placeholder="Enter a magical name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Choose your pet type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {petTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setPetData({ ...petData, type: type.id })}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 text-center ${
                      petData.type === type.id
                        ? 'border-purple-500 bg-purple-50 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                    }`}
                  >
                    <div className="text-4xl mb-2">{type.emoji}</div>
                    <div className="font-semibold text-gray-900">{type.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Creation Cost Notice with Insufficient Coins Warning */}
            <div className={`rounded-xl p-6 max-w-md mx-auto border-2 ${
              hasEnoughCoins 
                ? 'bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-300' 
                : 'bg-gradient-to-r from-red-100 to-pink-100 border-red-300'
            }`}>
              <div className="flex items-center justify-center mb-3">
                {hasEnoughCoins ? (
                  <Coins className="h-8 w-8 text-blue-600 mr-3" />
                ) : (
                  <Lock className="h-8 w-8 text-red-600 mr-3" />
                )}
                <span className="text-xl font-bold text-gray-800">Creation Cost</span>
              </div>
              <div className="flex items-center justify-center">
                <span className={`text-2xl font-bold ${hasEnoughCoins ? 'text-blue-600' : 'text-red-600'}`}>
                  10,000 Cuddle Coins
                </span>
              </div>
              
              {hasEnoughCoins ? (
                <>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    💰 Cost will be deducted when your pet is created
                  </p>
                  <p className="text-xs text-green-600 mt-1 text-center font-medium">
                    ✨ Plus you'll earn 15 bonus coins for creating!
                  </p>
                  <div className="mt-3 text-center">
                    <div className="text-sm text-gray-600">Your Balance: <span className="font-bold text-green-600">{user?.cuddleCoins?.toLocaleString()}</span></div>
                    <div className="text-xs text-gray-500">After Creation: <span className="font-bold">{((user?.cuddleCoins || 0) - 10000 + 15).toLocaleString()}</span></div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-red-50 rounded-lg p-4 mt-4 border border-red-200">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                      <span className="font-bold text-red-800">Insufficient Coins!</span>
                    </div>
                    <p className="text-sm text-red-700 mb-3">
                      You need <span className="font-bold">{CREATION_COST.toLocaleString()}</span> Cuddle Coins to create a pet.
                    </p>
                    <div className="text-sm text-gray-700">
                      <div>Your Balance: <span className="font-bold text-red-600">{user?.cuddleCoins?.toLocaleString() || 0}</span></div>
                      <div>Need: <span className="font-bold text-red-600">{(CREATION_COST - (user?.cuddleCoins || 0)).toLocaleString()}</span> more coins</div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-600 mb-2">💡 <strong>How to earn more coins:</strong></p>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>• Feed & pet existing pets: +5-25 coins</div>
                      <div>• Chat with pets: +5-15 coins</div>
                      <div>• Daily activities: +10-50 coins</div>
                      <div>• Premium membership: 5-20x faster earning</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Upload className="h-12 w-12 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Pet Photos</h3>
              <p className="text-gray-600 mb-6">
                Upload photos of your pet or describe how you want them to look
              </p>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                Choose Photos
              </button>
            </div>

            <div className="border-t pt-6">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Or describe their appearance
              </label>
              <textarea
                value={petData.appearance}
                onChange={(e) => setPetData({ ...petData, appearance: e.target.value })}
                placeholder="Describe colors, patterns, size, and unique features..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Choose your pet's personality
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalities.map((personality) => (
                  <button
                    key={personality.id}
                    onClick={() => setPetData({ ...petData, personality: personality.id })}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                      petData.personality === personality.id
                        ? 'border-purple-500 bg-purple-50 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${personality.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div className="font-semibold text-gray-900 text-lg">{personality.name}</div>
                    <div className="text-gray-600 mt-1">{personality.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Tell us more about their personality
              </label>
              <textarea
                value={petData.backstory}
                onChange={(e) => setPetData({ ...petData, backstory: e.target.value })}
                placeholder="Any special quirks, habits, or backstory..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Choose your pet's voice
              </label>
              <div className="space-y-4">
                {voices.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => setPetData({ ...petData, voice: voice.id })}
                    className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                      petData.voice === voice.id
                        ? 'border-purple-500 bg-purple-50 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900 text-lg">{voice.name}</div>
                        <div className="text-gray-600 mt-1">{voice.sample}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Volume2 className="h-5 w-5 text-purple-500" />
                        <span className="text-sm text-purple-600 font-medium">Preview</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center mb-6">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900">Almost Ready!</h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              Your AI pet is being created with all the magical features you've chosen.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 text-left max-w-md mx-auto">
              <h4 className="font-semibold text-gray-900 mb-4">Pet Summary:</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Name:</strong> {petData.name || 'Not specified'}</div>
                <div><strong>Type:</strong> {petTypes.find(t => t.id === petData.type)?.name || 'Not selected'}</div>
                <div><strong>Personality:</strong> {personalities.find(p => p.id === petData.personality)?.name || 'Not selected'}</div>
                <div><strong>Voice:</strong> {voices.find(v => v.id === petData.voice)?.name || 'Not selected'}</div>
              </div>
            </div>

            {/* Final Cost Reminder with Enhanced Warning */}
            <div className={`rounded-xl p-6 max-w-md mx-auto border-2 ${
              hasEnoughCoins 
                ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300' 
                : 'bg-gradient-to-r from-red-100 to-pink-100 border-red-300'
            }`}>
              <div className="flex items-center justify-center mb-3">
                {hasEnoughCoins ? (
                  <Coins className="h-8 w-8 text-green-600 mr-3" />
                ) : (
                  <Lock className="h-8 w-8 text-red-600 mr-3" />
                )}
                <span className="text-xl font-bold text-gray-800">Final Cost</span>
              </div>
              <div className="flex items-center justify-center">
                <span className={`text-2xl font-bold ${hasEnoughCoins ? 'text-green-600' : 'text-red-600'}`}>
                  10,000 Cuddle Coins
                </span>
              </div>
              
              {hasEnoughCoins ? (
                <>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    💰 Will be deducted when you create your pet
                  </p>
                  <p className="text-xs text-green-600 mt-1 text-center font-medium">
                    ✨ Plus 15 bonus coins for creating!
                  </p>
                </>
              ) : (
                <div className="bg-red-50 rounded-lg p-4 mt-4 border border-red-200">
                  <div className="flex items-center justify-center mb-2">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <span className="font-bold text-red-800">Cannot Create Pet</span>
                  </div>
                  <p className="text-sm text-red-700 text-center">
                    You need {(CREATION_COST - (user?.cuddleCoins || 0)).toLocaleString()} more Cuddle Coins
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Reward Modal */}
      {showRewardModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="backdrop-blur-2xl bg-white/95 border border-white/40 rounded-3xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-pink-500/10"></div>
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
                <Gift className="h-12 w-12 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-gray-800 mb-4">🎉 Pet Created Successfully!</h3>
              <p className="text-gray-600 text-lg mb-6">
                Your magical companion has been brought to life!
              </p>

              <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-2xl border border-green-300 mb-6">
                <div className="flex items-center justify-center mb-3">
                  <Coins className="h-8 w-8 text-green-600 mr-3 animate-spin" />
                  <span className="text-2xl font-bold text-gray-800">+15 Bonus Coins Earned!</span>
                </div>
                <p className="text-gray-600">Congratulations on creating your new soul companion!</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4 text-gray-700">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <span className="font-semibold">Pet Name: {petData.name}</span>
                </div>
                <div className="flex items-center justify-center space-x-4 text-gray-700">
                  <Heart className="h-6 w-6 text-pink-500" />
                  <span className="font-semibold">Type: {petTypes.find(t => t.id === petData.type)?.name}</span>
                </div>
              </div>

              <button
                onClick={handleRewardModalClose}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-2xl font-bold hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105 mt-8"
              >
                Meet Your New Companion!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insufficient Coins Modal */}
      {showInsufficientCoinsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="backdrop-blur-2xl bg-white/95 border border-white/40 rounded-3xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-pink-500/10 to-rose-500/10"></div>
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Lock className="h-12 w-12 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-gray-800 mb-4">💰 Insufficient Cuddle Coins</h3>
              <p className="text-gray-600 text-lg mb-6">
                You need more Cuddle Coins to create a new pet companion.
              </p>

              <div className="bg-gradient-to-r from-red-100 to-pink-100 p-6 rounded-2xl border border-red-300 mb-6">
                <div className="flex items-center justify-center mb-3">
                  <AlertCircle className="h-8 w-8 text-red-600 mr-3" />
                  <span className="text-xl font-bold text-gray-800">Cost: 10,000 Coins</span>
                </div>
                <div className="space-y-2 text-gray-700">
                  <div>Your Balance: <span className="font-bold text-red-600">{user?.cuddleCoins?.toLocaleString() || 0}</span></div>
                  <div>Need: <span className="font-bold text-red-600">{(CREATION_COST - (user?.cuddleCoins || 0)).toLocaleString()}</span> more coins</div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 mb-6">
                <h4 className="font-bold text-gray-800 mb-3">💡 How to Earn More Coins:</h4>
                <div className="text-sm text-gray-700 space-y-2 text-left">
                  <div>• <strong>Feed & Pet existing pets:</strong> +5-25 coins each</div>
                  <div>• <strong>Chat with your pets:</strong> +5-15 coins per conversation</div>
                  <div>• <strong>Daily activities:</strong> +10-50 coins</div>
                  <div>• <strong>Premium membership:</strong> 5-20x faster earning</div>
                </div>
              </div>

              <button
                onClick={handleInsufficientCoinsModalClose}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-500 hover:scale-105"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <div key={step.number} className="flex items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      isActive 
                        ? 'border-purple-500 bg-purple-500 text-white' 
                        : isCompleted
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="ml-3 hidden sm:block">
                      <div className={`text-sm font-semibold ${
                        isActive ? 'text-purple-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        Step {step.number}
                      </div>
                      <div className={`text-sm ${
                        isActive ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-0.5 ml-4 ${
                        currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {steps[currentStep - 1].title}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>

            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={currentStep === steps.length && !hasEnoughCoins}
              className={`flex items-center px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                currentStep === steps.length && !hasEnoughCoins
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
              }`}
            >
              {currentStep === steps.length ? (
                hasEnoughCoins ? (
                  <>
                    Create Pet & Pay 10K Coins
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Insufficient Coins
                  </>
                )
              ) : (
                <>
                  Next
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePet;