import React, { useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useTimerStore } from '../store/useTimerStore';

interface TimerProps {
  compact?: boolean;
}

export const Timer: React.FC<TimerProps> = ({ compact = false }) => {
  const { 
    duration, 
    remaining, 
    state, 
    start, 
    pause, 
    reset, 
    tick 
  } = useTimerStore();
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state, tick]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - (remaining / duration);
  const circumference = 2 * Math.PI * (compact ? 55 : 90);
  const strokeDashoffset = circumference - progress * circumference;

  if (compact) {
    return (
      <div className="flex items-center justify-between h-full">
        {/* Compact Timer Display */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <svg className="transform -rotate-90 w-28 h-28">
              {/* Background circle */}
              <circle
                cx="56"
                cy="56"
                r="50"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="4"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="56"
                cy="56"
                r="50"
                stroke="url(#gradient-compact)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 ease-linear timer-ring"
              />
              <defs>
                <linearGradient id="gradient-compact" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>

            {/* Timer Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-semibold text-white/95 tabular-nums">
                {formatTime(remaining)}
              </div>
              <div className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">
                {state === 'idle' ? 'Ready' : 
                 state === 'running' ? 'Focus' : 
                 state === 'paused' ? 'Paused' : 
                 'Done!'}
              </div>
            </div>
          </div>
        </div>

        {/* Compact Control Buttons */}
        <div className="flex flex-col gap-2">
          {state === 'running' ? (
            <button
              onClick={pause}
              className="btn-icon w-12 h-12 no-drag"
              aria-label="Pause"
            >
              <Pause className="w-5 h-5 text-white/70" />
            </button>
          ) : (
            <button
              onClick={start}
              className="btn-icon w-12 h-12 no-drag bg-gradient-to-br from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30"
              aria-label="Start"
            >
              <Play className="w-5 h-5 text-amber-400 ml-0.5" />
            </button>
          )}

          <button
            onClick={reset}
            className="btn-icon w-12 h-12 no-drag"
            aria-label="Reset"
          >
            <RotateCcw className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>
    );
  }

  // Full-size timer (original)
  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      {/* Circular Progress */}
      <div className="relative w-52 h-52">
        <svg className="transform -rotate-90 w-full h-full">
          {/* Background circle */}
          <circle
            cx="104"
            cy="104"
            r="90"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="6"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="104"
            cy="104"
            r="90"
            stroke="url(#gradient-full)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300 ease-linear timer-ring"
          />
          <defs>
            <linearGradient id="gradient-full" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>

        {/* Timer Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-bold text-white/95 tabular-nums tracking-tight">
            {formatTime(remaining)}
          </div>
          <div className="text-sm text-white/50 mt-1 uppercase tracking-wider">
            {state === 'idle' ? 'Ready' : 
             state === 'running' ? 'Focus Time' : 
             state === 'paused' ? 'Paused' : 
             'Complete!'}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3 mt-8">
        {state === 'running' ? (
          <button
            onClick={pause}
            className="btn-icon w-14 h-14 no-drag"
            aria-label="Pause"
          >
            <Pause className="w-6 h-6 text-white/80" />
          </button>
        ) : (
          <button
            onClick={start}
            className="btn-icon w-14 h-14 no-drag bg-gradient-to-br from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30"
            aria-label="Start"
          >
            <Play className="w-6 h-6 text-amber-400 ml-0.5" />
          </button>
        )}

        <button
          onClick={reset}
          className="btn-icon w-14 h-14 no-drag"
          aria-label="Reset"
        >
          <RotateCcw className="w-5 h-5 text-white/80" />
        </button>
      </div>
    </div>
  );
};