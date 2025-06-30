interface VoiceConfig {
  voiceId: string;
  apiKey: string;
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
    voiceId: 'iiuCJu6VmpNb9BkNpMtY', // replace with your default voice ID
    apiKey: 'sk_60ec0db235e96aa1283d9df567a31c1d8e3cdb8772952c28' // NEVER expose in prod
  };

  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;

  // Start voice recording
  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.isRecording = true;

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.start();
      console.log('🎤 Recording started');
    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      throw new Error('Microphone permission denied or unavailable.');
    }
  }

  // Stop and return audio blob
  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording) {
        reject(new Error('No active recording.'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.isRecording = false;

        // Stop all audio tracks
        if (this.mediaRecorder?.stream) {
          this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }

        console.log('🎤 Recording stopped, blob size:', blob.size);
        resolve(blob);
      };

      this.mediaRecorder.stop();
    });
  }

  // 🔁 Transcribe audio via FastAPI Whisper
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'voice.wav');

    const response = await fetch('http://localhost:8000/transcribe', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      console.error('❌ Transcription failed:', response.statusText);
      throw new Error('Failed to transcribe audio.');
    }

    const data = await response.json();
    console.log('📝 Transcription:', data.transcript);
    return data.transcript;
  }

  // 🧠 Generate pet reply audio using ElevenLabs
  async generateAudio(text: string, personality: string, voiceType: string): Promise<string> {
    const voiceSettings = this.getVoiceSettings(personality, voiceType);

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceConfig.voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.voiceConfig.apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: voiceSettings
      })
    });

    if (!response.ok) {
      console.error('❌ ElevenLabs error:', response.statusText);
      throw new Error('Failed to generate audio from ElevenLabs');
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    console.log('✅ Audio generated');
    return audioUrl;
  }

  // 🔊 Play audio from a URL
  async playAudio(audioUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error('Failed to play audio'));
      audio.play().catch(reject);
    });
  }

  // ⏱️ Get audio duration (in seconds)
  async getAudioDuration(audioUrl: string): Promise<number> {
    return new Promise((resolve) => {
      const audio = new Audio(audioUrl);
      audio.onloadedmetadata = () => resolve(audio.duration);
      audio.onerror = () => resolve(0);
    });
  }

  // 🎛️ Dynamic ElevenLabs voice settings
  getVoiceSettings(personality: string, voice: string) {
    const settings = {
      stability: 0.5,
      similarity_boost: 0.5,
      style: 0.5,
      use_speaker_boost: true
    };

    switch (personality.toLowerCase()) {
      case 'playful': settings.stability = 0.3; settings.style = 0.8; break;
      case 'wise': settings.stability = 0.8; settings.style = 0.3; break;
      case 'mischievous': settings.stability = 0.4; settings.style = 0.7; break;
      case 'gentle': settings.stability = 0.7; settings.style = 0.4; break;
      case 'brave': settings.stability = 0.6; settings.style = 0.6; break;
      case 'quirky': settings.stability = 0.2; settings.style = 0.9; break;
    }

    switch (voice.toLowerCase()) {
      case 'cute & sweet': settings.similarity_boost = 0.8; break;
      case 'deep & wise': settings.stability = 0.9; break;
      case 'playful & energetic': settings.style = 0.9; break;
      case 'mysterious': settings.stability = 0.6; settings.style = 0.3; break;
      case 'grumpy & sarcastic': settings.stability = 0.7; settings.style = 0.2; break;
      case 'royal & elegant': settings.stability = 0.8; settings.similarity_boost = 0.7; break;
    }

    return settings;
  }

  // 🛠️ Support check
  isRecordingSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  getRecordingState(): boolean {
    return this.isRecording;
  }
}

export const voiceService = new VoiceService();
export default voiceService;
export type { AudioMessage };
