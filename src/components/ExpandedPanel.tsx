import React, { useState } from 'react';
import { TimerCard } from './TimerCard';
import { TodoList } from './TodoList';

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
      {/* Main Panel - Glass morphism effect */}
      <div className="w-full h-full max-w-[360px] max-h-[480px] rounded-2xl overflow-hidden relative
                      bg-gradient-to-br from-gray-900/30 to-gray-800/30
                      backdrop-blur-2xl backdrop-saturate-150
                      border border-white/10
                      shadow-[0_20px_70px_rgba(0,0,0,0.3)]
                      before:absolute before:inset-0 
                      before:bg-gradient-to-br before:from-white/5 before:to-transparent
                      before:pointer-events-none">
        
        {/* Invisible draggable header strip - 12px height */}
        <div className="h-3 w-full absolute top-0 left-0 z-50 drag-region" />
        
        {/* Content Container */}
        <div className="h-full flex flex-col p-3 pt-4">
          {/* Todo Section - Top */}
          <div className="flex-1 min-h-0 mb-2 overflow-hidden animate-slideUp">
            <TodoList 
              showStickyNote={showStickyNote}
              onToggleStickyNote={() => setShowStickyNote(!showStickyNote)}
              stickyNoteContent={stickyNoteContent}
              onStickyNoteChange={handleStickyNoteChange}
            />
          </div>

          {/* Timer Section - Compact */}
          <div className="flex-shrink-0 mb-2 animate-slideUp animation-delay-100">
            <TimerCard />
          </div>

          {/* Footer Motto */}
          <div className="text-center pb-1 animate-fadeIn animation-delay-200">
            <p className="text-[10px] text-white/40 font-light">
              Stay focused, one waffle at a time xD
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};