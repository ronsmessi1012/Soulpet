const CHATBOT_API_BASE = 'https://soulpet-chatbot-2.onrender.com';

export interface ChatMessage {
  id: string;
  type: 'user' | 'pet';
  message?: string;
  audioUrl?: string;
  isVoiceMessage?: boolean;
  duration?: number;
  time: string;
  emotion?: string;
  heartLevel?: string;
  timestamp: number;
}

export interface PetPersonality {
  name: string;
  type: string;
  personality: string;
  voice: string;
  backstory: string;
  mood: string;
  level: number;
  emotionalBond: number;
}

class ChatbotService {
  private chatHistory: Map<string, ChatMessage[]> = new Map();

  initializePetChat(petId: string, pet: PetPersonality): ChatMessage[] {
    if (!this.chatHistory.has(petId)) {
      const initialMessages: ChatMessage[] = [
        {
          id: `${petId}-welcome`,
          type: 'pet',
          message: `Hello! I'm ${pet.name}, your ${pet.type.toLowerCase()} companion! My heart is filled with joy to finally meet you! 😊💕✨`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          emotion: 'excited',
          heartLevel: 'high',
          timestamp: Date.now(),
          isVoiceMessage: false
        }
      ];
      this.chatHistory.set(petId, initialMessages);
      return initialMessages;
    }
    return this.chatHistory.get(petId) || [];
  }

  getChatHistory(petId: string): ChatMessage[] {
    return this.chatHistory.get(petId) || [];
  }

