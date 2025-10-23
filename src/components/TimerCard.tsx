import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, Music, Lightbulb } from 'lucide-react';
import { useTimerStore } from '../store/useTimerStore';
import { useUiStore } from '../store/useUiStore';
import { useThinkTankStore } from '../store/useThinkTankStore';
import { DuckAvatar } from './DuckAvatar';
import { playClickSound } from '../utils/soundUtils';

const AMBIENT_TRACKS = [
  { id: 'rain', name: 'Rain', url: '/sounds/rain.mp3' },
  { id: 'forest', name: 'Forest', url: '/sounds/forest.mp3' },
  { id: 'waves', name: 'Waves', url: '/sounds/waves.mp3' },
];

export const TimerCard: React.FC = () => {
  const { duration, remaining, state, start, pause, reset } = useTimerStore();
  const { muted, selectedMusic, toggleMute, setSelectedMusic } = useUiStore();
  const { toggleThinkTank } = useThinkTankStore();
  const [showMusicMenu, setShowMusicMenu] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  return (
    <div className="relative rounded-xl 
                    bg-white/[0.02] backdrop-blur-lg
                    border border-white/5
                    shadow-lg
                    p-3 transition-all duration-300 hover:bg-white/[0.04]">
      
      <div className="grid grid-cols-[1fr,auto,1fr] items-center justify-items-center gap-2">
        {/* LEFT: Timer Display */}
        <div className="flex flex-col items-center gap-2">
          <div className="timer-display text-[18px] text-white/90 tracking-wide tabular-nums"
               style={{ 
                 fontFamily: "'DM Mono', 'SF Mono', 'Monaco', monospace",
                 fontWeight: 300,
                 letterSpacing: '0.04em'
               }}>
            {formatTime(remaining)}
          </div>
          
          {/* Play/Pause button below timer */}
          {state === 'running' ? (
            <button
              onClick={() => {
                playClickSound();
                pause();
              }}
              className="w-8 h-8 rounded-full bg-amber-500/15 hover:bg-amber-500/25
                       flex items-center justify-center transition-all duration-300
                       active:scale-95 hover:scale-105
                       border border-amber-500/20 hover:border-amber-500/30 "
              aria-label="Pause"
              tabIndex={1}
            >
              <Pause className="w-3 h-3 text-amber-400" />
            </button>
          ) : (
            <button
              onClick={() => {
                playClickSound();
                start();
              }}
              className="w-8 h-8 rounded-full bg-amber-500/15 hover:bg-amber-500/25
                       flex items-center justify-center transition-all duration-300
                       active:scale-95 hover:scale-105
                       border border-amber-500/20 hover:border-amber-500/30 "
              aria-label="Start"
              tabIndex={1}
            >
              <Play className="w-3 h-3 text-amber-400 ml-0.5" />
            </button>
          )}
        </div>

        {/* CENTER: Controls Section - 2x2 Grid */}
        <div className="flex items-center justify-center ">
          <div className="grid grid-cols-2 gap-2">
            {/* Think Tank Button - Top Left */}
            <button
              onClick={() => {
                playClickSound();
                toggleThinkTank();
              }}
              className="w-[30px] h-[30px] rounded-lg bg-white/[0.03] hover:bg-white/[0.06]
                       flex items-center justify-center transition-all duration-300
                       active:scale-95 hover:scale-105"
              aria-label="Think Tank"
              tabIndex={2}
              title="Think Tank - Capture ideas"
            >
              <Lightbulb className="w-3.5 h-3.5 text-white/50 hover:text-white/70" />
            </button>
            
            {/* Reset Button - Top Right */}
            <button
              onClick={() => {
                playClickSound();
                reset();
              }}
              className="w-[30px] h-[30px] rounded-lg bg-white/[0.03] hover:bg-white/[0.06]
                       flex items-center justify-center transition-all duration-300
                       active:scale-95 hover:scale-105"
              aria-label="Reset"
              tabIndex={3}
            >
              <RotateCcw className="w-3.5 h-3.5 text-white/50" />
            </button>

            {/* Sound Button - Bottom Left */}
            <button
              onClick={async () => {
                playClickSound();
                // Try to open system sound settings
                try {
                  if (window.__TAURI__) {
                    const { openUrl } = await import('@tauri-apps/plugin-opener');
                    // macOS specific URL to open sound preferences
                    await openUrl('x-apple.systempreferences:com.apple.preference.sound');
                  } else {
                    // Fallback to toggle mute in browser
                    toggleMute();
                  }
                } catch (error) {
                  console.error('Failed to open sound settings:', error);
                  toggleMute(); // Fallback to toggle mute
                }
              }}
              className="w-[30px] h-[30px] rounded-lg bg-white/[0.03] hover:bg-white/[0.06]
                       flex items-center justify-center transition-all duration-300
                       active:scale-95 hover:scale-105"
              aria-label="Sound Settings"
              tabIndex={4}
              title="Open Sound Settings"
            >
              <Volume2 className="w-3.5 h-3.5 text-white/40" />
            </button>

            {/* Music Button - Bottom Right */}
            <div className="relative">
              <button
                onClick={() => {
                  playClickSound();
                  setShowMusicMenu(!showMusicMenu);
                }}
                className={`w-[30px] h-[30px] rounded-lg flex items-center justify-center 
                         transition-all duration-300 active:scale-95 hover:scale-105
                         ${selectedMusic ? 'bg-amber-500/10 hover:bg-amber-500/20' : 'bg-white/[0.03] hover:bg-white/[0.06]'}`}
                aria-label="Music"
                tabIndex={5}
              >
                <Music className={`w-3.5 h-3.5 ${selectedMusic ? 'text-amber-400/80' : 'text-white/40'}`} />
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
                        playClickSound();
                        setSelectedMusic(selectedMusic === track.id ? null : track.id);
                        setShowMusicMenu(false);
                      }}
                      className={`w-full text-left px-2 py-1 rounded text-[11px]
                                transition-all duration-200                                 ${selectedMusic === track.id 
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
        
        {/* RIGHT: Duck Avatar with Progress Circle */}
        <DuckAvatar progress={progress} state={state} />
      </div>
    </div>
  );
};