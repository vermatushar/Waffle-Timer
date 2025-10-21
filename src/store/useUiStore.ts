import { create } from 'zustand';

interface Settings {
  muted: boolean;
  collapsed: boolean;
  theme: string;
  selectedMusic: string | null;
}

interface UiStore {
  collapsed: boolean;
  muted: boolean;
  theme: string;
  selectedMusic: string | null;
  
  // Actions
  collapse: () => void;
  expand: () => void;
  toggle: () => void;
  toggleMute: () => void;
  setSelectedMusic: (music: string | null) => void;
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
}

// Browser-compatible fallback
const useTauriOrFallback = async (command: string, args?: any) => {
  if (typeof window !== 'undefined' && window.__TAURI__) {
    const { invoke } = await import('@tauri-apps/api/core');
    return invoke(command, args);
  }
  
  // Fallback to localStorage
  const STORAGE_KEY = 'waffle-settings';
  
  switch (command) {
    case 'get_settings': {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { 
        muted: true, // Default muted
        collapsed: false, // Default expanded to see the app
        theme: 'dark',
        selectedMusic: null 
      };
    }
    
    case 'save_settings': {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(args.settings));
      return;
    }
    
    case 'toggle_window_size': {
      // In browser, we can't actually resize the window
      console.log('Window resize not available in browser mode');
      return;
    }
    
    default:
      console.log(`Command ${command} not available in browser mode`);
  }
};

export const useUiStore = create<UiStore>((set, get) => ({
  collapsed: false, // Default to expanded to see the app properly
  muted: true, // Default muted
  theme: 'dark',
  selectedMusic: null,

  collapse: async () => {
    set({ collapsed: true });
    try {
      await useTauriOrFallback('toggle_window_size', { collapsed: true });
      await get().saveSettings();
    } catch (error) {
      console.error('Failed to collapse window:', error);
    }
  },

  expand: async () => {
    set({ collapsed: false });
    try {
      await useTauriOrFallback('toggle_window_size', { collapsed: false });
      await get().saveSettings();
    } catch (error) {
      console.error('Failed to expand window:', error);
    }
  },

  toggle: async () => {
    const newCollapsed = !get().collapsed;
    if (newCollapsed) {
      await get().collapse();
    } else {
      await get().expand();
    }
  },

  toggleMute: () => {
    set(state => ({ muted: !state.muted }));
    get().saveSettings();
  },

  setSelectedMusic: (music: string | null) => {
    set({ selectedMusic: music });
    get().saveSettings();
  },

  loadSettings: async () => {
    try {
      const settings = await useTauriOrFallback('get_settings') as Settings;
      set({
        muted: settings.muted ?? true,
        collapsed: settings.collapsed ?? false,
        theme: settings.theme ?? 'dark',
        selectedMusic: settings.selectedMusic ?? null
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  },

  saveSettings: async () => {
    const { muted, collapsed, theme, selectedMusic } = get();
    try {
      await useTauriOrFallback('save_settings', {
        settings: { muted, collapsed, theme, selectedMusic }
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }
}));