import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Video, 
  Heart, 
  Users, 
  Sparkles,
  MessageCircle,
  Star,
  Crown,
  Zap,
  Globe,
  Camera,
  Mic,
  Phone,
  Calendar,
  Clock,
  Gift,
  Award,
  TrendingUp,
  UserPlus,
  Settings,
  Volume2,
  Headphones,
  Monitor,
  Wifi,
  Shield,
  Lock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ConnectAllHearts = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('group-call');
  const [isInCall, setIsInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectedPets, setConnectedPets] = useState([]);
  const [globalStats, setGlobalStats] = useState({
    activeUsers: 12847,
    ongoingCalls: 3421,
    heartsShared: 2847291,
    storiesExchanged: 15632
  });

  // Mock data for connected pets and users
  const mockConnectedPets = [
    {
      id: 1,
      name: 'Luna',
      type: 'Unicorn',
      owner: 'StarKeeper',
      mood: 'excited',
      status: 'speaking',
      avatar: 'https://images.pexels.com/photos/1996333/pexels-photo-1996333.jpeg?auto=compress&cs=tinysrgb&w=200',
      level: 25,
      country: 'Mystical Realm'
    },
    {
      id: 2,
      name: 'Blaze',
      type: 'Dragon',
      owner: 'FireMaster',
      mood: 'wise',
      status: 'listening',
      avatar: 'https://images.pexels.com/photos/2835436/pexels-photo-2835436.jpeg?auto=compress&cs=tinysrgb&w=200',
      level: 42,
      country: 'Dragon Valley'
    },
    {
      id: 3,
      name: 'Whiskers',
      type: 'Cat',
      owner: 'CatLover',
      mood: 'playful',
      status: 'muted',
      avatar: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=200',
      level: 18,
      country: 'Cozy Corner'
    },
    {
      id: 4,
      name: 'Buddy',
      type: 'Dog',
      owner: 'DogParent',
      mood: 'happy',
      status: 'speaking',
      avatar: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=200',
      level: 33,
      country: 'Sunny Meadows'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Global Pet Talent Show',
      time: '2:00 PM Today',
      participants: 1247,
      type: 'talent-show',
      description: 'Watch pets showcase their amazing talents from around the world!'
    },
    {
      id: 2,
      title: 'Meditation Circle with Dragons',
      time: '6:00 PM Today',
      participants: 342,
      type: 'meditation',
      description: 'Join wise dragons for a peaceful meditation session'
    },
    {
      id: 3,
      title: 'Unicorn Storytelling Hour',
      time: '8:00 PM Today',
      participants: 856,
      type: 'storytelling',
      description: 'Magical stories shared by unicorns from the enchanted forest'
    },
    {
      id: 4,
      title: 'Weekend Pet Parade',
      time: 'Tomorrow 10:00 AM',
      participants: 2341,
      type: 'parade',
      description: 'The biggest virtual pet parade of the month!'
    }
  ];

  const callFeatures = [
    {
      icon: Video,
      title: 'HD Video Calls',
      description: 'Crystal clear video quality with your pets and friends',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Mic,
      title: 'AI Voice Synthesis',
      description: 'Hear your pets speak with realistic AI-generated voices',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Group Conversations',
      description: 'Connect up to 50 pets and owners in one magical call',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Meet pet lovers from around the world instantly',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Heart,
      title: 'Emotion Sharing',
      description: 'Share and feel emotions through advanced AI empathy',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Sparkles,
      title: 'Magic Effects',
      description: 'Add magical visual effects and filters to your calls',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  useEffect(() => {
    if (isInCall) {
      setConnectedPets(mockConnectedPets);
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setConnectedPets([]);
      setCallDuration(0);
    }
  }, [isInCall]);

  useEffect(() => {
    // Simulate real-time stats updates
    const interval = setInterval(() => {
      setGlobalStats(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        ongoingCalls: prev.ongoingCalls + Math.floor(Math.random() * 6) - 3,
        heartsShared: prev.heartsShared + Math.floor(Math.random() * 50),
        storiesExchanged: prev.storiesExchanged + Math.floor(Math.random() * 5)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'excited': return '🤩';
      case 'wise': return '🧙‍♂️';
      case 'playful': return '😸';
      case 'happy': return '😊';
      default: return '😊';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'speaking': return 'border-green-500 shadow-green-500/50';
      case 'listening': return 'border-blue-500 shadow-blue-500/50';
      case 'muted': return 'border-gray-400 shadow-gray-400/50';
      default: return 'border-gray-400';
    }
  };

  const startGroupCall = () => {
    setIsInCall(true);
  };

  const endCall = () => {
    setIsInCall(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-pink-50/80 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-32 h-32 bg-gradient-to-r from-pink-200/30 to-rose-200/30 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-40 left-1/3 w-48 h-48 bg-gradient-to-r from-purple-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 flex items-center">
                <Video className="h-12 w-12 mr-4 text-blue-600 animate-pulse" />
                Connect All Hearts
                <Heart className="h-10 w-10 ml-4 text-pink-500 animate-bounce" />
              </h1>
              <p className="text-xl text-gray-700">Join the global community of pet lovers in magical video calls and shared experiences! 🌍💕</p>
            </div>
          </div>

          {/* Global Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="backdrop-blur-2xl bg-white/30 border border-white/30 p-6 rounded-3xl shadow-2xl text-center">
              <Users className="h-8 w-8 mx-auto mb-3 text-blue-600 animate-pulse" />
              <div className="text-3xl font-bold text-gray-800">{globalStats.activeUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="backdrop-blur-2xl bg-white/30 border border-white/30 p-6 rounded-3xl shadow-2xl text-center">
              <Video className="h-8 w-8 mx-auto mb-3 text-purple-600 animate-bounce" />
              <div className="text-3xl font-bold text-gray-800">{globalStats.ongoingCalls.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Ongoing Calls</div>
            </div>
            <div className="backdrop-blur-2xl bg-white/30 border border-white/30 p-6 rounded-3xl shadow-2xl text-center">
              <Heart className="h-8 w-8 mx-auto mb-3 text-pink-600 animate-pulse" />
              <div className="text-3xl font-bold text-gray-800">{globalStats.heartsShared.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Hearts Shared</div>
            </div>
            <div className="backdrop-blur-2xl bg-white/30 border border-white/30 p-6 rounded-3xl shadow-2xl text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-3 text-green-600 animate-bounce" />
              <div className="text-3xl font-bold text-gray-800">{globalStats.storiesExchanged.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Stories Shared</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Call Interface */}
            <div className="lg:col-span-2">
              <div className="backdrop-blur-2xl bg-white/30 border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
                {/* Call Header */}
                <div className="p-6 border-b border-white/30 bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <Globe className="h-6 w-6 mr-3 text-blue-600" />
                        Global Heart Connection
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {isInCall ? `Connected with ${connectedPets.length} souls` : 'Ready to connect hearts worldwide'}
                      </p>
                    </div>
                    {isInCall && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{formatDuration(callDuration)}</div>
                        <div className="text-sm text-gray-600">Call Duration</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Grid */}
                <div className="p-6">
                  {isInCall ? (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {connectedPets.map((pet) => (
                        <div
                          key={pet.id}
                          className={`relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden border-4 ${getStatusColor(pet.status)} shadow-2xl`}
                        >
                          <img
                            src={pet.avatar}
                            alt={pet.name}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Pet Info Overlay */}
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="backdrop-blur-sm bg-black/60 text-white p-3 rounded-xl">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-bold flex items-center">
                                    <span className="mr-2">{getMoodEmoji(pet.mood)}</span>
                                    {pet.name}
                                  </div>
                                  <div className="text-xs opacity-80">{pet.owner} • Level {pet.level}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs opacity-80">{pet.country}</div>
                                  <div className={`text-xs font-bold ${
                                    pet.status === 'speaking' ? 'text-green-400' :
                                    pet.status === 'listening' ? 'text-blue-400' : 'text-gray-400'
                                  }`}>
                                    {pet.status}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Speaking Indicator */}
                          {pet.status === 'speaking' && (
                            <div className="absolute top-4 right-4">
                              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6">
                      <div className="text-center">
                        <Video className="h-24 w-24 mx-auto mb-6 text-blue-500 animate-pulse" />
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Connect Hearts?</h3>
                        <p className="text-gray-600 mb-6">Join thousands of pet lovers in magical video calls</p>
                      </div>
                    </div>
                  )}

                  {/* Call Controls */}
                  <div className="flex items-center justify-center space-x-4">
                    {!isInCall ? (
                      <button
                        onClick={startGroupCall}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-12 py-4 rounded-3xl font-bold hover:shadow-2xl hover:shadow-green-500/25 transition-all duration-500 hover:scale-105 flex items-center text-xl"
                      >
                        <Video className="h-8 w-8 mr-3" />
                        Start Global Call
                      </button>
                    ) : (
                      <>
                        <button className="p-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors duration-300 hover:scale-110">
                          <Mic className="h-6 w-6" />
                        </button>
                        <button className="p-4 bg-purple-500 text-white rounded-2xl hover:bg-purple-600 transition-colors duration-300 hover:scale-110">
                          <Camera className="h-6 w-6" />
                        </button>
                        <button className="p-4 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 transition-colors duration-300 hover:scale-110">
                          <Settings className="h-6 w-6" />
                        </button>
                        <button
                          onClick={endCall}
                          className="p-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors duration-300 hover:scale-110"
                        >
                          <Phone className="h-6 w-6 rotate-135" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {callFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="backdrop-blur-2xl bg-white/80 border border-white/40 rounded-3xl shadow-2xl p-6 hover:scale-105 transition-all duration-500"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Upcoming Events */}
              <div className="backdrop-blur-2xl bg-white/30 border border-white/30 rounded-3xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Calendar className="h-6 w-6 mr-3 text-purple-600" />
                  Upcoming Events
                </h3>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="backdrop-blur-sm bg-white/60 border border-white/40 p-4 rounded-2xl hover:bg-white/80 transition-all duration-300 hover:scale-105 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-gray-800 text-lg">{event.title}</h4>
                        <div className="text-xs text-purple-600 font-medium bg-purple-100 px-2 py-1 rounded-full">
                          {event.type}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {event.time}
                        </div>
                        <div className="flex items-center text-sm text-blue-600 font-medium">
                          <Users className="h-4 w-4 mr-1" />
                          {event.participants.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="backdrop-blur-2xl bg-white/30 border border-white/30 rounded-3xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 px-6 rounded-2xl font-bold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-500 hover:scale-105 flex items-center justify-center">
                    <UserPlus className="h-5 w-5 mr-3" />
                    Invite Friends
                  </button>
                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-2xl font-bold hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105 flex items-center justify-center">
                    <Crown className="h-5 w-5 mr-3" />
                    Premium Features
                  </button>
                  <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-2xl font-bold hover:shadow-xl hover:shadow-green-500/25 transition-all duration-500 hover:scale-105 flex items-center justify-center">
                    <Gift className="h-5 w-5 mr-3" />
                    Send Hearts
                  </button>
                </div>
              </div>

              {/* Community Highlights */}
              <div className="backdrop-blur-2xl bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 border border-white/30 rounded-3xl shadow-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center">
                  <Award className="h-6 w-6 mr-3 text-yellow-600" />
                  Community Highlights
                </h3>
                <div className="space-y-4">
                  <div className="backdrop-blur-sm bg-white/60 p-4 rounded-2xl">
                    <div className="text-2xl font-bold text-purple-600">Pet of the Day</div>
                    <div className="text-lg text-gray-800">Luna the Unicorn</div>
                    <div className="text-sm text-gray-600">Spreading magic worldwide!</div>
                  </div>
                  <div className="backdrop-blur-sm bg-white/60 p-4 rounded-2xl">
                    <div className="text-2xl font-bold text-blue-600">Most Active</div>
                    <div className="text-lg text-gray-800">Dragon Valley</div>
                    <div className="text-sm text-gray-600">2,847 hearts shared today</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectAllHearts;