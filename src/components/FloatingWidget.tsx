import React, { useEffect } from 'react';
import { ChevronDown, ChevronUp, Volume2, VolumeX, StickyNote, Music } from 'lucide-react';
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
      <div className="h-screen w-screen overflow-hidden">
        <div className="w-[72px] h-[72px] glass-dark rounded-2xl shadow-2xl drag-region p-2 flex items-center justify-center">
          <button
            onClick={toggleCollapse}
            className="w-full h-full flex items-center justify-center hover:bg-white/10 rounded-xl transition-all no-drag"
            aria-label="Expand"
          >
            <div className="flex flex-col items-center">
              <div className="text-2xl">⏰</div>
              <ChevronDown className="w-3 h-3 text-white/60 -mt-1" />
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden p-4">
      <div className="w-[420px] h-[580px] glass-dark rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 drag-region border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-lg">🧇</span>
            <span className="text-white/80 font-medium">Waffle Timer</span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <button
              onClick={toggleMute}
              className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition-all no-drag"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? (
                <VolumeX className="w-4 h-4 text-white/70" />
              ) : (
                <Volume2 className="w-4 h-4 text-white/70" />
              )}
            </button>

            {/* Music Control */}
            <button
              className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition-all no-drag"
              aria-label="Music"
            >
              <Music className="w-4 h-4 text-white/70" />
            </button>

            {/* Sticky Note */}
            <button
              onClick={openNoteWindow}
              className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition-all no-drag"
              aria-label="Open sticky note"
            >
              <StickyNote className="w-4 h-4 text-white/70" />
            </button>

            {/* Collapse */}
            <button
              onClick={toggleCollapse}
              className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition-all no-drag"
              aria-label="Collapse"
            >
              <ChevronUp className="w-4 h-4 text-white/70" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Timer Section */}
          <div className="flex-shrink-0 border-b border-white/10">
            <Timer />
          </div>

          {/* Todo Section */}
          <div className="flex-1 overflow-hidden">
            <TodoList />
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 text-center">
          <p className="text-xs text-white/40">
            Stay focused, one waffle at a time 🧇
          </p>
        </div>
      </div>
    </div>
  );
};
