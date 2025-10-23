import { create } from 'zustand';

interface ThinkTankStore {
  ideas: string[];
  currentIdea: string;
  isOpen: boolean;
  
  // Actions
  addIdea: (idea: string) => void;
  removeIdea: (index: number) => void;
  clearIdeas: () => void;
  setCurrentIdea: (idea: string) => void;
  toggleThinkTank: () => void;
  openThinkTank: () => void;
  closeThinkTank: () => void;
}

export const useThinkTankStore = create<ThinkTankStore>((set) => ({
  ideas: [],
  currentIdea: '',
  isOpen: false,
  
  addIdea: (idea: string) => {
    if (idea.trim()) {
      set((state) => ({
        ideas: [...state.ideas, idea.trim()],
        currentIdea: ''
      }));
    }
  },
  
  removeIdea: (index: number) => {
    set((state) => ({
      ideas: state.ideas.filter((_, i) => i !== index)
    }));
  },
  
  clearIdeas: () => {
    set({ ideas: [], currentIdea: '' });
  },
  
  setCurrentIdea: (idea: string) => {
    set({ currentIdea: idea });
  },
  
  toggleThinkTank: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },
  
  openThinkTank: () => {
    set({ isOpen: true });
  },
  
  closeThinkTank: () => {
    set({ isOpen: false });
  }
}));
