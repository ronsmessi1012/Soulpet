import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Mic, Volume2 } from 'lucide-react';
import { AudioMessage } from '../services/voiceService';

interface VoiceMessageBubbleProps {
  message: AudioMessage;
  isUser: boolean;
  petName?: string;
}

const VoiceMessageBubble: React.FC<VoiceMessageBubbleProps> = ({ 
  message, 
  isUser, 
  petName 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(message.duration || 0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
          isUser
            ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white border-white/30'
            : 'bg-white/90 text-gray-800 border-white/40'
        }`}
      >
        {/* Audio element */}
        <audio ref={audioRef} src={message.audioUrl} preload="metadata" />
        
        {/* Voice message header */}
        <div className="flex items-center mb-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
            isUser ? 'bg-white/20' : 'bg-purple-100'
          }`}>
            {isUser ? (
              <Mic className="h-3 w-3" />
            ) : (
              <Volume2 className="h-3 w-3 text-purple-600" />
            )}
          </div>
          <span className={`text-xs font-medium ${
            isUser ? 'text-purple-100' : 'text-gray-600'
          }`}>
            {isUser ? 'Voice Message' : `${petName || 'Pet'} Voice Reply`}
          </span>
        </div>

        {/* Voice message controls */}
        <div className="flex items-center space-x-3">
          {/* Play/Pause button */}
          <button
            onClick={togglePlayPause}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 ${
              isUser
                ? 'bg-white/20 hover:bg-white/30'
                : 'bg-purple-500 hover:bg-purple-600'
            }`}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-white" />
            ) : (
              <Play className="h-5 w-5 text-white ml-0.5" />
            )}
          </button>

          {/* Progress bar and duration */}
          <div className="flex-1">
            <div
              ref={progressRef}
              onClick={handleProgressClick}
              className={`h-2 rounded-full cursor-pointer mb-1 ${
                isUser ? 'bg-white/20' : 'bg-gray-200'
              }`}
            >
              <div
                className={`h-full rounded-full transition-all duration-100 ${
                  isUser
                    ? 'bg-white'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className={`text-xs ${
              isUser ? 'text-purple-100' : 'text-gray-500'
            }`}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className={`text-xs mt-2 ${
          isUser ? 'text-purple-100' : 'text-gray-500'
        }`}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};

export default VoiceMessageBubble;