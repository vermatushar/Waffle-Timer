import React from 'react';
import { useUiStore } from '../store/useUiStore';
import { Timer } from 'lucide-react';

export const CollapsedIcon: React.FC = () => {
  const { expand } = useUiStore();

  return (
    <div className="w-full h-full drag-region">
      <button
        onClick={expand}
        className="w-full h-full rounded-2xl overflow-hidden relative group 
                   hover:scale-105 transition-all duration-200 ease-out
                   focus:outline-none cursor-pointer no-drag
                   bg-gradient-to-br from-black/70 to-black/60
                   backdrop-blur-2xl border border-white/5
                   hover:from-black/80 hover:to-black/70
                   hover:border-white/10 shadow-2xl"
        aria-label="Expand Timer"
        title="Click to open Timer"
      >
        <div className="w-full h-full flex items-center justify-center">
          <Timer className="w-7 h-7 text-amber-400/70 group-hover:text-amber-400 
                           transition-all duration-200
                           filter drop-shadow-lg" />
        </div>
      </button>
    </div>
  );
};