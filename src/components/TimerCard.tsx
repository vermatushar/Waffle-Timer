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
  const circumference = 2 * Math.PI * 40; // Even smaller radius for compact design
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="relative rounded-xl 
                    bg-white/[0.02] backdrop-blur-lg
                    border border-white/5
                    shadow-lg
                    p-2.5 transition-all duration-300 hover:bg-white/[0.04]">
      
      {/* Collapse button - top right of timer card */}
      <button
        onClick={collapse}
        className="absolute top-1.5 right-1.5 w-5 h-5 rounded-lg
                   bg-white/[0.03] hover:bg-white/[0.06] 
                   flex items-center justify-center
                   transition-all duration-300 no-drag z-10
                   hover:scale-110"
        aria-label="Collapse to icon"
        title="Minimize"
      >
        <ChevronDown className="w-2.5 h-2.5 text-white/40" />
      </button>

      <div className="flex items-center justify-between gap-3">
        {/* Timer Circle and Time */}
        <div className="flex items-center">
                <div className="relative">
                  <svg className="transform -rotate-90 w-20 h-20"> {/* Even smaller size */}
                    <circle
                      cx="40"
                      cy="40"
                      r="40"
                stroke="rgba(255, 255, 255, 0.03)"
                strokeWidth="2.5"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="40"
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
                    <div className="font-mono text-xl font-semibold text-white/90 tabular-nums"> {/* Compact font */}
                      {formatTime(remaining)}
                    </div>
                    <div className="text-[8px] text-white/40 uppercase tracking-wider">
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
                        className="w-8 h-8 rounded-lg bg-amber-500/10 hover:bg-amber-500/20
                                 flex items-center justify-center transition-all duration-300
                                 active:scale-95 no-drag hover:scale-105"
                        aria-label="Pause"
                        tabIndex={1}
                      >
                        <Pause className="w-3 h-3 text-amber-400/80" />
                      </button>
                    ) : (
                      <button
                        onClick={start}
                        className="w-8 h-8 rounded-lg bg-amber-500/10 hover:bg-amber-500/20
                                 flex items-center justify-center transition-all duration-300
                                 active:scale-95 no-drag hover:scale-105"
                        aria-label="Start"
                        tabIndex={1}
                      >
                        <Play className="w-3 h-3 text-amber-400/80 ml-0.5" />
                      </button>
                    )}

                    <button
                      onClick={reset}
                      className="w-8 h-8 rounded-lg bg-white/[0.03] hover:bg-white/[0.06]
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
              className="w-8 h-8 rounded-lg bg-white/[0.03] hover:bg-white/[0.06]
                       flex items-center justify-center transition-all duration-300
                       active:scale-95 no-drag hover:scale-105"
              aria-label={muted ? "Unmute" : "Mute"}
              tabIndex={3}
            >
              {muted ? (
                <VolumeX className="w-2.5 h-2.5 text-white/40" />
              ) : (
                <Volume2 className="w-2.5 h-2.5 text-white/40" />
              )}
            </button>

            <button
              onClick={() => setShowMusicMenu(!showMusicMenu)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center 
                       transition-all duration-300 active:scale-95 no-drag hover:scale-105
                       ${selectedMusic ? 'bg-amber-500/10 hover:bg-amber-500/20' : 'bg-white/[0.03] hover:bg-white/[0.06]'}`}
              aria-label="Music"
              tabIndex={4}
            >
              <Music className={`w-2.5 h-2.5 ${selectedMusic ? 'text-amber-400/80' : 'text-white/40'}`} />
            </button>

            {/* Music Popover */}
            {showMusicMenu && (
              <div className="absolute bottom-full right-0 mb-1 w-28 rounded-lg
                            bg-black/80 backdrop-blur-2xl border border-white/10
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