  // Send TEXT message to chatbot API
  async sendTextMessage(
    petId: string, 
    userMessage: string, 
    pet: PetPersonality
  ): Promise<ChatMessage[]> {
    try {
      console.log('💬 SENDING TEXT MESSAGE TO CHATBOT API:', {
        petId,
        userMessage,
        petName: pet.name,
        apiUrl: CHATBOT_API_BASE
      });

      const userChatMessage: ChatMessage = {
        id: `${petId}-user-${Date.now()}`,
        type: 'user',
        message: userMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        isVoiceMessage: false
      };

      const currentHistory = this.getChatHistory(petId);
      const updatedHistory = [...currentHistory, userChatMessage];
      this.chatHistory.set(petId, updatedHistory);

      const context = {
        petName: pet.name,
        petType: pet.type,
        personality: pet.personality,
        voice: pet.voice,
        backstory: pet.backstory,
        mood: pet.mood,
        level: pet.level,
        emotionalBond: pet.emotionalBond,
        chatHistory: currentHistory.slice(-5)
      };

      const response = await fetch(`${CHATBOT_API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          user_input: userMessage,
          context: context
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('💬 CHATBOT API RESPONSE:', data);

      const petResponse: ChatMessage = {
        id: `${petId}-pet-${Date.now()}`,
        type: 'pet',
        message: data.reply || "I'm having trouble connecting right now, but I'm still here with you! 💕",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: data.emotion || pet.mood,
        heartLevel: this.getHeartLevel(pet.emotionalBond),
        timestamp: Date.now(),
        isVoiceMessage: false
      };

      const finalHistory = [...updatedHistory, petResponse];
      this.chatHistory.set(petId, finalHistory);

      console.log('✅ TEXT CHAT UPDATED SUCCESSFULLY');
      return finalHistory;

    } catch (error) {
      console.error('❌ TEXT CHATBOT API ERROR:', error);
      return this.handleFallbackResponse(petId, userMessage, false);
    }
  }

  // Send VOICE message - now with improved fallback
  async sendVoiceMessage(
    petId: string, 
    audioBlob: Blob,
    pet: PetPersonality
  ): Promise<ChatMessage[]> {
    console.log('🎤 PROCESSING VOICE MESSAGE:', {
      petId,
      petName: pet.name,
      audioBlobSize: audioBlob.size
    });

    // Add user voice message to chat history
    const userAudioUrl = URL.createObjectURL(audioBlob);
    const userAudioDuration = await this.getAudioDuration(userAudioUrl);

    const userChatMessage: ChatMessage = {
      id: `${petId}-user-${Date.now()}`,
      type: 'user',
      audioUrl: userAudioUrl,
      duration: userAudioDuration,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      isVoiceMessage: true
    };

    const currentHistory = this.getChatHistory(petId);
    const updatedHistory = [...currentHistory, userChatMessage];
    this.chatHistory.set(petId, updatedHistory);

    try {
      // Send to voice backend (with fallback built-in)
      const { voiceService } = await import('./voiceService');
      const voiceType = voiceService.getVoiceType(pet.personality, pet.voice, pet.type);
      const petAudioUrl = await voiceService.sendVoiceMessage(audioBlob, voiceType);
      const petAudioDuration = await this.getAudioDuration(petAudioUrl);

      // Create pet voice response
      const petResponse: ChatMessage = {
        id: `${petId}-pet-${Date.now()}`,
        type: 'pet',
        audioUrl: petAudioUrl,
        duration: petAudioDuration,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: pet.mood,
        heartLevel: this.getHeartLevel(pet.emotionalBond),
        timestamp: Date.now(),
        isVoiceMessage: true
      };

      const finalHistory = [...updatedHistory, petResponse];
      this.chatHistory.set(petId, finalHistory);

      console.log('✅ VOICE CHAT UPDATED SUCCESSFULLY');
      return finalHistory;

    } catch (error) {
      console.log('⚠️ Voice processing completed with fallback');
      // The voiceService already handles fallback, so we just return the current history
      // with the user's voice message already added
      return updatedHistory;
    }
  }

  private async getAudioDuration(audioUrl: string): Promise<number> {
    return new Promise((resolve) => {
      const audio = new Audio(audioUrl);
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration || 10);
      });
      audio.addEventListener('error', () => {
        resolve(10); // Fallback duration
      });
      setTimeout(() => resolve(10), 3000); // Timeout fallback
    });
  }

  private async handleFallbackResponse(
    petId: string, 
    userMessage: string,
    isVoiceMessage: boolean,
    audioBlob?: Blob
  ): Promise<ChatMessage[]> {
    const fallbackUserMessage: ChatMessage = {
      id: `${petId}-user-${Date.now()}`,
      type: 'user',
      message: isVoiceMessage ? undefined : userMessage,
      audioUrl: isVoiceMessage && audioBlob ? URL.createObjectURL(audioBlob) : undefined,
      duration: isVoiceMessage && audioBlob ? await this.getAudioDuration(URL.createObjectURL(audioBlob)) : undefined,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      isVoiceMessage
    };

    const fallbackResponse: ChatMessage = {
      id: `${petId}-fallback-${Date.now()}`,
      type: 'pet',
      message: `I'm having a little trouble connecting to my thoughts right now, but I'm still here with you! Let's try again in a moment. 💕✨`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emotion: 'apologetic',
      heartLevel: 'medium',
      timestamp: Date.now(),
      isVoiceMessage: false
    };

    const currentHistory = this.getChatHistory(petId);
    const finalHistory = [...currentHistory, fallbackUserMessage, fallbackResponse];
    this.chatHistory.set(petId, finalHistory);

    return finalHistory;
  }

  private getHeartLevel(emotionalBond: number): string {
    if (emotionalBond >= 90) return 'transcendent';
    if (emotionalBond >= 70) return 'maximum';
    if (emotionalBond >= 50) return 'very high';
    if (emotionalBond >= 30) return 'high';
    return 'medium';
  }

  clearChatHistory(petId: string): void {
    this.chatHistory.delete(petId);
  }

  getMessageCount(petId: string): number {
    const history = this.getChatHistory(petId);
    return history.filter(msg => msg.type === 'user').length;
  }
}

export const chatbotService = new ChatbotService();
export default chatbotService;