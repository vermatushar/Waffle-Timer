import { create } from 'zustand';

export type TimerState = 'idle' | 'running' | 'paused' | 'completed';

interface TimerStore {
  // State
  duration: number; // Duration in seconds (default 50 minutes)
  remaining: number; // Remaining time in seconds
  state: TimerState;
  lastTick: number | null;
  
  // Actions
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  setDuration: (seconds: number) => void;
  complete: () => void;
}

const DEFAULT_DURATION = 50 * 60; // 50 minutes in seconds

export const useTimerStore = create<TimerStore>((set, get) => ({
  duration: DEFAULT_DURATION,
  remaining: DEFAULT_DURATION,
  state: 'idle',
  lastTick: null,

  start: () => {
    const state = get().state;
    if (state === 'idle' || state === 'paused') {
      set({ 
        state: 'running',
        lastTick: Date.now()
      });
    }
  },

  pause: () => {
    const state = get().state;
    if (state === 'running') {
      set({ state: 'paused' });
    }
  },

  reset: () => {
    const duration = get().duration;
    set({
      remaining: duration,
      state: 'idle',
      lastTick: null
    });
  },

  tick: () => {
    const { state, remaining, lastTick } = get();
    
    if (state !== 'running' || !lastTick) return;
    
    const now = Date.now();
    const elapsed = Math.floor((now - lastTick) / 1000);
    
    if (elapsed >= 1) {
      const newRemaining = Math.max(0, remaining - elapsed);
      
      if (newRemaining === 0) {
        get().complete();
      } else {
        set({
          remaining: newRemaining,
          lastTick: now
        });
      }
    }
  },

  setDuration: (seconds: number) => {
    set({
      duration: seconds,
      remaining: seconds,
      state: 'idle',
      lastTick: null
    });
  },

  complete: () => {
    set({
      state: 'completed',
      remaining: 0
    });
    
    // Play completion sound
    const audio = new Audio('/chime.mp3');
    audio.play().catch(console.error);
    
    // Auto-reset after 2 seconds
    setTimeout(() => {
      get().reset();
    }, 2000);
  }
}));
