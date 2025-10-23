import React from 'react';
import { useTimerStore } from '../store/useTimerStore';
import { DuckAvatar } from './DuckAvatar';

export const CollapsedIcon: React.FC = () => {
  const { duration, remaining, state } = useTimerStore();
  
  // Calculate progress for the circle
  const progress = 1 - (remaining / duration);

  return (
    <div className="w-full h-full flex items-center justify-center p-2" data-tauri-drag-region>
      <DuckAvatar progress={progress} state={state} />
    </div>
  );
};