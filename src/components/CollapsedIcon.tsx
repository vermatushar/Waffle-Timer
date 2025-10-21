import React from 'react';
import { useUiStore } from '../store/useUiStore';
import { Timer } from 'lucide-react';

export const CollapsedIcon: React.FC = () => {
  const { expand } = useUiStore();

  return (
    <div className="w-full h-full flex items-center justify-center">
      <button
        onClick={expand}
        className="w-full h-full rounded-2xl overflow-hidden relative group 
                   hover:scale-110 transition-all duration-300 ease-out
                   focus:outline-none cursor-pointer
                   bg-gradient-to-br from-gray-900/40 to-gray-800/40
                   backdrop-blur-xl border border-white/10
                   hover:from-gray-900/60 hover:to-gray-800/60
                   hover:border-white/20 shadow-xl"
        aria-label="Expand Timer"
        title="Click to open Timer"
      >
        <div className="w-full h-full flex items-center justify-center">
          <Timer className="w-8 h-8 text-amber-400/80 group-hover:text-amber-400 
                           group-hover:scale-110 transition-all duration-300
                           filter drop-shadow-lg" />
        </div>
      </button>
    </div>
  );
};