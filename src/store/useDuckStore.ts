import { create } from 'zustand';

// Dynamically import all GIF files from the ducks folder
const modules = import.meta.glob('/src/assets/ducks/*.gif', { eager: true, query: '?url', import: 'default' });
const DUCK_GIFS = Object.values(modules) as string[];

interface DuckState {
  ducks: string[];
  currentIndex: number;
  currentUrl: string;
  isShowingCompletion: boolean;
  completionTimer: number | null;
  nextDuck: () => void;
  resetDuck: () => void;
  getDuckUrl: () => string;
  showCompletionDuck: () => void;
  revertToRandomDuck: () => void;
}

export const useDuckStore = create<DuckState>((set, get) => ({
  ducks: DUCK_GIFS.length > 0 ? DUCK_GIFS : ['/src/assets/ducks/DUC.gif'], // Fallback to a default
  currentIndex: 0,
  currentUrl: DUCK_GIFS[0] || '/src/assets/ducks/DUC.gif',
  isShowingCompletion: false,
  completionTimer: null,
  
  nextDuck: () => {
    const { ducks, currentIndex } = get();
    const nextIndex = (currentIndex + 1) % ducks.length;
    set({ 
      currentIndex: nextIndex, 
      currentUrl: ducks[nextIndex] 
    });
  },
  
  resetDuck: () => {
    const { ducks } = get();
    set({ 
      currentIndex: 0, 
      currentUrl: ducks[0] || '/src/assets/ducks/DUC.gif'
    });
  },
  
  getDuckUrl: () => {
    return get().currentUrl;
  },

  showCompletionDuck: () => {
    const { completionTimer } = get();
    
    // Clear any existing timer
    if (completionTimer) {
      clearTimeout(completionTimer);
    }
    
    // Show the DUC.gif completion animation
    set({ 
      currentUrl: '/src/assets/ducks/DUC.gif',
      isShowingCompletion: true 
    });
    
    // Set timer to revert after 30 seconds
    const timer = setTimeout(() => {
      get().revertToRandomDuck();
    }, 30000);
    
    set({ completionTimer: timer });
  },

  revertToRandomDuck: () => {
    const { ducks } = get();
    const randomIndex = Math.floor(Math.random() * ducks.length);
    set({ 
      currentIndex: randomIndex,
      currentUrl: ducks[randomIndex],
      isShowingCompletion: false,
      completionTimer: null
    });
  }
}));
