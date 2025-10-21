import { create } from 'zustand';

interface Note {
  id: string;
  content: string;
  updated_at: number;
}

interface NoteStore {
  notes: Map<string, Note>;
  activeNoteId: string | null;
  
  // Actions
  loadNote: (id: string) => Promise<void>;
  saveNote: (id: string, content: string) => Promise<void>;
  setActiveNote: (id: string | null) => void;
  openNoteWindow: () => Promise<void>;
}

// Browser-compatible fallback
const useTauriOrFallback = async (command: string, args?: any) => {
  if (typeof window !== 'undefined' && window.__TAURI__) {
    const { invoke } = await import('@tauri-apps/api/core');
    return invoke(command, args);
  }
  
  // Fallback to localStorage
  const STORAGE_KEY = 'waffle-notes';
  
  switch (command) {
    case 'get_note': {
      const stored = localStorage.getItem(`${STORAGE_KEY}-${args.id}`);
      return stored ? JSON.parse(stored) : null;
    }
    
    case 'save_note': {
      const note: Note = {
        id: args.id,
        content: args.content,
        updated_at: Date.now()
      };
      localStorage.setItem(`${STORAGE_KEY}-${args.id}`, JSON.stringify(note));
      return note;
    }
    
    case 'open_note_window': {
      // In browser mode, we'll just create a new section in the UI
      console.log('Opening note in browser mode - would open in same window');
      return;
    }
    
    default:
      console.log(`Command ${command} not available in browser mode`);
  }
};

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: new Map(),
  activeNoteId: null,

  loadNote: async (id: string) => {
    try {
      const note = await useTauriOrFallback('get_note', { id }) as Note | null;
      if (note) {
        set(state => {
          const newNotes = new Map(state.notes);
          newNotes.set(id, note);
          return { notes: newNotes };
        });
      }
    } catch (error) {
      console.error('Failed to load note:', error);
    }
  },

  saveNote: async (id: string, content: string) => {
    try {
      const note = await useTauriOrFallback('save_note', { id, content }) as Note;
      set(state => {
        const newNotes = new Map(state.notes);
        newNotes.set(id, note);
        return { notes: newNotes };
      });
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  },

  setActiveNote: (id: string | null) => {
    set({ activeNoteId: id });
  },

  openNoteWindow: async () => {
    try {
      await useTauriOrFallback('open_note_window');
    } catch (error) {
      console.error('Failed to open note window:', error);
    }
  }
}));