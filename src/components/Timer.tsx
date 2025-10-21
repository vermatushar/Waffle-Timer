import React, { useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useTimerStore } from '../store/useTimerStore';

export const Timer: React.FC = () => {
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
      intervalRef.current = setInterval(tick, 100); // Check every 100ms for accuracy
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
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center p-8">
      {/* Circular Progress */}
      <div className="relative w-52 h-52">
        <svg className="transform -rotate-90 w-full h-full">
          {/* Background circle */}
          <circle
            cx="104"
            cy="104"
            r="90"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="104"
            cy="104"
            r="90"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300 ease-linear"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
        </svg>

        {/* Timer Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-bold text-white/95 tabular-nums tracking-tight">
            {formatTime(remaining)}
          </div>
          <div className="text-sm text-white/60 mt-1 uppercase tracking-wider">
            {state === 'idle' ? 'Ready' : 
             state === 'running' ? 'Focus' : 
             state === 'paused' ? 'Paused' : 
             'Complete!'}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-4 mt-8">
        {state === 'running' ? (
          <button
            onClick={pause}
            className="w-14 h-14 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-all duration-200 no-drag"
            aria-label="Pause"
          >
            <Pause className="w-6 h-6 text-white/90" />
          </button>
        ) : (
          <button
            onClick={start}
            className="w-14 h-14 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-all duration-200 no-drag"
            aria-label="Start"
          >
            <Play className="w-6 h-6 text-white/90 ml-0.5" />
          </button>
        )}

        <button
          onClick={reset}
          className="w-14 h-14 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-all duration-200 no-drag"
          aria-label="Reset"
        >
          <RotateCcw className="w-5 h-5 text-white/90" />
        </button>
      </div>
    </div>
  );
};
