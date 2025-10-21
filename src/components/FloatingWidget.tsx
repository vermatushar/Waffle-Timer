import React, { useEffect } from 'react';
import { ChevronDown, ChevronUp, Volume2, VolumeX, StickyNote, Music, Sparkles } from 'lucide-react';
import { Timer } from './Timer';
import { TodoList } from './TodoList';
import { useUiStore } from '../store/useUiStore';
import { useNoteStore } from '../store/useNoteStore';
import { clsx } from 'clsx';

export const FloatingWidget: React.FC = () => {
  const { collapsed, muted, toggleCollapse, toggleMute, loadSettings } = useUiStore();
  const { openNoteWindow } = useNoteStore();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  if (collapsed) {
    return (
      <div className="h-screen w-screen p-2">
        <div className="w-20 h-20 glass-dark rounded-3xl shadow-2xl p-2 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 animate-pulse-slow" />
          <button
            onClick={toggleCollapse}
            className="w-full h-full flex items-center justify-center hover:scale-110 transition-transform no-drag relative z-10"
            aria-label="Expand"
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl filter drop-shadow-md">🧇</span>
              <ChevronDown className="w-3 h-3 text-white/60" />
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen p-0">
      <div className="w-[380px] h-[620px] glass-dark rounded-3xl overflow-hidden flex flex-col relative">
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        
        {/* Header Bar */}
        <div className="relative z-10 flex items-center justify-between px-5 py-4 drag-region border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="text-2xl filter drop-shadow-lg">🧇</span>
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-amber-400 animate-pulse-slow" />
            </div>
            <div>
              <h1 className="text-white/90 font-semibold text-base">Waffle Timer</h1>
              <p className="text-white/40 text-xs">Focus & Flow</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            {/* Sound Toggle */}
            <button
              onClick={toggleMute}
              className="btn-icon w-8 h-8 no-drag"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? (
                <VolumeX className="w-4 h-4 text-white/60" />
              ) : (
                <Volume2 className="w-4 h-4 text-white/60" />
              )}
            </button>

            {/* Music Control */}
            <button
              className="btn-icon w-8 h-8 no-drag"
              aria-label="Music"
            >
              <Music className="w-4 h-4 text-white/60" />
            </button>

            {/* Sticky Note */}
            <button
              onClick={openNoteWindow}
              className="btn-icon w-8 h-8 no-drag"
              aria-label="Open sticky note"
            >
              <StickyNote className="w-4 h-4 text-white/60" />
            </button>

            {/* Collapse */}
            <button
              onClick={toggleCollapse}
              className="btn-icon w-8 h-8 no-drag ml-1"
              aria-label="Collapse"
            >
              <ChevronUp className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          {/* Todo Section (Now Larger, at Top) */}
          <div className="flex-1 px-5 py-4 overflow-hidden">
            <TodoList />
          </div>

          {/* Divider */}
          <div className="px-5">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Timer Section (Now Smaller, at Bottom) */}
          <div className="h-[200px] px-5 py-4">
            <Timer compact />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/5 relative z-10">
          <p className="text-xs text-white/30 text-center font-light">
            Stay focused, one waffle at a time ✨
          </p>
        </div>
      </div>
    </div>
  );
};