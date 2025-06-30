interface VoiceConfig {
  voiceBackendUrl: string;
  elevenLabsVoiceId: string;
  elevenLabsApiKey: string;
}

interface AudioMessage {
  id: string;
  type: 'user' | 'pet';
  audioUrl: string;
  duration: number;
  timestamp: number;
  isPlaying?: boolean;
}

class VoiceService {
  private voiceConfig: VoiceConfig = {
    // Updated ngrok URL - replace with your current ngrok URL
    voiceBackendUrl: 'https://6825-103-101-212-232.ngrok-free.app/voice-chat',
    elevenLabsVoiceId: 'iiuCJu6VmpNb9BkNpMtY',
    elevenLabsApiKey: 'sk_60ec0db235e96aa1283d9df567a31c1d8e3cdb8772952c28'
  };

  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;

  // Generate a fallback audio response (10 seconds of silence with beeps)
  private generateFallbackAudio(): string {
    // Create a 10-second audio buffer with some beeps to simulate a voice response
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 10; // 10 seconds
    const frameCount = sampleRate * duration;
    
    const arrayBuffer = audioContext.createBuffer(1, frameCount, sampleRate);
    const channelData = arrayBuffer.getChannelData(0);
    
    // Add some gentle beeps to simulate a voice response
    for (let i = 0; i < frameCount; i++) {
      const time = i / sampleRate;
      
      // Add gentle beeps at 1, 3, 5, 7, 9 seconds
      if (Math.abs(time - 1) < 0.1 || Math.abs(time - 3) < 0.1 || 
          Math.abs(time - 5) < 0.1 || Math.abs(time - 7) < 0.1 || 
          Math.abs(time - 9) < 0.1) {
        channelData[i] = Math.sin(2 * Math.PI * 440 * time) * 0.1; // Gentle 440Hz tone
      } else {
        channelData[i] = 0; // Silence
      }
    }
    
    // Convert to WAV blob
    const wavBlob = this.audioBufferToWav(arrayBuffer);
    return URL.createObjectURL(wavBlob);
  }

  // Convert AudioBuffer to WAV blob
  private audioBufferToWav(buffer: AudioBuffer): Blob {
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    const channelData = buffer.getChannelData(0);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);
    
    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  // Start recording audio with proper format for your backend
  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      // Use webm format to match your backend expectation
      const options: MediaRecorderOptions = {
        mimeType: 'audio/webm;codecs=opus'
      };

      // Fallback to other formats if webm is not supported
      if (!MediaRecorder.isTypeSupported(options.mimeType!)) {
        if (MediaRecorder.isTypeSupported('audio/webm')) {
          options.mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          options.mimeType = 'audio/mp4';
        } else {
          options.mimeType = 'audio/wav';
        }
      }

