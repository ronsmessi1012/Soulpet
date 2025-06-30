const CHATBOT_API_BASE = 'https://soulpet-chatbot-2.onrender.com';

export interface ChatMessage {
  id: string;
  type: 'user' | 'pet';
  message?: string;
  audioUrl?: string;
  isVoiceMessage?: boolean;
  duration?: number;
  time: string;
  isVideo?: boolean;
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

  async sendMessage(
    petId: string, 
    userMessage: string, 
    pet: PetPersonality,
    isVoiceMessage: boolean = false,
    audioUrl?: string,
    duration?: number
  ): Promise<ChatMessage[]> {
    try {
      console.log('🤖 SENDING MESSAGE TO CHATBOT API:', {
        petId,
        userMessage,
        petName: pet.name,
        isVoiceMessage,
        apiUrl: CHATBOT_API_BASE
      });

      const userChatMessage: ChatMessage = {
        id: `${petId}-user-${Date.now()}`,
        type: 'user',
        message: isVoiceMessage ? undefined : userMessage,
        audioUrl: isVoiceMessage ? audioUrl : undefined,
        isVoiceMessage,
        duration,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now()
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
        chatHistory: currentHistory.slice(-5),
        isVoiceMessage
      };

      const response = await fetch(`${CHATBOT_API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          user_input: userMessage,
          context: context,
          voice_response: isVoiceMessage
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('🤖 CHATBOT API RESPONSE:', data);

      const petResponse: ChatMessage = {
        id: `${petId}-pet-${Date.now()}`,
        type: 'pet',
        message: isVoiceMessage ? undefined : (data.reply || "I'm having trouble connecting right now, but I'm still here with you! 💕"),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: data.emotion || pet.mood,
        heartLevel: this.getHeartLevel(pet.emotionalBond),
        timestamp: Date.now(),
        isVoiceMessage: false // Will be updated if we generate audio
      };

      // If user sent voice message, generate audio response
      if (isVoiceMessage && data.reply) {
        try {
          const { voiceService } = await import('./voiceService');
          const voiceSettings = voiceService.getVoiceSettings(pet.personality, pet.voice);
          const audioUrl = await voiceService.generateAudio(data.reply, voiceSettings);
          const audioDuration = await voiceService.getAudioDuration(audioUrl);
          
          petResponse.audioUrl = audioUrl;
          petResponse.isVoiceMessage = true;
          petResponse.duration = audioDuration;
          
          console.log('🔊 Generated audio response for pet');
        } catch (audioError) {
          console.error('❌ Error generating audio response:', audioError);
          // Fallback to text response
          petResponse.message = data.reply || "I'm having trouble with my voice right now, but I'm still here with you! 💕";
          petResponse.isVoiceMessage = false;
        }
      }

      const finalHistory = [...updatedHistory, petResponse];
      this.chatHistory.set(petId, finalHistory);

      console.log('✅ CHAT UPDATED SUCCESSFULLY');
      return finalHistory;

    } catch (error) {
      console.error('❌ CHATBOT API ERROR:', error);

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

      const fallbackUserMessage: ChatMessage = {
        id: `${petId}-user-${Date.now()}`,
        type: 'user',
        message: isVoiceMessage ? undefined : userMessage,
        audioUrl: isVoiceMessage ? audioUrl : undefined,
        isVoiceMessage,
        duration,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now()
      };

      const currentHistory = this.getChatHistory(petId);
      const finalHistory = [...currentHistory, fallbackUserMessage, fallbackResponse];
      this.chatHistory.set(petId, finalHistory);

      return finalHistory;
    }
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