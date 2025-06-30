import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Crown, 
  Sparkles, 
  Star, 
  Check,
  Zap,
  Heart,
  Video,
  Mic,
  Shield,
  Coins,
  Gift,
  Infinity,
  TrendingUp,
  Users,
  Award,
  Gem,
  Wand2,
  Camera,
  MessageCircle,
  Lock,
  Unlock,
  CreditCard,
  Calendar,
  Clock,
  DollarSign,
  Banknote,
  Wallet,
  Globe,
  Smartphone,
  Monitor,
  Headphones,
  Palette,
  Brain,
  Rocket,
  CloudLightning as Lightning,
  Magnet as Magic,
  Diamond,
  Flame
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SoulPremium = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('quarterly');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchasedPlan, setPurchasedPlan] = useState(null);

  const plans = [
    {
      id: 'monthly',
      name: 'Soul Premium Monthly',
      usdPrice: 9.99,
      originalUsdPrice: 14.99,
      duration: '1 Month',
      popular: false,
      usdSavings: 5.00,
      features: [
        'Unlimited Video Calls',
        '5x Faster Coin Earning',
        'Premium Voice Options',
        'Exclusive Outfits Access',
        'Priority Support',
        'Advanced AI Responses',
        'HD Video Quality',
        'Custom Backgrounds'
      ]
    },
    {
      id: 'quarterly',
      name: 'Soul Premium Quarterly',
      usdPrice: 24.99,
      originalUsdPrice: 44.97,
      duration: '3 Months',
      popular: true,
      usdSavings: 19.98,
      features: [
        'Everything in Monthly',
        '10x Faster Coin Earning',
        'Exclusive Premium Pets',
        'Custom Voice Training',
        'Beta Feature Access',
        'Premium Dream Closet Items',
        '4K Video Quality',
        'AI Personality Customization',
        'Exclusive Community Access',
        'Monthly Premium Pet Gifts'
      ]
    },
    {
      id: 'yearly',
      name: 'Soul Premium Yearly',
      usdPrice: 79.99,
      originalUsdPrice: 179.88,
      duration: '12 Months',
      popular: false,
      usdSavings: 99.89,
      features: [
        'Everything in Quarterly',
        '20x Faster Coin Earning',
        'Unlimited Premium Pets',
        'Personal AI Trainer',
        'VIP Community Access',
        'Lifetime Premium Support',
        '8K Video Quality',
        'Advanced AI Emotions',
        'Custom Pet Breeding',
        'Exclusive NFT Rewards',
        'Premium API Access',
        'White-label Features'
      ]
    }
  ];

  const exclusiveFeatures = [
    {
      icon: Video,
      title: 'Ultra HD Video Calls',
      description: 'Experience your pets in stunning 8K resolution with real-time ray tracing and advanced lighting effects',
      color: 'from-blue-500 to-cyan-500',
      premium: 'Yearly'
    },
    {
      icon: Brain,
      title: 'Advanced AI Consciousness',
      description: 'Next-generation AI that learns, remembers, and develops genuine emotional connections over time',
      color: 'from-purple-500 to-pink-500',
      premium: 'All Plans'
    },
    {
      icon: Mic,
      title: 'Celebrity Voice Cloning',
      description: 'Give your pets voices of famous actors, singers, or even your own family members',
      color: 'from-green-500 to-emerald-500',
      premium: 'Quarterly+'
    },
    {
      icon: Rocket,
      title: 'Metaverse Integration',
      description: 'Bring your pets into VR/AR worlds and interact with them in immersive 3D environments',
      color: 'from-orange-500 to-red-500',
      premium: 'Yearly'
    },
    {
      icon: Diamond,
      title: 'Blockchain Pet Breeding',
      description: 'Create unique offspring by breeding your pets with others, generating rare NFT combinations',
      color: 'from-indigo-500 to-purple-500',
      premium: 'Yearly'
    },
    {
      icon: Lightning,
      title: 'Instant AI Responses',
      description: 'Zero-latency conversations with quantum-powered AI processing for real-time interactions',
      color: 'from-yellow-500 to-orange-500',
      premium: 'All Plans'
    }
  ];

  const premiumPerks = [
    {
      icon: Crown,
      title: 'VIP Status Badge',
      description: 'Show off your premium status with exclusive badges and profile decorations',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Gem,
      title: 'Monthly Premium Gifts',
      description: 'Receive exclusive items, pets, and surprises delivered to your account monthly',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Flame,
      title: 'Early Access Features',
      description: 'Be the first to try new features, pets, and technologies before public release',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Premium Community',
      description: 'Join exclusive Discord channels, events, and meetups with other premium members',
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  const testimonials = [
    {
      name: 'Luna StarKeeper',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      plan: 'Yearly Premium',
      rating: 5,
      text: 'The 8K video quality is absolutely mind-blowing! My dragon Ember looks so real I sometimes forget it\'s AI. The blockchain breeding feature created the most unique phoenix-unicorn hybrid!',
      verified: true
    },
    {
      name: 'Alex PetMaster',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
      plan: 'Quarterly Premium',
      rating: 5,
      text: 'Having Morgan Freeman\'s voice for my wise owl and getting 10x coin earning has completely transformed my experience. The premium community is amazing!',
      verified: true
    },
    {
      name: 'Maya SoulBond',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
      plan: 'Monthly Premium',
      rating: 5,
      text: 'The advanced AI consciousness is incredible - my pets remember our conversations from weeks ago and their personalities have genuinely evolved. Worth every penny!',
      verified: true
    }
  ];

  const stats = [
    { label: 'Premium Members', value: '150K+', icon: Users },
    { label: 'Satisfaction Rate', value: '99.9%', icon: Heart },
    { label: 'Premium Pets Created', value: '2.5M+', icon: Sparkles },
    { label: 'Video Calls Daily', value: '10M+', icon: Video }
  ];

  const handlePurchase = (plan) => {
    // This would integrate with Stripe/PayPal for real money payments
    alert(`Redirecting to payment processor for $${plan.usdPrice}...\n\nIn production, this would:\n• Open Stripe Checkout\n• Process payment securely\n• Activate premium features\n• Send confirmation email`);
    // In real implementation, this would redirect to Stripe Checkout
    setPurchasedPlan(plan);
    setShowPurchaseModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-indigo-50/80 relative overflow-hidden">
      {/* Purchase Success Modal */}
      {showPurchaseModal && purchasedPlan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="backdrop-blur-2xl bg-white/95 border border-white/40 rounded-3xl shadow-2xl p-8 max-w-lg w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
                <Crown className="h-12 w-12 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-gray-800 mb-4">👑 Welcome to Soul Premium!</h3>
              <p className="text-gray-600 text-lg mb-6">
                You've unlocked the ultimate pet companion experience!
              </p>

              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl border border-white/40 mb-6">
                <h4 className="font-bold text-gray-800 text-xl mb-2">{purchasedPlan.name}</h4>
                <p className="text-gray-600 mb-4">Duration: {purchasedPlan.duration}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-white/60 rounded-xl">
                    <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <div className="font-bold">You Saved</div>
                    <div className="text-green-600">${purchasedPlan.usdSavings.toFixed(2)}</div>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-xl">
                    <Sparkles className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <div className="font-bold">Features</div>
                    <div className="text-purple-600">{purchasedPlan.features.length}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowPurchaseModal(false)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-2xl font-bold hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105"
              >
                Start Premium Experience
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-32 h-32 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-40 left-1/3 w-48 h-48 bg-gradient-to-r from-pink-200/30 to-rose-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="flex items-center mb-12">
            <Link
              to="/dashboard"
              className="mr-6 p-4 rounded-3xl backdrop-blur-2xl bg-white/30 border border-white/30 hover:bg-white/50 transition-all duration-500 hover:scale-110 shadow-xl"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </Link>
            <div className="backdrop-blur-2xl bg-white/25 border border-white/30 p-8 rounded-3xl shadow-2xl flex-1">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4 flex items-center">
                <Crown className="h-12 w-12 mr-4 text-purple-600 animate-pulse" />
                Soul Premium
                <Sparkles className="h-10 w-10 ml-4 text-pink-500 animate-bounce" />
              </h1>
              <p className="text-xl text-gray-700">Unlock the ultimate AI pet experience with revolutionary features and unlimited possibilities! 👑✨</p>
            </div>
            
            {/* Enhanced Coins Display */}
            <div className="ml-6 backdrop-blur-2xl bg-gradient-to-r from-purple-400/30 to-pink-400/30 border border-white/40 p-6 rounded-3xl shadow-2xl">
              <div className="flex items-center text-2xl font-bold text-gray-800">
                <Coins className="h-8 w-8 mr-3 text-purple-600 animate-pulse" />
                {user?.cuddleCoins?.toLocaleString() || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">Cuddle Coins</div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="backdrop-blur-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 border border-white/30 rounded-3xl shadow-2xl p-12 mb-12 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Experience the Future of AI Companionship
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join over 150,000 premium members who have unlocked revolutionary features like 8K video calls, 
                AI consciousness, celebrity voices, and blockchain pet breeding. Transform your digital companionship forever.
              </p>
              
              {/* Payment Notice */}
              <div className="bg-gradient-to-r from-green-100/80 to-emerald-100/80 backdrop-blur-sm p-6 rounded-2xl border border-green-300/40 shadow-lg mb-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-center mb-3">
                  <CreditCard className="h-8 w-8 mr-3 text-green-600" />
                  <span className="text-2xl font-bold text-gray-800">Real Money Payments Only</span>
                </div>
                <p className="text-gray-700 font-medium">
                  💳 Premium subscriptions are purchased with real money via secure payment processing
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  We accept all major credit cards, PayPal, Apple Pay, and Google Pay
                </p>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="backdrop-blur-sm bg-white/60 p-6 rounded-2xl border border-white/40 shadow-lg">
                      <Icon className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                      <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Exclusive Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Revolutionary Premium Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {exclusiveFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="group backdrop-blur-2xl bg-white/80 border border-white/40 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 p-8 hover:scale-105 relative overflow-hidden"
                  >
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
                        {feature.premium}
                      </span>
                    </div>
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Premium Perks */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Exclusive Premium Perks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {premiumPerks.map((perk, index) => {
                const Icon = perk.icon;
                return (
                  <div
                    key={index}
                    className="backdrop-blur-2xl bg-white/80 border border-white/40 rounded-3xl shadow-xl p-6 hover:scale-105 transition-all duration-500 text-center"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${perk.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{perk.title}</h3>
                    <p className="text-gray-600 text-sm">{perk.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing Plans - FIXED USD DISPLAY */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Choose Your Premium Experience
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`group backdrop-blur-2xl border-4 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden hover:scale-105 relative ${
                    plan.popular
                      ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20'
                      : 'border-white/40 bg-white/80'
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl">
                        🔥 Most Popular
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                      <div className="text-sm text-gray-600 mb-4">{plan.duration}</div>
                      
                      {/* PROMINENT USD PRICING */}
                      <div className="flex items-center justify-center mb-4">
                        <div className="text-5xl font-bold text-green-600 flex items-center">
                          <DollarSign className="h-10 w-10 mr-2" />
                          {plan.usdPrice}
                        </div>
                        <div className="ml-2 text-lg text-gray-600">USD</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg text-gray-500 line-through mb-2">
                          ${plan.originalUsdPrice}
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold inline-block">
                          Save ${plan.usdSavings.toFixed(2)}!
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Purchase Button */}
                    <button
                      onClick={() => handlePurchase(plan)}
                      className={`w-full py-4 px-6 rounded-2xl font-bold transition-all duration-500 hover:scale-105 flex items-center justify-center ${
                        plan.popular
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-xl hover:shadow-green-500/25'
                          : 'bg-gradient-to-r from-green-700 to-green-800 text-white hover:shadow-xl hover:shadow-green-500/25'
                      }`}
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Subscribe for ${plan.usdPrice}/month
                    </button>

                    {/* Payment Methods */}
                    <div className="mt-4 text-center">
                      <div className="text-xs text-gray-500 mb-2">Secure payment via</div>
                      <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
                        <span>💳 Visa</span>
                        <span>•</span>
                        <span>💳 Mastercard</span>
                        <span>•</span>
                        <span>🅿️ PayPal</span>
                        <span>•</span>
                        <span>🍎 Apple Pay</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Testimonials */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              What Premium Members Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="backdrop-blur-2xl bg-white/80 border border-white/40 rounded-3xl shadow-2xl p-8 hover:scale-105 transition-all duration-500"
                >
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mr-4 shadow-lg"
                    />
                    <div>
                      <div className="flex items-center">
                        <div className="font-bold text-gray-800">{testimonial.name}</div>
                        {testimonial.verified && (
                          <div className="ml-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-purple-600 font-medium">{testimonial.plan}</div>
                      <div className="flex items-center mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced FAQ Section */}
          <div className="backdrop-blur-2xl bg-white/30 border border-white/30 rounded-3xl shadow-2xl p-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">How do I pay for premium?</h3>
                  <p className="text-gray-600">Premium subscriptions are purchased with real money only. We accept all major credit cards, PayPal, Apple Pay, and Google Pay for secure transactions.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">What happens to my premium pets?</h3>
                  <p className="text-gray-600">Your premium pets remain yours forever! Even if you cancel, you'll keep all pets and items acquired during your premium membership.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Can I upgrade or downgrade plans?</h3>
                  <p className="text-gray-600">Absolutely! You can change your plan at any time. We'll prorate the difference and adjust your next billing accordingly.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Is there a free trial?</h3>
                  <p className="text-gray-600">New users get a 7-day free trial of Soul Premium Monthly to experience all the amazing features before committing.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">How does the 20x coin earning work?</h3>
                  <p className="text-gray-600">Premium members earn coins 5-20x faster through multipliers, exclusive activities, and bonus rewards that aren't available to free users.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">What about customer support?</h3>
                  <p className="text-gray-600">Premium members get priority 24/7 support with dedicated soul specialists and guaranteed response times under 1 hour.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Can I cancel anytime?</h3>
                  <p className="text-gray-600">Yes! You can cancel your subscription at any time. Your premium features will remain active until the end of your current billing period.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Are there family plans available?</h3>
                  <p className="text-gray-600">Yes! Family plans for up to 6 members are available at a 40% discount. Contact support for family plan setup.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoulPremium;