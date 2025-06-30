import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, X, Volume2 } from 'lucide-react';
import { voiceService } from '../services/voiceService';

interface VoiceRecorderProps {
  onVoiceMessage: (audioBlob: Blob, transcript: string) => void;
  onCancel: () => void;
  isRecording: boolean;
  petName: string;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onVoiceMessage,
  onCancel,
  isRecording,
  petName
}) => {
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);

  // 🎛 Animate recording time and audio bars
  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      const animateLevel = () => {
        setAudioLevel(Math.random() * 100);
        animationRef.current = requestAnimationFrame(animateLevel);
      };
      animateLevel();
    } else {
      clearTimers();
    }

    return () => clearTimers();
  }, [isRecording]);

  const clearTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setRecordingTime(0);
    setAudioLevel(0);
  };

  const handleStopAndSend = async () => {
    if (!isRecording) return;
    setIsProcessing(true);

    try {
      const audioBlob = await voiceService.stopRecording();
      const transcript = await voiceService.transcribeAudio(audioBlob);
      onVoiceMessage(audioBlob, transcript);
    } catch (err) {
      console.error('❌ Voice processing error:', err);
      alert('Failed to send voice message. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    try {
      await voiceService.stopRecording();
    } catch (err) {
      console.error('❌ Stop error:', err);
    }
    onCancel();
  };

  const formatTime = (sec: number): string => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isRecording && !isProcessing) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="backdrop-blur-2xl bg-white/95 border border-white/40 rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center">
          {isProcessing ? (
            <>
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Volume2 className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Processing Voice Message</h3>
              <p className="text-gray-600 mb-6">Transcribing your voice for {petName}...</p>
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
            </>
          ) : (
            <>
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                  <Mic className="h-12 w-12 text-white" />
                </div>
                <div
                  className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"
                  style={{ opacity: audioLevel / 200 }}
                />
                <div
                  className="absolute -inset-2 rounded-full border-2 border-red-200 animate-ping delay-75"
                  style={{ opacity: audioLevel / 300 }}
                />
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-2">Recording Voice Message</h3>
              <p className="text-gray-600 mb-4">Speak to {petName} — they’re listening!</p>

              <div className="text-3xl font-bold text-red-600 mb-8 font-mono">{formatTime(recordingTime)}</div>

              <div className="flex items-center justify-center space-x-1 mb-8">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-red-400 to-pink-400 rounded-full transition-all duration-100"
                    style={{
                      height: `${Math.max(4, (audioLevel + Math.random() * 20) / 5)}px`
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center space-x-6">
                <button
                  onClick={handleCancel}
                  className="w-14 h-14 bg-gray-500 text-white rounded-full flex items-center justify-center hover:bg-gray-600 transition-all duration-300 hover:scale-110"
                >
                  <X className="h-6 w-6" />
                </button>
                <button
                  onClick={handleStopAndSend}
                  className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-110"
                >
                  <Send className="h-8 w-8" />
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-4">Tap green to send your voice message</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceRecorder;
