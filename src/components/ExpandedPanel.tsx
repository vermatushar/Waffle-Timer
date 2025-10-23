import React, { useState } from 'react';
import { TimerCard } from './TimerCard';
import { TodoList } from './TodoList';
import { ThinkTank } from './ThinkTank';

export const ExpandedPanel: React.FC = () => {
  const [showStickyNote, setShowStickyNote] = useState(false);
  const [stickyNoteContent, setStickyNoteContent] = useState(() => 
    localStorage.getItem('waffle-sticky-note') || ''
  );

  const handleStickyNoteChange = (content: string) => {
    setStickyNoteContent(content);
    localStorage.setItem('waffle-sticky-note', content);
  };

  return (
    <div className="w-full h-full flex items-center justify-center animate-fadeIn">
      {/* Main Panel - Darker Glass morphism effect */}
      <div className="w-full h-full rounded-2xl overflow-hidden relative
                      bg-gradient-to-br from-black/70 to-black/60
                      backdrop-blur-2xl backdrop-saturate-150
                      border border-white/5
                      shadow-[0_20px_70px_rgba(0,0,0,0.7)]
                      before:absolute before:inset-0 
                      before:bg-gradient-to-br before:from-white/[0.02] before:to-transparent
                      before:pointer-events-none">
        
        {/* Draggable header area */}
        <div className="absolute top-0 left-0 right-0 h-8 z-50" data-tauri-drag-region />
        
        {/* Content Container */}
        <div className="h-full flex flex-col p-2">
          {/* Todo Section - Top */}
          <div className="flex-1 min-h-0 mb-1.5 overflow-hidden animate-slideUp">
            <TodoList 
              showStickyNote={showStickyNote}
              onToggleStickyNote={() => setShowStickyNote(!showStickyNote)}
              stickyNoteContent={stickyNoteContent}
              onStickyNoteChange={handleStickyNoteChange}
            />
          </div>

          {/* Timer Section - Compact */}
          <div className="flex-shrink-0 mb-1 animate-slideUp animation-delay-100">
            <TimerCard />
          </div>

          {/* Footer Motto */}
          <div className="text-center pb-0.5 animate-fadeIn animation-delay-200">
            <p className="text-[9px] text-white/30 font-light">
              Stay focused, one waffle at a time xD
            </p>
          </div>
        </div>
      </div>
      
      {/* Think Tank Overlay */}
      <ThinkTank />
    </div>
  );
};