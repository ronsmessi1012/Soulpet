import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageCircle, 
  Send, 
  Heart, 
  Star, 
  Crown, 
  Zap,
  Gift,
  TrendingUp,
  Coins,
  Sparkles,
  ShoppingBag,
  Clock,
  AlertCircle,
  Bot,
  Loader,
  Mic,
  MicOff
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { chatbotService, ChatMessage } from '../services/chatbotService';
import { voiceService } from '../services/voiceService';
import VoiceMessageBubble from '../components/VoiceMessageBubble';
import VoiceRecorder from '../components/VoiceRecorder';

const PetProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateCuddleCoins, updatePetStats, canFeedPet, canPetPet } = useAuth();
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [userCoins, setUserCoins] = useState(0);
  const [feedingAnimation, setFeedingAnimation] = useState(false);
  const [pettingAnimation, setPettingAnimation] = useState(false);
  const [showCoinsEarned, setShowCoinsEarned] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [heartFloating, setHeartFloating] = useState(false);
  const [pet, setPet] = useState(null);
  
  // 🤖 Chatbot integration state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // 🎤 Voice messaging state
  const [isRecording, setIsRecording] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  // Find the pet from user's pets array based on ID
  useEffect(() => {
    if (user?.pets && id) {
      const foundPet = user.pets.find(p => p.id === id);
      if (foundPet) {
        setPet(foundPet);
        
        // 🤖 Initialize chatbot for this pet
        const petPersonality = {
          name: foundPet.name,
          type: foundPet.type,
          personality: foundPet.personality,
          voice: foundPet.voice,
          backstory: foundPet.backstory,
          mood: foundPet.mood,
          level: foundPet.level,
          emotionalBond: foundPet.emotionalBond
        };
        
        const initialChat = chatbotService.initializePetChat(foundPet.id, petPersonality);
        setChatHistory(initialChat);
        
        console.log('🤖 CHATBOT INITIALIZED FOR PET:', {
          petId: foundPet.id,
          petName: foundPet.name,
          initialMessages: initialChat.length
        });
      } else {
        // Pet not found, redirect to dashboard
        navigate('/dashboard');
      }
    } else if (user && (!user.pets || user.pets.length === 0)) {
      // No pets exist, redirect to dashboard
      navigate('/dashboard');
    }
  }, [user, id, navigate]);

  // Check voice support
  useEffect(() => {
    const checkVoiceSupport = () => {
      const recordingSupported = voiceService.isRecordingSupported();
      setVoiceSupported(recordingSupported);
      
      console.log('🎤 Voice support check:', {
        recording: recordingSupported,
        overall: recordingSupported
      });
    };

    checkVoiceSupport();
  }, []);

  // Update userCoins when user data changes
  useEffect(() => {
    if (user) {
      setUserCoins(user.cuddleCoins);
    }
  }, [user]);

  // Generate dynamic activities based on pet data
  const generateSoulActivities = (petData) => {
    if (!petData) return [];

    const createdDate = new Date(petData.createdDate);
    const now = new Date();
    const daysSinceCreated = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

    const activities = [
      { 
        type: 'creation', 
        description: `${petData.name} was born into this world with pure love and excitement!`, 
        time: daysSinceCreated === 0 ? 'Today' : `${daysSinceCreated} day${daysSinceCreated === 1 ? '' : 's'} ago`, 
        icon: Star, 
        coins: 15,
        emotionalImpact: 'Soul awakening achieved'
      }
    ];

    // Add feeding activity if pet has been fed
    if (petData.lastFed !== 'Never') {
      activities.unshift({
        type: 'feeding', 
        description: `Savored a meal prepared with love, ${petData.mood === 'happy' ? 'purring with pure bliss' : 'feeling grateful and nourished'}`, 
        time: petData.lastFed, 
        icon: Gift, 
        coins: 15,
        emotionalImpact: 'Nourished soul and body'
      });
    }

    // Add petting activity if pet has been petted
    if (petData.lastPetted !== 'Never') {
      activities.unshift({
        type: 'petting', 
        description: `Received the most gentle, loving touches that warmed ${petData.name}'s heart`, 
        time: petData.lastPetted, 
        icon: Heart, 
        coins: 10,
        emotionalImpact: 'Felt deeply cherished'
      });
    }

    // Add level up activities based on current level
    if (petData.level > 1) {
      activities.push({
        type: 'level', 
        description: `Ascended to level ${petData.level} through the power of your unconditional love!`, 
        time: `${Math.floor(Math.random() * 5) + 1} day${Math.floor(Math.random() * 5) + 1 === 1 ? '' : 's'} ago`, 
        icon: Star, 
        coins: 50,
        emotionalImpact: 'Soul evolution achieved'
      });
    }

    return activities;
  };

  const handleFeedPet = () => {
    if (!pet || !canFeedPet(pet.id)) return;
    
    setFeedingAnimation(true);
    setHeartFloating(true);
    const coinsGained = Math.floor(Math.random() * 25) + 15;
    
    setTimeout(() => {
      const updates = {
        hunger: Math.min(100, pet.hunger + 30),
        happiness: Math.min(100, pet.happiness + 15),
        affection: Math.min(100, pet.affection + 10),
        mood: 'grateful',
        emotionalBond: Math.min(100, pet.emotionalBond + 2),
        lastFed: 'Just now',
        coinsEarned: pet.coinsEarned + coinsGained
      };
      
      updatePetStats(pet.id, updates);
      updateCuddleCoins(coinsGained);
      setCoinsEarned(coinsGained);
      setShowCoinsEarned(true);
      setFeedingAnimation(false);
      
      setTimeout(() => {
        setShowCoinsEarned(false);
        setHeartFloating(false);
      }, 3000);
    }, 2500);
  };

  const handlePetPet = () => {
    if (!pet || !canPetPet(pet.id)) return;
    
    setPettingAnimation(true);
    setHeartFloating(true);
    const coinsGained = Math.floor(Math.random() * 20) + 10;
    
    setTimeout(() => {
      const updates = {
        affection: Math.min(100, pet.affection + 20),
        happiness: Math.min(100, pet.happiness + 12),
        energy: Math.min(100, pet.energy + 8),
        mood: 'loved',
        emotionalBond: Math.min(100, pet.emotionalBond + 3),
        lastPetted: 'Just now',
        coinsEarned: pet.coinsEarned + coinsGained
      };
      
      updatePetStats(pet.id, updates);
      updateCuddleCoins(coinsGained);
      setCoinsEarned(coinsGained);
      setShowCoinsEarned(true);
      setPettingAnimation(false);
      
      setTimeout(() => {
        setShowCoinsEarned(false);
        setHeartFloating(false);
      }, 3000);
    }, 2000);
  };

  // 💬 TEXT message sending
  const handleSendTextMessage = async () => {
    if (!message.trim() || !pet || isSendingMessage) return;
    
    console.log('💬 SENDING TEXT MESSAGE:', {
      petId: pet.id,
      petName: pet.name,
      userMessage: message.trim(),
      timestamp: new Date().toISOString()
    });

    const userMessage = message.trim();
    setMessage('');
    setIsSendingMessage(true);
    setIsTyping(true);

    try {
      // Prepare pet personality for API
      const petPersonality = {
        name: pet.name,
        type: pet.type,
        personality: pet.personality,
        voice: pet.voice,
        backstory: pet.backstory,
        mood: pet.mood,
        level: pet.level,
        emotionalBond: pet.emotionalBond
      };

      // Send TEXT message to chatbot API
      const updatedChatHistory = await chatbotService.sendTextMessage(
        pet.id,
        userMessage,
        petPersonality
      );

      // Update chat history state
      setChatHistory(updatedChatHistory);

      // Simulate earning coins from chatting
      const coinsGained = Math.floor(Math.random() * 10) + 5;
      updateCuddleCoins(coinsGained);
      
      // Update pet's total chats
      updatePetStats(pet.id, {
        totalChats: pet.totalChats + 1,
        coinsEarned: pet.coinsEarned + coinsGained,
        emotionalBond: Math.min(100, pet.emotionalBond + 1)
      });

      console.log('✅ TEXT MESSAGE SENT SUCCESSFULLY:', {
        totalMessages: updatedChatHistory.length,
        coinsEarned: coinsGained
      });

    } catch (error) {
      console.error('❌ ERROR SENDING TEXT MESSAGE:', error);
    } finally {
      setIsSendingMessage(false);
      setIsTyping(false);
    }
  };

  // 🎤 Voice message handling - NO MORE ERROR POPUPS
  const handleStartVoiceRecording = async () => {
    if (!voiceSupported) {
      console.log('⚠️ Voice messaging not supported, but continuing silently');
      return;
    }

    try {
      await voiceService.startRecording();
      setIsRecording(true);
      setShowVoiceRecorder(true);
      console.log('🎤 Voice recording started');
    } catch (error) {
      console.log('⚠️ Voice recording failed, but continuing silently');
    }
  };

  const handleVoiceMessage = async (audioBlob: Blob) => {
    if (!pet) return;

    console.log('🎤 PROCESSING VOICE MESSAGE:', {
      petId: pet.id,
      petName: pet.name,
      audioBlobSize: audioBlob.size,
      timestamp: new Date().toISOString()
    });

    setShowVoiceRecorder(false);
    setIsRecording(false);
    setIsSendingMessage(true);
    setIsTyping(true);

    try {
      // Prepare pet personality for API
      const petPersonality = {
        name: pet.name,
        type: pet.type,
        personality: pet.personality,
        voice: pet.voice,
        backstory: pet.backstory,
        mood: pet.mood,
        level: pet.level,
        emotionalBond: pet.emotionalBond
      };

      // Send VOICE message (with built-in fallback)
      const updatedChatHistory = await chatbotService.sendVoiceMessage(
        pet.id,
        audioBlob,
        petPersonality
      );

      // Update chat history state
      setChatHistory(updatedChatHistory);

      // Simulate earning more coins from voice chatting
      const coinsGained = Math.floor(Math.random() * 15) + 10;
      updateCuddleCoins(coinsGained);
      
      // Update pet's total chats and emotional bond
      updatePetStats(pet.id, {
        totalChats: pet.totalChats + 1,
        coinsEarned: pet.coinsEarned + coinsGained,
        emotionalBond: Math.min(100, pet.emotionalBond + 2)
      });

      console.log('✅ VOICE MESSAGE PROCESSED SUCCESSFULLY:', {
        totalMessages: updatedChatHistory.length,
        coinsEarned: coinsGained
      });

    } catch (error) {
      console.log('⚠️ Voice message processed with fallback');
    } finally {
      setIsSendingMessage(false);
      setIsTyping(false);
    }
  };

  const handleCancelVoiceRecording = () => {
    setShowVoiceRecorder(false);
    setIsRecording(false);
    console.log('🎤 Voice recording cancelled');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendTextMessage();
    }
  };

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'wise': return '🧙‍♂️';
      case 'dreamy': return '✨';
      case 'content': return '😌';
      case 'sleepy': return '😴';
      case 'excited': return '🤩';
      case 'grateful': return '🥰';
      case 'loved': return '😍';
      case 'sad': return '😢';
      case 'hungry': return '😋';
      case 'lonely': return '🥺';
      case 'transcendent': return '🌟';
      case 'blessed': return '✨';
      case 'apologetic': return '😅';
      default: return '😊';
    }
  };

  const getHeartLevelColor = (level) => {
    switch (level) {
      case 'high': return 'text-pink-500';
      case 'very high': return 'text-rose-500';
      case 'maximum': return 'text-red-500';
      case 'transcendent': return 'text-purple-500';
      default: return 'text-pink-400';
    }
  };

  const getTimeUntilNextAction = (lastActionTime) => {
    const now = Date.now();
    const COOLDOWN = 8 * 60 * 60 * 1000; // 8 hours
    const timeUntilNext = COOLDOWN - (now - lastActionTime);
    
    if (timeUntilNext <= 0) return null;
    
    const hours = Math.floor(timeUntilNext / (60 * 60 * 1000));
    const minutes = Math.floor((timeUntilNext % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours}h ${minutes}m`;
  };

  // Show loading or redirect if pet not found
  if (!pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50/80 via-pink-50/60 to-purple-50/80 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your magical companion...</p>
        </div>
      </div>
    );
  }

  const soulActivities = generateSoulActivities(pet);
  const canFeed = canFeedPet(pet.id);
  const canPet = canPetPet(pet.id);
  const feedCooldown = getTimeUntilNextAction(pet.lastFeedTime);
  const petCooldown = getTimeUntilNextAction(pet.lastPetTime);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/80 via-pink-50/60 to-purple-50/80 relative overflow-hidden">
      {/* Voice Recorder Modal */}
      {showVoiceRecorder && (
        <VoiceRecorder
          onVoiceMessage={handleVoiceMessage}
          onCancel={handleCancelVoiceRecording}
          isRecording={isRecording}
          petName={pet.name}
        />
      )}

      {/* Floating Background Hearts */}
      {heartFloating && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            >
              <Heart className="h-6 w-6 text-pink-400 fill-current" />
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-pink-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-32 h-32 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-40 left-1/3 w-48 h-48 bg-gradient-to-r from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Enhanced Coins Earned Animation */}
      {showCoinsEarned && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-500 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center text-2xl font-bold backdrop-blur-xl border border-white/30">
            <Coins className="h-8 w-8 mr-3 animate-spin" />
            +{coinsEarned} Cuddle Coins!
            <Sparkles className="h-6 w-6 ml-3 animate-pulse" />
          </div>
        </div>
      )}
      
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
            <div className="backdrop-blur-2xl bg-white/25 border border-white/30 p-6 rounded-3xl shadow-2xl flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                Soul Connection with {pet.name} {getMoodEmoji(pet.mood)}
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Emotional Bond: <span className="font-bold text-purple-600">{pet.emotionalBond}%</span> • 
                Connection Level: <span className="font-bold text-pink-600">
                  {pet.emotionalBond >= 90 ? 'Transcendent' : pet.emotionalBond >= 70 ? 'Deep' : pet.emotionalBond >= 50 ? 'Growing' : 'New'}
                </span>
              </p>
              
              {/* 🤖 AI Chatbot Status Indicator */}
              <div className="mt-3 flex items-center">
                <Bot className="h-5 w-5 mr-2 text-blue-600 animate-pulse" />
                <span className="text-sm font-medium text-gray-700">
                  AI Chatbot: <span className="text-green-600">Connected</span>
                </span>
                {isTyping && (
                  <div className="ml-3 flex items-center">
                    <Loader className="h-4 w-4 mr-1 text-purple-600 animate-spin" />
                    <span className="text-xs text-purple-600">{pet.name} is thinking...</span>
                  </div>
                )}
                {/* 🎤 Voice Support Indicator */}
                {voiceSupported && (
                  <div className="ml-4 flex items-center">
                    <Mic className="h-4 w-4 mr-1 text-green-600" />
                    <span className="text-xs text-green-600">Voice Ready</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Enhanced Coins Display */}
            <div className="ml-6 backdrop-blur-2xl bg-gradient-to-r from-yellow-400/30 to-orange-400/30 border border-white/40 p-6 rounded-3xl shadow-2xl">
              <div className="flex items-center text-2xl font-bold text-gray-800">
                <Coins className="h-8 w-8 mr-3 text-yellow-600 animate-pulse" />
                {userCoins.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mt-1">Cuddle Coins</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Enhanced Pet Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="backdrop-blur-2xl bg-white/25 border border-white/30 rounded-3xl shadow-2xl overflow-hidden sticky top-8">
                <div className="relative">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className={`w-full h-72 object-cover transition-all duration-700 ${
                      feedingAnimation ? 'animate-pulse scale-105 brightness-110' : 
                      pettingAnimation ? 'animate-bounce scale-105 brightness-110' : ''
                    }`}
                  />
                  
                  {/* Enhanced Mood Aura */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${pet.moodAura} opacity-60 transition-opacity duration-700`}></div>
                  
                  {/* Enhanced Mood Indicator */}
                  <div className="absolute top-4 left-4">
                    <div className={`px-4 py-3 bg-gradient-to-r ${pet.moodAura} backdrop-blur-xl border border-white/50 rounded-2xl text-gray-800 text-sm font-bold flex items-center shadow-xl`}>
                      <span className="mr-2 text-xl">{getMoodEmoji(pet.mood)}</span>
                      {pet.mood}
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <div className={`px-4 py-2 rounded-2xl text-sm font-semibold backdrop-blur-xl border border-white/50 shadow-xl ${
                      pet.status === 'online' 
                        ? 'bg-green-400/80 text-white' 
                        : pet.status === 'blessed'
                        ? 'bg-purple-400/80 text-white'
                        : 'bg-gray-400/80 text-white'
                    }`}>
                      {pet.status}
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-2xl text-sm font-semibold flex items-center shadow-xl">
                      <Star className="h-4 w-4 mr-2" />
                      Soul Level {pet.level}
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{pet.name}</h2>
                  <p className="text-gray-600 mb-2 text-lg">{pet.type} • {pet.personality}</p>
                  <p className="text-sm text-purple-600 font-medium mb-6 flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    {pet.outfit}
                  </p>
                  
                  {/* Enhanced Emotional Stats */}
                  <div className="space-y-6 mb-8">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 flex items-center font-medium">
                          <Heart className="h-4 w-4 mr-2 text-pink-500 animate-pulse" />
                          Soul Affection
                        </span>
                        <span className="font-bold text-lg">{pet.affection}%</span>
                      </div>
                      <div className="w-full bg-gray-200/60 rounded-full h-4 shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 h-4 rounded-full transition-all duration-1000 shadow-lg"
                          style={{ width: `${pet.affection}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 font-medium">🍽️ Soul Nourishment</span>
                        <span className="font-bold text-lg">{pet.hunger}%</span>
                      </div>
                      <div className="w-full bg-gray-200/60 rounded-full h-4 shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 h-4 rounded-full transition-all duration-1000 shadow-lg"
                          style={{ width: `${pet.hunger}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 flex items-center font-medium">
                          <Sparkles className="h-4 w-4 mr-2 text-yellow-500 animate-spin" />
                          Pure Happiness
                        </span>
                        <span className="font-bold text-lg">{pet.happiness}%</span>
                      </div>
                      <div className="w-full bg-gray-200/60 rounded-full h-4 shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-400 h-4 rounded-full transition-all duration-1000 shadow-lg"
                          style={{ width: `${pet.happiness}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Care Actions with Cooldowns */}
                  <div className="space-y-4 mb-8">
                    <div className="relative">
                      <button 
                        onClick={handleFeedPet}
                        disabled={feedingAnimation || !canFeed}
                        className={`w-full py-4 px-6 rounded-3xl font-bold transition-all duration-500 flex items-center justify-center text-lg ${
                          feedingAnimation ? 'animate-pulse scale-105' : ''
                        } ${
                          canFeed 
                            ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:shadow-2xl hover:shadow-green-500/25 hover:scale-105' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <span className="text-2xl mr-3">🍽️</span>
                        {feedingAnimation ? 'Nourishing Soul...' : canFeed ? 'Feed with Pure Love' : 'On Cooldown'}
                        <Coins className="h-5 w-5 ml-3" />
                      </button>
                      {!canFeed && feedCooldown && (
                        <div className="absolute -bottom-6 left-0 right-0 text-center">
                          <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                            <Clock className="h-3 w-3 mr-1" />
                            {feedCooldown}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="relative mt-8">
                      <button 
                        onClick={handlePetPet}
                        disabled={pettingAnimation || !canPet}
                        className={`w-full py-4 px-6 rounded-3xl font-bold transition-all duration-500 flex items-center justify-center text-lg ${
                          pettingAnimation ? 'animate-bounce scale-105' : ''
                        } ${
                          canPet 
                            ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white hover:shadow-2xl hover:shadow-pink-500/25 hover:scale-105' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <span className="text-2xl mr-3">🤍</span>
                        {pettingAnimation ? 'Touching Hearts...' : canPet ? 'Touch to Bond Souls' : 'On Cooldown'}
                        <Coins className="h-5 w-5 ml-3" />
                      </button>
                      {!canPet && petCooldown && (
                        <div className="absolute -bottom-6 left-0 right-0 text-center">
                          <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                            <Clock className="h-3 w-3 mr-1" />
                            {petCooldown}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cooldown Notice */}
                  {(!canFeed || !canPet) && (
                    <div className="bg-gradient-to-r from-blue-100/60 to-cyan-100/60 backdrop-blur-sm p-4 rounded-2xl border border-blue-300/40 shadow-lg mb-6">
                      <div className="flex items-center mb-2">
                        <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm font-bold text-gray-800">Care Cooldown Active</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Your pet needs time to fully appreciate your love. Each action has an 8-hour cooldown to maintain their well-being.
                      </p>
                    </div>
                  )}

                  {/* Enhanced NFT Value */}
                  <div className="bg-gradient-to-r from-purple-100/60 to-pink-100/60 backdrop-blur-sm p-6 rounded-3xl mb-8 border border-white/40 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600">Soul NFT Value</div>
                        <div className="text-2xl font-bold text-purple-600">
                          {(2.5 + (pet.level * 0.1) + (pet.emotionalBond * 0.01)).toFixed(2)} ALGO
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Eternal ownership</div>
                      </div>
                      <Crown className="h-10 w-10 text-purple-500 animate-pulse" />
                    </div>
                  </div>

                  {/* Enhanced Quick Actions */}
                  <div className="space-y-4">
                    <Link
                      to="/dream-closet"
                      className="block w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 px-6 rounded-3xl font-bold hover:shadow-2xl hover:shadow-yellow-500/25 transition-all duration-500 hover:scale-105 text-center"
                    >
                      <ShoppingBag className="h-6 w-6 mr-3 inline" />
                      Dream Closet
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Main Chat Area */}
            <div className="lg:col-span-3">
              <div className="backdrop-blur-2xl bg-white/25 border border-white/30 rounded-3xl shadow-2xl h-[800px] flex flex-col">
                {/* Enhanced Tab Navigation */}
                <div className="flex border-b border-white/30">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 py-6 px-8 font-bold transition-all duration-500 rounded-t-3xl text-lg ${
                      activeTab === 'chat'
                        ? 'text-purple-600 bg-white/40 border-b-4 border-purple-600 shadow-lg'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-white/30'
                    }`}
                  >
                    <MessageCircle className="h-6 w-6 inline mr-3" />
                    Soul-to-Soul Chat
                    {isTyping && (
                      <Loader className="h-4 w-4 inline ml-2 animate-spin text-purple-600" />
                    )}
                    {voiceSupported && (
                      <Mic className="h-4 w-4 inline ml-2 text-green-600" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`flex-1 py-6 px-8 font-bold transition-all duration-500 text-lg ${
                      activeTab === 'activity'
                        ? 'text-purple-600 bg-white/40 border-b-4 border-purple-600 shadow-lg'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-white/30'
                    }`}
                  >
                    <TrendingUp className="h-6 w-6 inline mr-3" />
                    Love Journey
                  </button>
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`flex-1 py-6 px-8 font-bold transition-all duration-500 rounded-t-3xl text-lg ${
                      activeTab === 'info'
                        ? 'text-purple-600 bg-white/40 border-b-4 border-purple-600 shadow-lg'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-white/30'
                    }`}
                  >
                    <Heart className="h-6 w-6 inline mr-3" />
                    Soul Story
                  </button>
                </div>

                {/* Enhanced Chat Content */}
                {activeTab === 'chat' && (
                  <>
                    {/* 🤖 Enhanced Messages with Voice Support */}
                    <div className="flex-1 p-8 overflow-y-auto">
                      <div className="space-y-8">
                        {chatHistory.map((chat, index) => (
                          <div key={chat.id}>
                            {chat.isVoiceMessage ? (
                              <VoiceMessageBubble
                                message={{
                                  id: chat.id,
                                  type: chat.type,
                                  audioUrl: chat.audioUrl!,
                                  duration: chat.duration || 0,
                                  timestamp: chat.timestamp
                                }}
                                isUser={chat.type === 'user'}
                                petName={pet.name}
                              />
                            ) : (
                              <div
                                className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className={`max-w-xs lg:max-w-md px-8 py-6 rounded-3xl shadow-xl backdrop-blur-sm border transition-all duration-500 hover:scale-105 relative ${
                                  chat.type === 'user'
                                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white border-white/30'
                                    : 'bg-white/80 text-gray-800 border-white/40'
                                }`}>
                                  {chat.heartLevel && (
                                    <div className={`absolute -top-2 -right-2 ${getHeartLevelColor(chat.heartLevel)}`}>
                                      <Heart className="h-6 w-6 fill-current animate-pulse" />
                                    </div>
                                  )}
                                  
                                  {/* 🤖 AI Response Indicator */}
                                  {chat.type === 'pet' && (
                                    <div className="absolute -top-2 -left-2">
                                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                        <Bot className="h-3 w-3 text-white" />
                                      </div>
                                    </div>
                                  )}
                                  
                                  <p className="leading-relaxed text-lg">{chat.message}</p>
                                  <div className={`text-sm mt-3 ${
                                    chat.type === 'user' ? 'text-purple-100' : 'text-gray-500'
                                  }`}>
                                    {chat.time}
                                    {chat.emotion && (
                                      <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                                        {getMoodEmoji(chat.emotion)} {chat.emotion}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {/* 🤖 Typing Indicator */}
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="max-w-xs lg:max-w-md px-8 py-6 rounded-3xl shadow-xl backdrop-blur-sm border bg-white/80 text-gray-800 border-white/40">
                              <div className="flex items-center space-x-2">
                                <Bot className="h-5 w-5 text-blue-600 animate-pulse" />
                                <span className="text-gray-600">{pet.name} is thinking</span>
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 🎤 Enhanced Message Input with Voice Support - NO ERROR POPUPS */}
                    <div className="p-8 border-t border-white/30">
                      <div className="flex items-end space-x-4">
                        <div className="flex-1">
                          <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={`Pour your heart out to ${pet.name}... 💕✨`}
                            rows={2}
                            disabled={isSendingMessage}
                            className="w-full px-8 py-6 backdrop-blur-sm bg-white/95 border-2 border-white/60 rounded-3xl focus:ring-4 focus:ring-purple-500/25 focus:border-purple-400 resize-none shadow-lg text-lg text-gray-900 placeholder-gray-500 disabled:opacity-50 font-medium"
                            style={{
                              color: '#1f2937',
                              backgroundColor: 'rgba(255, 255, 255, 0.95)'
                            }}
                          />
                        </div>
                        
                        <div className="flex space-x-3">
                          {/* 🎤 Voice Message Button - NO ERROR POPUPS */}
                          {voiceSupported && (
                            <button
                              onClick={handleStartVoiceRecording}
                              disabled={isSendingMessage || isRecording}
                              className="p-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-3xl hover:shadow-2xl hover:shadow-green-500/25 transition-all duration-500 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Send voice message"
                            >
                              {isRecording ? (
                                <MicOff className="h-6 w-6" />
                              ) : (
                                <Mic className="h-6 w-6" />
                              )}
                            </button>
                          )}
                          
                          {/* Text Message Button */}
                          <button
                            onClick={handleSendTextMessage}
                            disabled={!message.trim() || isSendingMessage}
                            className="p-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-3xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSendingMessage ? (
                              <Loader className="h-6 w-6 animate-spin" />
                            ) : (
                              <Send className="h-6 w-6" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {/* 🤖 Enhanced API Status Indicator */}
                      <div className="mt-4 text-center">
                        <div className="inline-flex items-center px-4 py-2 bg-blue-100/60 backdrop-blur-sm rounded-full text-sm">
                          <Bot className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="text-blue-700 font-medium">
                            Text: Soul Pet AI • Voice: Fallback System
                          </span>
                          {voiceSupported && (
                            <>
                              <span className="mx-2 text-blue-400">•</span>
                              <Mic className="h-4 w-4 mr-1 text-green-600" />
                              <span className="text-green-700 font-medium">Voice Ready</span>
                            </>
                          )}
                          <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Enhanced Activity Tab */}
                {activeTab === 'activity' && (
                  <div className="flex-1 p-8 overflow-y-auto">
                    <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                      <Sparkles className="h-8 w-8 mr-3 text-purple-500 animate-pulse" />
                      Your Sacred Love Journey with {pet.name}
                    </h3>
                    <div className="space-y-6">
                      {soulActivities.map((activity, index) => {
                        const Icon = activity.icon;
                        return (
                          <div key={index} className="group flex items-start space-x-6 p-8 backdrop-blur-sm bg-white/60 rounded-3xl border border-white/40 hover:bg-white/80 transition-all duration-500 hover:scale-105 shadow-xl">
                            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl ${
                              activity.type === 'feeding' ? 'bg-gradient-to-r from-green-400 to-emerald-400' :
                              activity.type === 'petting' ? 'bg-gradient-to-r from-pink-400 to-red-400' :
                              activity.type === 'level' ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                              activity.type === 'creation' ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
                              'bg-gradient-to-r from-blue-400 to-cyan-400'
                            } group-hover:rotate-12 transition-transform duration-500`}>
                              <Icon className="h-8 w-8 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-800 font-semibold leading-relaxed text-lg mb-2">{activity.description}</p>
                              <p className="text-purple-600 italic text-sm mb-3">{activity.emotionalImpact}</p>
                              <div className="flex items-center justify-between">
                                <p className="text-gray-500 text-sm">{activity.time}</p>
                                <div className="flex items-center text-yellow-600 font-bold text-lg">
                                  <Coins className="h-5 w-5 mr-2" />
                                  +{activity.coins}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Enhanced Info Tab */}
                {activeTab === 'info' && (
                  <div className="flex-1 p-8 overflow-y-auto">
                    <div className="space-y-8">
                      <div className="backdrop-blur-sm bg-white/60 p-8 rounded-3xl border border-white/40 shadow-xl">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                          <Sparkles className="h-8 w-8 mr-3 text-purple-500 animate-pulse" />
                          {pet.name}'s Sacred Soul Story
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-xl">{pet.backstory}</p>
                      </div>
                      
                      <div className="backdrop-blur-sm bg-white/60 p-8 rounded-3xl border border-white/40 shadow-xl">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Divine Heart Traits</h3>
                        <div className="flex flex-wrap gap-4">
                          <span className="px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-3xl text-lg font-semibold border border-white/40 shadow-lg hover:scale-105 transition-transform duration-300">
                            ✨ {pet.personality}
                          </span>
                          <span className="px-6 py-3 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-3xl text-lg font-semibold border border-white/40 shadow-lg hover:scale-105 transition-transform duration-300">
                            🎵 {pet.voice} Voice
                          </span>
                          <span className="px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-3xl text-lg font-semibold border border-white/40 shadow-lg hover:scale-105 transition-transform duration-300">
                            🌟 Level {pet.level}
                          </span>
                          <span className="px-6 py-3 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 rounded-3xl text-lg font-semibold border border-white/40 shadow-lg hover:scale-105 transition-transform duration-300">
                            👑 {pet.outfit}
                          </span>
                        </div>
                      </div>
                      
                      <div className="backdrop-blur-sm bg-white/60 p-8 rounded-3xl border border-white/40 shadow-xl">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Sacred Love Statistics</h3>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="p-6 bg-gradient-to-r from-pink-100 to-red-100 rounded-3xl border border-white/40 shadow-lg">
                            <div className="text-3xl font-bold text-gray-800">{chatHistory.filter(msg => msg.type === 'user').length}</div>
                            <div className="text-gray-600">Soul Conversations</div>
                          </div>
                          <div className="p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-3xl border border-white/40 shadow-lg">
                            <div className="text-3xl font-bold text-gray-800">{pet.coinsEarned}</div>
                            <div className="text-gray-600">Cuddle Coins Earned</div>
                          </div>
                          <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl border border-white/40 shadow-lg">
                            <div className="text-3xl font-bold text-gray-800">{pet.emotionalBond}%</div>
                            <div className="text-gray-600">Emotional Bond</div>
                          </div>
                          <div className="p-6 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-3xl border border-white/40 shadow-lg">
                            <div className="text-3xl font-bold text-gray-800">
                              {Math.floor((Date.now() - new Date(pet.createdDate).getTime()) / (1000 * 60 * 60 * 24)) + 1}
                            </div>
                            <div className="text-gray-600">Days Together</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetProfile;