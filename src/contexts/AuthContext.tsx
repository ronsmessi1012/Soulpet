import React, { createContext, useContext, useState, useEffect } from 'react';

interface Pet {
  id: string;
  name: string;
  type: string;
  personality: string;
  voice: string;
  appearance: string;
  backstory: string;
  image: string;
  createdDate: string;
  level: number;
  happiness: number;
  energy: number;
  hunger: number;
  affection: number;
  mood: string;
  moodAura: string;
  outfit: string;
  coinsEarned: number;
  totalChats: number;
  lastFed: string;
  lastPetted: string;
  emotionalBond: number;
  status: string;
  lastFeedTime: number;
  lastPetTime: number;
  lastDecayTime: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  joinDate: string;
  totalPets: number;
  cuddleCoins: number;
  level: number;
  isNewUser: boolean;
  pets: Pet[];
  // Force re-render fields
  coinUpdateId: number;
  lastUpdate: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  coinUpdateTrigger: number;
  currentCoins: number;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
  createPet: (petData: any) => void;
  updateCuddleCoins: (amount: number) => void;
  updatePetStats: (petId: string, updates: any) => void;
  boostAllPets: () => void; // NEW: Function to boost all pets at once
  canFeedPet: (petId: string) => boolean;
  canPetPet: (petId: string) => boolean;
  getFeedCooldownTime: (petId: string) => string | null;
  getPetCooldownTime: (petId: string) => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to generate pet image based on type
const getPetImage = (type: string) => {
  const imageMap = {
    'dog': 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
    'cat': 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400',
    'dragon': 'https://images.pexels.com/photos/2835436/pexels-photo-2835436.jpeg?auto=compress&cs=tinysrgb&w=400',
    'unicorn': 'https://images.pexels.com/photos/1996333/pexels-photo-1996333.jpeg?auto=compress&cs=tinysrgb&w=400',
    'phoenix': 'https://images.pexels.com/photos/1591939/pexels-photo-1591939.jpeg?auto=compress&cs=tinysrgb&w=400',
    'custom': 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400'
  };
  return imageMap[type.toLowerCase()] || imageMap['custom'];
};

// Helper function to get mood aura based on personality
const getMoodAura = (personality: string) => {
  const auraMap = {
    'playful': 'from-yellow-300/40 via-orange-200/30 to-pink-300/40',
    'wise': 'from-blue-300/40 via-indigo-200/30 to-purple-300/40',
    'mischievous': 'from-purple-300/40 via-pink-200/30 to-rose-300/40',
    'gentle': 'from-green-300/40 via-emerald-200/30 to-teal-300/40',
    'brave': 'from-red-300/40 via-orange-200/30 to-yellow-300/40',
    'quirky': 'from-indigo-300/40 via-purple-200/30 to-pink-300/40'
  };
  return auraMap[personality.toLowerCase()] || auraMap['playful'];
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [coinUpdateTrigger, setCoinUpdateTrigger] = useState(0);
  const [currentCoins, setCurrentCoins] = useState(0);

  // Pet stat decay system
  const decayPetStats = (pets: Pet[]) => {
    const now = Date.now();
    const DECAY_INTERVAL = 30 * 60 * 1000; // 30 minutes
    const DECAY_AMOUNT = 5; // Amount to decrease per interval

    return pets.map(pet => {
      const timeSinceLastDecay = now - (pet.lastDecayTime || now);
      
      if (timeSinceLastDecay >= DECAY_INTERVAL) {
        const intervalsElapsed = Math.floor(timeSinceLastDecay / DECAY_INTERVAL);
        const totalDecay = intervalsElapsed * DECAY_AMOUNT;
        
        return {
          ...pet,
          happiness: Math.max(0, pet.happiness - totalDecay),
          hunger: Math.max(0, pet.hunger - totalDecay),
          affection: Math.max(0, pet.affection - totalDecay),
          lastDecayTime: now,
          mood: pet.happiness - totalDecay < 30 ? 'sad' : 
                pet.hunger - totalDecay < 30 ? 'hungry' : 
                pet.affection - totalDecay < 30 ? 'lonely' : pet.mood
        };
      }
      
      return pet;
    });
  };

  const canFeedPet = (petId: string) => {
    if (!user?.pets) return false;
    const pet = user.pets.find(p => p.id === petId);
    if (!pet) return false;
    
    const now = Date.now();
    const FEED_COOLDOWN = 8 * 60 * 60 * 1000; // 8 hours
    const timeSinceLastFeed = now - (pet.lastFeedTime || 0);
    
    return timeSinceLastFeed >= FEED_COOLDOWN;
  };

  const canPetPet = (petId: string) => {
    if (!user?.pets) return false;
    const pet = user.pets.find(p => p.id === petId);
    if (!pet) return false;
    
    const now = Date.now();
    const PET_COOLDOWN = 8 * 60 * 60 * 1000; // 8 hours
    const timeSinceLastPet = now - (pet.lastPetTime || 0);
    
    return timeSinceLastPet >= PET_COOLDOWN;
  };

  const getFeedCooldownTime = (petId: string) => {
    if (!user?.pets) return null;
    const pet = user.pets.find(p => p.id === petId);
    if (!pet || !pet.lastFeedTime) return null;
    
    const now = Date.now();
    const FEED_COOLDOWN = 8 * 60 * 60 * 1000; // 8 hours
    const timeUntilNext = FEED_COOLDOWN - (now - pet.lastFeedTime);
    
    if (timeUntilNext <= 0) return null;
    
    const hours = Math.floor(timeUntilNext / (60 * 60 * 1000));
    const minutes = Math.floor((timeUntilNext % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours}h ${minutes}m`;
  };

  const getPetCooldownTime = (petId: string) => {
    if (!user?.pets) return null;
    const pet = user.pets.find(p => p.id === petId);
    if (!pet || !pet.lastPetTime) return null;
    
    const now = Date.now();
    const PET_COOLDOWN = 8 * 60 * 60 * 1000; // 8 hours
    const timeUntilNext = PET_COOLDOWN - (now - pet.lastPetTime);
    
    if (timeUntilNext <= 0) return null;
    
    const hours = Math.floor(timeUntilNext / (60 * 60 * 1000));
    const minutes = Math.floor((timeUntilNext % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('soulPetUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      // Ensure pets array exists for backward compatibility
      if (!userData.pets) {
        userData.pets = [];
      }
      
      // Apply stat decay to pets
      userData.pets = decayPetStats(userData.pets);
      
      // Add force re-render fields if missing
      if (!userData.coinUpdateId) userData.coinUpdateId = 0;
      if (!userData.lastUpdate) userData.lastUpdate = Date.now();
      
      setUser(userData);
      setCurrentCoins(userData.cuddleCoins || 0);
      localStorage.setItem('soulPetUser', JSON.stringify(userData));
    }
    setIsLoading(false);
  }, []);

  // Sync currentCoins with user.cuddleCoins
  useEffect(() => {
    if (user) {
      setCurrentCoins(user.cuddleCoins);
    }
  }, [user?.cuddleCoins, user?.coinUpdateId]);

  // Periodic stat decay
  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.pets && user.pets.length > 0) {
        const updatedPets = decayPetStats(user.pets);
        const updatedUser = { 
          ...user, 
          pets: updatedPets,
          lastUpdate: Date.now()
        };
        setUser(updatedUser);
        localStorage.setItem('soulPetUser', JSON.stringify(updatedUser));
      }
    }, 30 * 60 * 1000); // Check every 30 minutes

    return () => clearInterval(interval);
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock existing user data with some pets - SET COOLDOWN TIMES TO TEST
    const existingUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      joinDate: '2024-01-15',
      totalPets: 2,
      cuddleCoins: 11247,
      level: 15,
      isNewUser: false,
      coinUpdateId: 0,
      lastUpdate: Date.now(),
      pets: [
        {
          id: '1',
          name: 'Fluffy',
          type: 'Cat',
          personality: 'Mischievous',
          voice: 'Cute & Sweet',
          appearance: 'A beautiful orange tabby with bright green eyes',
          backstory: 'Found as a kitten in a magical forest where she learned to speak with ancient trees.',
          image: getPetImage('cat'),
          createdDate: '2024-01-15',
          level: 15,
          happiness: 92,
          energy: 88,
          hunger: 65,
          affection: 88,
          mood: 'happy',
          moodAura: getMoodAura('mischievous'),
          outfit: 'Rainbow Collar',
          coinsEarned: 156,
          totalChats: 1247,
          lastFed: '3 hours ago',
          lastPetted: '1 hour ago',
          emotionalBond: 95,
          status: 'online',
          lastFeedTime: Date.now() - (3 * 60 * 60 * 1000), // 3 hours ago - CAN FEED
          lastPetTime: Date.now() - (1 * 60 * 60 * 1000), // 1 hour ago - CANNOT PET (7h remaining)
          lastDecayTime: Date.now()
        },
        {
          id: '2',
          name: 'Draco',
          type: 'Dragon',
          personality: 'Wise',
          voice: 'Deep & Wise',
          appearance: 'A majestic blue dragon with silver scales and ancient eyes',
          backstory: 'An ancient dragon who has seen the rise and fall of civilizations.',
          image: getPetImage('dragon'),
          createdDate: '2024-01-20',
          level: 12,
          happiness: 88,
          energy: 95,
          hunger: 70,
          affection: 88,
          mood: 'wise',
          moodAura: getMoodAura('wise'),
          outfit: 'Golden Crown',
          coinsEarned: 234,
          totalChats: 892,
          lastFed: '1 hour ago',
          lastPetted: '30 minutes ago',
          emotionalBond: 90,
          status: 'online',
          lastFeedTime: Date.now() - (9 * 60 * 60 * 1000), // 9 hours ago - CAN FEED
          lastPetTime: Date.now() - (9 * 60 * 60 * 1000), // 9 hours ago - CAN PET
          lastDecayTime: Date.now()
        }
      ]
    };
    
    setUser(existingUser);
    setCurrentCoins(existingUser.cuddleCoins);
    localStorage.setItem('soulPetUser', JSON.stringify(existingUser));
    setIsLoading(false);
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock new user data - starts with 10,000 cuddle coins as welcome bonus!
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      joinDate: new Date().toISOString().split('T')[0],
      totalPets: 0,
      cuddleCoins: 10000, // 🎉 Welcome bonus: 10,000 coins for new users!
      level: 1,
      isNewUser: true,
      coinUpdateId: 0,
      lastUpdate: Date.now(),
      pets: [] // New users start with no pets
    };
    
    setUser(newUser);
    setCurrentCoins(newUser.cuddleCoins);
    localStorage.setItem('soulPetUser', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setCurrentCoins(0);
    localStorage.removeItem('soulPetUser');
    setCoinUpdateTrigger(0);
  };

  const completeOnboarding = () => {
    if (user) {
      const updatedUser = { 
        ...user, 
        isNewUser: false,
        lastUpdate: Date.now()
      };
      setUser(updatedUser);
      localStorage.setItem('soulPetUser', JSON.stringify(updatedUser));
    }
  };

  const createPet = (petData: any) => {
    if (user) {
      const now = Date.now();
      // Create new pet object
      const newPet: Pet = {
        id: Date.now().toString(),
        name: petData.name || 'Unnamed Pet',
        type: petData.type || 'custom',
        personality: petData.personality || 'playful',
        voice: petData.voice || 'cute',
        appearance: petData.appearance || 'A beautiful and unique companion',
        backstory: petData.backstory || 'A wonderful soul waiting to share love and joy.',
        image: getPetImage(petData.type || 'custom'),
        createdDate: new Date().toISOString().split('T')[0],
        level: 1,
        happiness: 100,
        energy: 100,
        hunger: 80,
        affection: 50,
        mood: 'excited',
        moodAura: getMoodAura(petData.personality || 'playful'),
        outfit: 'Basic Collar',
        coinsEarned: 0,
        totalChats: 0,
        lastFed: 'Never',
        lastPetted: 'Never',
        emotionalBond: 25,
        status: 'online',
        lastFeedTime: 0,
        lastPetTime: 0,
        lastDecayTime: now
      };

      const newCoinAmount = user.cuddleCoins - 10000 + 15; // Net: -9,985 coins
      const updatedUser = { 
        ...user, 
        totalPets: user.totalPets + 1,
        cuddleCoins: newCoinAmount,
        level: Math.floor((user.totalPets + 1) / 2) + 1, // Level up every 2 pets
        pets: [...user.pets, newPet], // Add new pet to user's pets array
        coinUpdateId: user.coinUpdateId + 1,
        lastUpdate: Date.now()
      };
      
      setUser(updatedUser);
      setCurrentCoins(newCoinAmount);
      localStorage.setItem('soulPetUser', JSON.stringify(updatedUser));
      setCoinUpdateTrigger(prev => prev + 1);
    }
  };

  // ULTIMATE COIN UPDATE FUNCTION
  const updateCuddleCoins = (amount: number) => {
    console.log('🪙 ULTIMATE COIN UPDATE START:', {
      currentUser: !!user,
      currentCoins: user?.cuddleCoins,
      currentCoinsState: currentCoins,
      changeAmount: amount,
      timestamp: new Date().toISOString()
    });

    if (!user) {
      console.error('❌ NO USER FOUND');
      return;
    }

    const newCoinAmount = Math.max(0, user.cuddleCoins + amount);
    const newCoinUpdateId = user.coinUpdateId + 1;
    const newTimestamp = Date.now();

    console.log('🔄 CREATING NEW USER OBJECT:', {
      oldCoins: user.cuddleCoins,
      newCoins: newCoinAmount,
      oldUpdateId: user.coinUpdateId,
      newUpdateId: newCoinUpdateId
    });

    // Create completely new user object
    const updatedUser: User = {
      ...user,
      cuddleCoins: newCoinAmount,
      coinUpdateId: newCoinUpdateId,
      lastUpdate: newTimestamp
    };

    console.log('💾 UPDATING ALL STATES');
    
    // Update React state
    setUser(updatedUser);
    
    // Update separate coin state IMMEDIATELY
    setCurrentCoins(newCoinAmount);
    
    // Update localStorage
    localStorage.setItem('soulPetUser', JSON.stringify(updatedUser));
    
    // Force re-render trigger
    setCoinUpdateTrigger(prev => {
      const newTrigger = prev + 1;
      console.log('🔄 TRIGGER UPDATE:', prev, '->', newTrigger);
      return newTrigger;
    });

    console.log('✅ ULTIMATE COIN UPDATE COMPLETE:', {
      finalCoins: updatedUser.cuddleCoins,
      finalCoinsState: newCoinAmount,
      updateId: updatedUser.coinUpdateId,
      triggerValue: coinUpdateTrigger + 1
    });

    // Force immediate re-render by updating state again
    setTimeout(() => {
      console.log('🔄 FORCE REFRESH');
      setCurrentCoins(newCoinAmount);
      setCoinUpdateTrigger(prev => prev + 1);
    }, 10);
  };

  // SINGLE PET STATS UPDATE FUNCTION
  const updatePetStats = (petId: string, updates: any) => {
    console.log('🐾 SINGLE PET STATS UPDATE START:', {
      petId,
      updates,
      currentUser: !!user,
      totalPets: user?.pets?.length || 0,
      timestamp: new Date().toISOString()
    });

    if (!user || !user.pets) {
      console.error('❌ NO USER OR PETS FOUND');
      return;
    }

    const now = Date.now();
    
    console.log('🔄 UPDATING SINGLE PET STATS...');
    
    // Create new pets array with updated stats
    const updatedPets = user.pets.map(pet => {
      if (pet.id === petId) {
        console.log(`✨ Updating pet: ${pet.name} (${pet.id})`);
        
        const updatedPet = { 
          ...pet, 
          ...updates,
          lastUpdate: now // Add timestamp to force re-render
        };
        
        // Update cooldown times if feeding or petting
        if (updates.lastFed === 'Just now') {
          updatedPet.lastFeedTime = now;
        }
        if (updates.lastPetted === 'Just now') {
          updatedPet.lastPetTime = now;
        }
        
        console.log(`✅ Pet ${pet.name} updated:`, {
          oldStats: {
            affection: pet.affection,
            hunger: pet.hunger,
            happiness: pet.happiness,
            energy: pet.energy,
            mood: pet.mood
          },
          newStats: {
            affection: updatedPet.affection,
            hunger: updatedPet.hunger,
            happiness: updatedPet.happiness,
            energy: updatedPet.energy,
            mood: updatedPet.mood
          }
        });
        
        return updatedPet;
      }
      return pet;
    });
    
    // Create completely new user object
    const updatedUser: User = {
      ...user,
      pets: updatedPets,
      lastUpdate: now,
      coinUpdateId: user.coinUpdateId + 1 // Force re-render
    };
    
    console.log('💾 SAVING UPDATED USER WITH NEW PET STATS');
    
    // Update React state
    setUser(updatedUser);
    
    // Update localStorage
    localStorage.setItem('soulPetUser', JSON.stringify(updatedUser));
    
    // Force re-render trigger
    setCoinUpdateTrigger(prev => {
      const newTrigger = prev + 1;
      console.log('🔄 PET STATS TRIGGER UPDATE:', prev, '->', newTrigger);
      return newTrigger;
    });
    
    console.log('✅ SINGLE PET STATS UPDATE COMPLETE');
    
    // Force immediate re-render
    setTimeout(() => {
      console.log('🔄 FORCE PET STATS REFRESH');
      setCoinUpdateTrigger(prev => prev + 1);
    }, 10);
  };

  // 🌟 NEW: BOOST ALL PETS FUNCTION - THE ULTIMATE SOLUTION! 🌟
  const boostAllPets = () => {
    console.log('🚀 ULTIMATE BOOST ALL PETS START:', {
      currentUser: !!user,
      totalPets: user?.pets?.length || 0,
      timestamp: new Date().toISOString()
    });

    if (!user || !user.pets || user.pets.length === 0) {
      console.error('❌ NO USER OR PETS FOUND FOR BOOSTING');
      return;
    }

    const now = Date.now();
    
    console.log(`🌟 BOOSTING ALL ${user.pets.length} SOUL COMPANIONS TO MAXIMUM POWER!`);
    
    // Create new pets array with ALL pets boosted to maximum stats
    const boostedPets = user.pets.map((pet, index) => {
      console.log(`✨ Boosting pet ${index + 1}/${user.pets.length}: ${pet.name} (${pet.id})`);
      
      const boostedPet = { 
        ...pet,
        // 🌟 MAXIMUM STATS FOR ALL PETS! 🌟
        affection: 100,        // Full love and bonding
        hunger: 100,           // Completely nourished
        happiness: 100,        // Pure joy and bliss
        energy: 100,           // Maximum vitality
        
        // 🎭 ENHANCED MOOD AND BONDING 🎭
        mood: 'transcendent',  // Beyond normal happiness
        emotionalBond: Math.min(100, pet.emotionalBond + 10), // Stronger bond
        
        // 🎁 BONUS REWARDS 🎁
        coinsEarned: pet.coinsEarned + 50, // Bonus coins for each pet
        
        // 📅 UPDATE TIMESTAMPS 📅
        lastFed: 'Just blessed with magical nourishment',
        lastPetted: 'Just received divine love',
        
        // 🌟 SPECIAL STATUS 🌟
        status: 'blessed',     // Special blessed status
        lastUpdate: now        // Force re-render timestamp
      };
      
      console.log(`✅ Pet ${pet.name} BOOSTED:`, {
        oldStats: {
          affection: pet.affection,
          hunger: pet.hunger,
          happiness: pet.happiness,
          energy: pet.energy,
          mood: pet.mood,
          emotionalBond: pet.emotionalBond
        },
        newStats: {
          affection: boostedPet.affection,
          hunger: boostedPet.hunger,
          happiness: boostedPet.happiness,
          energy: boostedPet.energy,
          mood: boostedPet.mood,
          emotionalBond: boostedPet.emotionalBond
        }
      });
      
      return boostedPet;
    });
    
    // Create completely new user object with all boosted pets
    const updatedUser: User = {
      ...user,
      pets: boostedPets,
      lastUpdate: now,
      coinUpdateId: user.coinUpdateId + 1 // Force re-render
    };
    
    console.log('💾 SAVING USER WITH ALL BOOSTED PETS');
    
    // Update React state
    setUser(updatedUser);
    
    // Update localStorage
    localStorage.setItem('soulPetUser', JSON.stringify(updatedUser));
    
    // Force re-render trigger
    setCoinUpdateTrigger(prev => {
      const newTrigger = prev + 1;
      console.log('🔄 ALL PETS BOOST TRIGGER UPDATE:', prev, '->', newTrigger);
      return newTrigger;
    });
    
    console.log('🎉 ALL PETS HAVE BEEN BLESSED WITH MAXIMUM POWER!');
    
    // Force immediate re-render
    setTimeout(() => {
      console.log('🔄 FORCE ALL PETS BOOST REFRESH');
      setCoinUpdateTrigger(prev => prev + 1);
    }, 10);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    coinUpdateTrigger,
    currentCoins,
    login,
    register,
    logout,
    completeOnboarding,
    createPet,
    updateCuddleCoins,
    updatePetStats,
    boostAllPets, // NEW: Export the boost all pets function
    canFeedPet,
    canPetPet,
    getFeedCooldownTime,
    getPetCooldownTime
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};