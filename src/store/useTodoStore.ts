import { create } from 'zustand';

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  created_at: number;
}

interface TodoStore {
  todos: TodoItem[];
  loading: boolean;
  
  // Actions
  loadTodos: () => Promise<void>;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

// Browser-compatible fallback using localStorage
const useTauriOrFallback = async (command: string, args?: any) => {
  // Check if we're in Tauri environment
  if (typeof window !== 'undefined' && window.__TAURI__) {
    const { invoke } = await import('@tauri-apps/api/core');
    return invoke(command, args);
  }
  
  // Fallback to localStorage for browser testing
  const STORAGE_KEY = 'waffle-todos';
  const getTodos = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  };
  
  const saveTodos = (todos: TodoItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  };
  
  switch (command) {
    case 'get_todos':
      return getTodos();
      
    case 'add_todo': {
      const todos = getTodos();
      const newTodo: TodoItem = {
        id: Math.random().toString(36).substr(2, 9),
        text: args.text,
        done: false,
        created_at: Date.now()
      };
      todos.push(newTodo);
      saveTodos(todos);
      return newTodo;
    }
    
    case 'toggle_todo': {
      const todos = getTodos();
      const todo = todos.find((t: Todo) => t.id === args.id);
      if (todo) {
        todo.done = !todo.done;
        saveTodos(todos);
        return todo;
      }
      throw new Error('Todo not found');
    }
    
    case 'delete_todo': {
      const todos = getTodos();
      const filtered = todos.filter((t: Todo) => t.id !== args.id);
      saveTodos(filtered);
      return;
    }
    
    default:
      throw new Error(`Unknown command: ${command}`);
  }
};

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  loading: false,

  loadTodos: async () => {
    set({ loading: true });
    try {
      const todos = await useTauriOrFallback('get_todos') as TodoItem[];
      set({ todos, loading: false });
    } catch (error) {
      console.error('Failed to load todos:', error);
      set({ loading: false });
    }
  },

  addTodo: async (text: string) => {
    if (!text.trim()) return;
    
    try {
      const newTodo = await useTauriOrFallback('add_todo', { text: text.trim() }) as TodoItem;
      set(state => ({
        todos: [...state.todos, newTodo]
      }));
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  },

  toggleTodo: async (id: string) => {
    try {
      const updatedTodo = await useTauriOrFallback('toggle_todo', { id }) as TodoItem;
      set(state => ({
        todos: state.todos.map(todo => 
          todo.id === id ? updatedTodo : todo
        )
      }));
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  },

  deleteTodo: async (id: string) => {
    try {
      await useTauriOrFallback('delete_todo', { id });
      set(state => ({
        todos: state.todos.filter(todo => todo.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  }
}));