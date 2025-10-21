import { create } from 'zustand';

interface Settings {
  muted: boolean;
  collapsed: boolean;
  theme: string;
}

interface UiStore {
  collapsed: boolean;
  muted: boolean;
  theme: string;
  
  // Actions
  toggleCollapse: () => Promise<void>;
  toggleMute: () => void;
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
      return stored ? JSON.parse(stored) : { muted: false, collapsed: false, theme: 'dark' };
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
  collapsed: false,
  muted: false,
  theme: 'dark',

  toggleCollapse: async () => {
    const newCollapsed = !get().collapsed;
    set({ collapsed: newCollapsed });
    
    try {
      await useTauriOrFallback('toggle_window_size', { collapsed: newCollapsed });
      await get().saveSettings();
    } catch (error) {
      console.error('Failed to toggle window size:', error);
    }
  },

  toggleMute: () => {
    set(state => ({ muted: !state.muted }));
    get().saveSettings();
  },

  loadSettings: async () => {
    try {
      const settings = await useTauriOrFallback('get_settings') as Settings;
      set({
        muted: settings.muted,
        collapsed: settings.collapsed,
        theme: settings.theme
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  },

  saveSettings: async () => {
    const { muted, collapsed, theme } = get();
    try {
      await useTauriOrFallback('save_settings', {
        settings: { muted, collapsed, theme }
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }
}));