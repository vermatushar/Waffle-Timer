import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Music, ChevronDown } from 'lucide-react';
import { useTimerStore } from '../store/useTimerStore';
import { useUiStore } from '../store/useUiStore';

const AMBIENT_TRACKS = [
  { id: 'rain', name: 'Rain', url: '/sounds/rain.mp3' },
  { id: 'forest', name: 'Forest', url: '/sounds/forest.mp3' },
  { id: 'waves', name: 'Waves', url: '/sounds/waves.mp3' },
];

export const TimerCard: React.FC = () => {
  const { duration, remaining, state, start, pause, reset, tick } = useTimerStore();
  const { muted, selectedMusic, toggleMute, setSelectedMusic, collapse } = useUiStore();
  const [showMusicMenu, setShowMusicMenu] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = setInterval(tick, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state, tick]);

  useEffect(() => {
    // Handle ambient music
    if (selectedMusic && !muted) {
      const track = AMBIENT_TRACKS.find(t => t.id === selectedMusic);
      if (track) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        audioRef.current = new Audio(track.url);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(console.error);
      }
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [selectedMusic, muted]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - (remaining / duration);
  const circumference = 2 * Math.PI * 45; // Smaller radius
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="relative rounded-xl 
                    bg-white/5 backdrop-blur-lg
                    border border-white/10
                    shadow-lg
                    p-3 transition-all duration-300 hover:bg-white/8">
      
      {/* Collapse button - top right of timer card */}
      <button
        onClick={collapse}
        className="absolute top-2 right-2 w-6 h-6 rounded-lg
                   bg-white/5 hover:bg-white/10 
                   flex items-center justify-center
                   transition-all duration-300 no-drag z-10
                   hover:scale-110"
        aria-label="Collapse to icon"
        title="Minimize"
      >
        <ChevronDown className="w-3 h-3 text-white/50" />
      </button>

      <div className="flex items-center justify-between gap-3">
        {/* Timer Circle and Time */}
        <div className="flex items-center">
          <div className="relative">
            <svg className="transform -rotate-90 w-24 h-24"> {/* Smaller size */}
              <circle
                cx="48"
                cy="48"
                r="45"
                stroke="rgba(255, 255, 255, 0.03)"
                strokeWidth="2.5"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r="45"
                stroke="url(#timer-gradient)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500 ease-out"
                style={{
                  filter: state === 'running' ? 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))' : 'none'
                }}
              />
              <defs>
                <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-mono text-2xl font-semibold text-white/90 tabular-nums"> {/* Smaller font */}
                {formatTime(remaining)}
              </div>
              <div className="text-[9px] text-white/40 uppercase tracking-wider">
                {state === 'idle' ? 'Ready' : 
                 state === 'running' ? 'Focus' : 
                 state === 'paused' ? 'Paused' : 
                 'Complete'}
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section - More Compact */}
        <div className="flex flex-col gap-1.5">
          {/* Play/Pause and Reset */}
          <div className="flex gap-1.5">
            {state === 'running' ? (
              <button
                onClick={pause}
                className="w-9 h-9 rounded-lg bg-amber-500/15 hover:bg-amber-500/25
                         flex items-center justify-center transition-all duration-300
                         active:scale-95 no-drag hover:scale-105"
                aria-label="Pause"
                tabIndex={1}
              >
                <Pause className="w-3.5 h-3.5 text-amber-400/90" />
              </button>
            ) : (
              <button
                onClick={start}
                className="w-9 h-9 rounded-lg bg-amber-500/15 hover:bg-amber-500/25
                         flex items-center justify-center transition-all duration-300
                         active:scale-95 no-drag hover:scale-105"
                aria-label="Start"
                tabIndex={1}
              >
                <Play className="w-3.5 h-3.5 text-amber-400/90 ml-0.5" />
              </button>
            )}

            <button
              onClick={reset}
              className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10
                       flex items-center justify-center transition-all duration-300
                       active:scale-95 no-drag hover:scale-105"
              aria-label="Reset"
              tabIndex={2}
            >
              <RotateCcw className="w-3 h-3 text-white/50" />
            </button>
          </div>

          {/* Sound and Music Controls */}
          <div className="flex gap-1.5 relative">
            <button
              onClick={toggleMute}
              className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10
                       flex items-center justify-center transition-all duration-300
                       active:scale-95 no-drag hover:scale-105"
              aria-label={muted ? "Unmute" : "Mute"}
              tabIndex={3}
            >
              {muted ? (
                <VolumeX className="w-3 h-3 text-white/50" />
              ) : (
                <Volume2 className="w-3 h-3 text-white/50" />
              )}
            </button>

            <button
              onClick={() => setShowMusicMenu(!showMusicMenu)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center 
                       transition-all duration-300 active:scale-95 no-drag hover:scale-105
                       ${selectedMusic ? 'bg-amber-500/15 hover:bg-amber-500/25' : 'bg-white/5 hover:bg-white/10'}`}
              aria-label="Music"
              tabIndex={4}
            >
              <Music className={`w-3 h-3 ${selectedMusic ? 'text-amber-400/90' : 'text-white/50'}`} />
            </button>

            {/* Music Popover */}
            {showMusicMenu && (
              <div className="absolute bottom-full right-0 mb-1 w-28 rounded-lg
                            bg-gray-800/80 backdrop-blur-2xl border border-white/10
                            shadow-2xl p-1.5 z-50 animate-fadeIn">
                <div className="text-[9px] text-white/50 px-2 py-0.5">Ambient</div>
                {AMBIENT_TRACKS.map(track => (
                  <button
                    key={track.id}
                    onClick={() => {
                      setSelectedMusic(selectedMusic === track.id ? null : track.id);
                      setShowMusicMenu(false);
                    }}
                    className={`w-full text-left px-2 py-1 rounded text-[11px]
                              transition-all duration-200 no-drag
                              ${selectedMusic === track.id 
                                ? 'bg-amber-500/20 text-amber-400' 
                                : 'text-white/60 hover:bg-white/10'}`}
                  >
                    {track.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};