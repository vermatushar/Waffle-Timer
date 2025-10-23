import { create } from 'zustand';

// Import all GIF files from the ducks folder
import cookGif from '/src/assets/ducks/cook.gif';
import cryDuckGif from '/src/assets/ducks/CRY DUCK.gif';
import duGif from '/src/assets/ducks/DU.gif';
import ducGif from '/src/assets/ducks/DUC.gif';
import gifGif from '/src/assets/ducks/GIF.gif';
import napGif from '/src/assets/ducks/nap.gif';
import peckPng from '/src/assets/ducks/peck.png';

const DUCK_GIFS = [cookGif, cryDuckGif, duGif, ducGif, gifGif, napGif];

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
  showTimerCompletionDuck: () => void;
}

export const useDuckStore = create<DuckState>((set, get) => ({
  ducks: DUCK_GIFS.length > 0 ? DUCK_GIFS : [cryDuckGif], // Fallback to CRY DUCK
  currentIndex: 1, // Start with CRY DUCK.gif (index 1 in the array)
  currentUrl: cryDuckGif, // Always start with CRY DUCK.gif
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
    const cryDuckIndex = ducks.findIndex(duck => duck === cryDuckGif);
    set({ 
      currentIndex: cryDuckIndex >= 0 ? cryDuckIndex : 1, 
      currentUrl: cryDuckGif
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
      currentUrl: ducGif,
      isShowingCompletion: true 
    });
    
    // Set timer to revert after 10 seconds
    const timer = setTimeout(() => {
      get().revertToRandomDuck();
    }, 10000);
    
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
  },

  showTimerCompletionDuck: () => {
    const { completionTimer } = get();
    
    // Clear any existing timer
    if (completionTimer) {
      clearTimeout(completionTimer);
    }
    
    // Show the peck.png timer completion image
    set({ 
      currentUrl: peckPng,
      isShowingCompletion: true 
    });
    
    // Set timer to revert after 30 seconds
    const timer = setTimeout(() => {
      get().revertToRandomDuck();
    }, 30000);
    
    set({ completionTimer: timer });
  }
}));
