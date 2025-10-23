import React from 'react';
import { useDuckStore } from '../store/useDuckStore';
import { useUiStore } from '../store/useUiStore';

interface DuckAvatarProps {
  progress?: number;
  state?: string;
}

export const DuckAvatar: React.FC<DuckAvatarProps> = ({ progress = 0, state = 'idle' }) => {
  const { currentUrl } = useDuckStore();
  const { collapsed, expand, collapse } = useUiStore();

  const handleClick = async () => {
    if (collapsed) {
      await expand();
    } else {
      await collapse();
    }
  };

  // Calculate stroke dash offset for the progress circle
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <button
      onClick={handleClick}
      className="group relative isolate rounded-full 
                 bg-transparent hover:bg-white/5 
                 transition-all duration-300 
                 focus:outline-none focus:ring-2 focus:ring-white/40
                 no-drag hover:scale-105 active:scale-95"
      title={collapsed ? "Expand Waffle Timer" : "Minimize Waffle Timer"}
      aria-label={collapsed ? "Expand Waffle Timer" : "Minimize Waffle Timer"}
      tabIndex={10}
    >
      {/* Progress Circle */}
      <svg className="absolute inset-0 transform -rotate-90 w-[96px] h-[96px]">
        {/* Background circle */}
        <circle
          cx="48"
          cy="48"
          r="42"
          stroke="rgba(255, 255, 255, 0.03)"
          strokeWidth="3"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="48"
          cy="48"
          r="42"
          stroke="url(#duck-timer-gradient)"
          strokeWidth="3"
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
          <linearGradient id="duck-timer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Glow effect on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-full 
                      blur-md opacity-30 group-hover:opacity-50 
                      duck-glow" />
      
      {/* Duck GIF */}
      <div className="relative w-[96px] h-[96px] flex items-center justify-center">
        <img
          src={currentUrl}
          alt="Duck avatar"
          className="w-[84px] h-[84px] rounded-full object-cover select-none 
                     duck-bob pointer-events-none"
          onError={(e) => {
            console.error('Failed to load duck GIF:', currentUrl);
            // Fallback to a placeholder if the GIF fails to load
            e.currentTarget.src = '/waffle-icon.png';
          }}
        />
      </div>
    </button>
  );
};