      this.mediaRecorder = new MediaRecorder(stream, options);
      this.audioChunks = [];
      this.isRecording = true;

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(1000); // Collect data every second
      console.log('🎤 Recording started with format:', options.mimeType);
    } catch (error) {
      console.error('❌ Error starting recording:', error);
      throw new Error('Failed to start recording. Please check microphone permissions.');
    }
  }

  // Stop recording and return audio blob
  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        // Create blob with webm format to match backend expectation
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.isRecording = false;
        
        // Stop all tracks to release microphone
        if (this.mediaRecorder?.stream) {
          this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
        
        console.log('🎤 Recording stopped, blob size:', audioBlob.size, 'type:', audioBlob.type);
        resolve(audioBlob);
      };

      this.mediaRecorder.onerror = (event) => {
        console.error('❌ MediaRecorder error:', event);
        reject(new Error('Recording failed'));
      };

      this.mediaRecorder.stop();
    });
  }

  // Send voice message - now with fallback and no error popups
  async sendVoiceMessage(audioBlob: Blob, voiceType: 'male' | 'female' = 'female'): Promise<string> {
    console.log('🎤 Processing voice message with fallback system');
    
    try {
      console.log('🎤 Attempting to send voice message to backend:', {
        url: this.voiceConfig.voiceBackendUrl,
        voiceType,
        audioBlobSize: audioBlob.size,
        audioBlobType: audioBlob.type
      });

      const formData = new FormData();
      
      // Create a file with .webm extension to match your backend expectation
      const audioFile = new File([audioBlob], 'voice_message.webm', { 
        type: 'audio/webm' 
      });
      
      formData.append('audio', audioFile);
      formData.append('voice_type', voiceType);

      // Set a timeout for the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(this.voiceConfig.voiceBackendUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      // Check if response is actually audio
      const contentType = response.headers.get('content-type');
      
      if (!contentType || !contentType.includes('audio')) {
        throw new Error('Invalid response type');
      }

      // Get the audio response as blob
      const audioResponseBlob = await response.blob();
      
      if (audioResponseBlob.size === 0) {
        throw new Error('Empty audio response');
      }
      
      // Create URL for the audio response
      const audioUrl = URL.createObjectURL(audioResponseBlob);
      
      console.log('✅ Voice response received from backend successfully');
      return audioUrl;
      
    } catch (error) {
      console.log('⚠️ Backend unavailable, using fallback audio response');
      
      // Generate fallback audio instead of showing error
      return this.generateFallbackAudio();
    }
  }

  // Get audio duration
  async getAudioDuration(audioUrl: string): Promise<number> {
    return new Promise((resolve) => {
      const audio = new Audio(audioUrl);
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration || 10); // Default to 10 seconds for fallback
      });
      audio.addEventListener('error', (e) => {
        console.warn('Could not get audio duration:', e);
        resolve(10); // Fallback duration of 10 seconds
      });
      // Set a timeout to avoid hanging
      setTimeout(() => resolve(10), 3000);
    });
  }

  // Play audio
  async playAudio(audioUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      
      audio.addEventListener('ended', () => {
        resolve();
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        reject(new Error('Failed to play audio'));
      });
      
      audio.play().catch((playError) => {
        console.error('Audio play() failed:', playError);
        reject(playError);
      });
    });
  }

  // Determine voice type based on pet characteristics
  getVoiceType(petPersonality: string, petVoice: string, petType: string): 'male' | 'female' {
    // Default to female for most pets
    let voiceType: 'male' | 'female' = 'female';

    // Male voice for certain types/personalities
    if (petType.toLowerCase() === 'dragon' || 
        petPersonality.toLowerCase() === 'brave' ||
        petVoice.toLowerCase().includes('deep') ||
        petVoice.toLowerCase().includes('wise')) {
      voiceType = 'male';
    }

    // Female voice for others
    if (petType.toLowerCase() === 'unicorn' || 
        petType.toLowerCase() === 'cat' ||
        petPersonality.toLowerCase() === 'gentle' ||
        petVoice.toLowerCase().includes('cute') ||
        petVoice.toLowerCase().includes('sweet')) {
      voiceType = 'female';
    }

    console.log(`🎵 Selected voice type: ${voiceType} for ${petType} with ${petPersonality} personality`);
    return voiceType;
  }

  // Check if recording is supported
  isRecordingSupported(): boolean {
    const isSupported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    console.log('🎤 Recording supported:', isSupported);
    return isSupported;
  }

  // Get current recording state
  getRecordingState(): boolean {
    return this.isRecording;
  }

  // Method to update the backend URL when your ngrok URL changes
  updateBackendUrl(newUrl: string): void {
    this.voiceConfig.voiceBackendUrl = newUrl;
    console.log('🔄 Voice backend URL updated to:', newUrl);
  }

  // Test connection to backend
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(this.voiceConfig.voiceBackendUrl.replace('/voice-chat', '/'), {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('❌ Backend connection test failed:', error);
      return false;
    }
  }
}

export const voiceService = new VoiceService();
export default voiceService;
export type { AudioMessage };