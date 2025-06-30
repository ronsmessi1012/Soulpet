import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Heart, 
  Star,
  Gift,
  Crown,
  Zap,
  Camera,
  Mic,
  Video,
  Shield,
  Coins,
  Users,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, completeOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [preferences, setPreferences] = useState({
    favoriteAnimal: '',
    personalityType: '',
    interests: [] as string[],
    notifications: true,
    newsletter: false
  });

  const steps = [
    { number: 1, title: 'Welcome', icon: Heart },
    { number: 2, title: 'Preferences', icon: Star },
    { number: 3, title: 'Features', icon: Sparkles },
    { number: 4, title: 'Ready!', icon: Crown }
  ];

  const animalTypes = [
    { id: 'dog', name: 'Dogs', emoji: '🐕', description: 'Loyal and playful' },
    { id: 'cat', name: 'Cats', emoji: '🐱', description: 'Independent and mysterious' },
    { id: 'dragon', name: 'Dragons', emoji: '🐉', description: 'Magical and powerful' },
    { id: 'unicorn', name: 'Unicorns', emoji: '🦄', description: 'Graceful and enchanting' },
    { id: 'phoenix', name: 'Phoenix', emoji: '🔥', description: 'Majestic and reborn' },
    { id: 'all', name: 'All Types', emoji: '✨', description: 'I love them all!' }
  ];

  const personalityTypes = [
    { id: 'nurturing', name: 'Nurturing Parent', description: 'I love caring for and protecting my pets', color: 'from-green-400 to-emerald-500' },
    { id: 'adventurous', name: 'Adventure Seeker', description: 'I want exciting experiences and quests', color: 'from-orange-400 to-red-500' },
    { id: 'collector', name: 'Collector', description: 'I enjoy collecting rare and unique pets', color: 'from-purple-400 to-pink-500' },
    { id: 'social', name: 'Social Butterfly', description: 'I love sharing and connecting with others', color: 'from-blue-400 to-cyan-500' },
    { id: 'creative', name: 'Creative Soul', description: 'I enjoy customizing and creating unique experiences', color: 'from-indigo-400 to-purple-500' },
    { id: 'peaceful', name: 'Peaceful Spirit', description: 'I seek calm, relaxing interactions', color: 'from-teal-400 to-green-500' }
  ];

  const interests = [
    'Video Calls', 'Voice Chat', 'Pet Training', 'Collecting', 'Trading', 'Customization',
    'Storytelling', 'Gaming', 'Social Features', 'Meditation', 'Art Creation', 'Music'
  ];

  const features = [
    {
      icon: Video,
      title: 'AI Video Conversations',
      description: 'Your pets will respond with realistic video messages using advanced AI technology',
      highlight: 'Revolutionary'
    },
    {
      icon: Mic,
      title: 'Unique Voice Personalities',
      description: 'Each pet has a distinctive voice that matches their personality perfectly',
      highlight: 'Immersive'
    },
    {
      icon: Shield,
      title: 'Blockchain Ownership',
      description: 'Your pets are secured as NFTs on the blockchain - truly yours forever',
      highlight: 'Secure'
    },
    {
      icon: Coins,
      title: 'Cuddle Coin Economy',
      description: 'Earn rewards through love and care, spend on amazing customizations',
      highlight: 'Rewarding'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
      navigate('/create');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center mb-8 shadow-2xl">
                <Heart className="h-16 w-16 text-white animate-pulse" />
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-2 -left-6 w-6 h-6 bg-pink-400 rounded-full animate-pulse"></div>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Soul Pet AI, {user?.name}! 🎉
            </h2>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              You're about to embark on the most magical pet companionship journey ever created. 
              Let's personalize your experience to make it absolutely perfect for you!
            </p>

            {/* Enhanced Welcome Bonus Display */}
            <div className="bg-gradient-to-r from-yellow-100/80 via-orange-100/60 to-amber-100/80 backdrop-blur-sm p-8 rounded-3xl border border-white/40 shadow-2xl max-w-lg mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-xl animate-bounce mr-4">
                    <Gift className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <span className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      Welcome Bonus!
                    </span>
                    <div className="text-sm text-gray-600 mt-1">🎁 Special gift for new soul keepers</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center mb-4">
                  <Coins className="h-10 w-10 text-yellow-600 mr-3 animate-spin" />
                  <span className="text-5xl font-bold text-gray-800">{user?.cuddleCoins?.toLocaleString()}</span>
                </div>
                
                <div className="text-2xl font-bold text-yellow-600 mb-3">Cuddle Coins</div>
                <p className="text-gray-700 font-medium">
                  🌟 Start your journey with enough coins to create amazing pets and customize them to your heart's content!
                </p>
                
                <div className="mt-6 p-4 bg-white/60 rounded-2xl border border-white/40">
                  <div className="text-sm text-gray-600 mb-2">💡 <strong>Pro Tip:</strong></div>
                  <div className="text-sm text-gray-700">
                    • Create pets: <span className="font-bold text-green-600">+15 coins each</span><br/>
                    • Feed & pet them: <span className="font-bold text-blue-600">+5-25 coins</span><br/>
                    • Video calls: <span className="font-bold text-purple-600">+10-30 coins</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Tell Us About Yourself</h2>
              <p className="text-xl text-gray-600">Help us create the perfect experience for you</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">What's your favorite type of companion?</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {animalTypes.map((animal) => (
                  <button
                    key={animal.id}
                    onClick={() => setPreferences(prev => ({ ...prev, favoriteAnimal: animal.id }))}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-center hover:scale-105 ${
                      preferences.favoriteAnimal === animal.id
                        ? 'border-purple-500 bg-purple-50 shadow-xl'
                        : 'border-gray-200 hover:border-purple-300 bg-white/60'
                    }`}
                  >
                    <div className="text-4xl mb-3">{animal.emoji}</div>
                    <div className="font-semibold text-gray-900">{animal.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{animal.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">What type of pet parent are you?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalityTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setPreferences(prev => ({ ...prev, personalityType: type.id }))}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                      preferences.personalityType === type.id
                        ? 'border-purple-500 bg-purple-50 shadow-xl'
                        : 'border-gray-200 hover:border-purple-300 bg-white/60'
                    }`}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${type.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <div className="font-semibold text-gray-900 text-lg">{type.name}</div>
                    <div className="text-gray-600 mt-1">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">What interests you most? (Select all that apply)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-center hover:scale-105 ${
                      preferences.interests.includes(interest)
                        ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300 bg-white/60 text-gray-700'
                    }`}
                  >
                    {preferences.interests.includes(interest) && (
                      <CheckCircle className="h-4 w-4 mx-auto mb-2 text-purple-600" />
                    )}
                    <span className="font-medium">{interest}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Amazing Features Await You</h2>
              <p className="text-xl text-gray-600">Discover what makes Soul Pet AI truly magical</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="group p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                          <span className="ml-3 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
                            {feature.highlight}
                          </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 backdrop-blur-sm p-8 rounded-3xl border border-white/40 shadow-xl">
              <div className="text-center">
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Growing Community</h3>
                <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">10K+</div>
                    <div className="text-sm text-gray-600">Pet Parents</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">25K+</div>
                    <div className="text-sm text-gray-600">AI Pets Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rose-600">1M+</div>
                    <div className="text-sm text-gray-600">Love Moments</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto flex items-center justify-center mb-8 shadow-2xl">
                <Crown className="h-16 w-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-bounce flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              You're All Set! 🎉
            </h2>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your magical journey begins now! You're ready to create your first AI companion and experience 
              the most advanced pet relationship technology ever created.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/40 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Create Your First Pet</h3>
                <p className="text-gray-600 text-sm">Design the perfect companion with our advanced AI tools</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/40 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Start Conversations</h3>
                <p className="text-gray-600 text-sm">Experience magical video and voice interactions</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/40 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Coins className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Earn More Rewards</h3>
                <p className="text-gray-600 text-sm">Get 15 more Cuddle Coins for every pet you create</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-100/80 to-orange-100/80 backdrop-blur-sm p-6 rounded-2xl border border-white/40 shadow-lg max-w-md mx-auto">
              <div className="flex items-center justify-center mb-2">
                <Coins className="h-6 w-6 text-yellow-600 mr-2 animate-pulse" />
                <span className="font-bold text-gray-800">Your Current Balance:</span>
              </div>
              <div className="text-3xl font-bold text-yellow-600">{user?.cuddleCoins?.toLocaleString()} Cuddle Coins</div>
              <p className="text-sm text-gray-600 mt-1">Ready to create amazing pets!</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/80 via-pink-50/60 to-purple-50/80 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-pink-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-32 h-32 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-40 left-1/3 w-48 h-48 bg-gradient-to-r from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <div key={step.number} className="flex items-center">
                    <div className={`flex items-center justify-center w-16 h-16 rounded-full border-4 transition-all duration-500 ${
                      isActive 
                        ? 'border-purple-500 bg-purple-500 text-white shadow-xl scale-110' 
                        : isCompleted
                        ? 'border-green-500 bg-green-500 text-white shadow-lg'
                        : 'border-gray-300 bg-white text-gray-400'
                    }`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    
                    <div className="ml-4 hidden sm:block">
                      <div className={`text-sm font-bold ${
                        isActive ? 'text-purple-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        Step {step.number}
                      </div>
                      <div className={`text-lg font-semibold ${
                        isActive ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div className={`w-12 h-1 ml-6 mr-6 rounded-full transition-all duration-500 ${
                        currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="backdrop-blur-2xl bg-white/90 border border-white/50 rounded-3xl shadow-2xl p-8 md:p-12 mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between max-w-2xl mx-auto">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50 bg-white/80 border border-white/40 shadow-lg hover:shadow-xl'
              }`}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Previous
            </button>

            <button
              onClick={handleNext}
              className="flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-2xl font-bold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105"
            >
              {currentStep === steps.length ? 'Create Your First Pet' : 'Continue'}
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;