import React, { useEffect, useState } from 'react';
import { Plus, X, Circle, CheckCircle, StickyNote } from 'lucide-react';
import { useTodoStore } from '../store/useTodoStore';
import { clsx } from 'clsx';
import { playClickSound } from '../utils/soundUtils';

interface TodoListProps {
  showStickyNote?: boolean;
  onToggleStickyNote?: () => void;
  stickyNoteContent?: string;
  onStickyNoteChange?: (content: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ 
  showStickyNote = false,
  onToggleStickyNote,
  stickyNoteContent = '',
  onStickyNoteChange
}) => {
  const { todos, loadTodos, addTodo, toggleTodo, deleteTodo } = useTodoStore();
  const [newTodoText, setNewTodoText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleAddTodo = async () => {
    if (newTodoText.trim()) {
      await addTodo(newTodoText);
      setNewTodoText('');
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    } else if (e.key === 'Escape') {
      setNewTodoText('');
      setIsAdding(false);
    }
  };

  const completedCount = todos.filter(t => t.done).length;
  const totalCount = todos.length;

  return (
    <div className="flex flex-col h-full">
      {/* Header - Compact */}
      <div className="flex items-center justify-between mb-2 relative z-20">
        <div>
          <h3 className="text-xs font-medium text-white/60">
            Today's Focus
          </h3>
          {totalCount > 0 && (
            <p className="text-[9px] text-white/30 mt-0.5">
              {completedCount} of {totalCount} complete
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 relative z-30">
          {onToggleStickyNote && (
            <button
              onClick={() => {
                playClickSound();
                onToggleStickyNote();
              }}
              className={clsx(
                "w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 relative z-30",
                showStickyNote 
                  ? "bg-amber-500/15 text-amber-400/90" 
                  : "bg-white/5 hover:bg-white/10 text-white/40"
              )}
              aria-label="Toggle sticky note"
              tabIndex={5}
              style={{ pointerEvents: 'auto' }}
            >
              <StickyNote className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={() => {
              playClickSound();
              setIsAdding(true);
            }}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10
                     flex items-center justify-center transition-all duration-300 hover:scale-110 relative z-30"
            aria-label="Add todo"
            tabIndex={6}
            style={{ pointerEvents: 'auto' }}
          >
            <Plus className="w-3 h-3 text-white/50" />
          </button>
        </div>
      </div>

      {/* Progress Bar - Thinner */}
      {totalCount > 0 && (
        <div className="h-0.5 bg-white/5 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-gradient-to-r from-amber-400/70 to-amber-600/70 transition-all duration-700 ease-out"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      )}

      {/* Sticky Note - Compact */}
      {showStickyNote && (
        <div className="mb-2 p-2 rounded-lg bg-amber-400/10 border border-amber-500/15 
                        animate-fadeIn backdrop-blur-sm">
          <textarea
            value={stickyNoteContent}
            onChange={(e) => onStickyNoteChange?.(e.target.value)}
            placeholder="Quick notes..."
            className="w-full h-12 bg-transparent text-[11px] text-white/70 placeholder-white/25 
                     resize-none outline-none"
          />
        </div>
      )}

      {/* Todo Items - Compact with smooth animations */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {todos.length === 0 && !isAdding ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-6 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2
                          backdrop-blur-sm">
              <Circle className="w-6 h-6 text-white/15" />
            </div>
            <p className="text-white/30 text-xs">No tasks yet</p>
            <p className="text-white/20 text-[10px] mt-0.5">Click + to add your first task</p>
          </div>
        ) : (
          <>
            {/* Add New Todo Input */}
            {isAdding && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 
                            animate-slideUp backdrop-blur-sm">
                <Circle className="w-3.5 h-3.5 text-white/25 flex-shrink-0" />
                <input
                  type="text"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  onBlur={() => {
                    if (!newTodoText.trim()) {
                      setIsAdding(false);
                    }
                  }}
                  placeholder="What needs to be done?"
                  className="flex-1 bg-transparent text-xs text-white/80 placeholder-white/25 outline-none"
                  autoFocus
                />
              </div>
            )}

            {/* Todo List with stagger animation */}
            {todos.map((todo, index) => (
              <div
                key={todo.id}
                className="group flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]
                         hover:bg-white/5 transition-all duration-300 animate-slideUp backdrop-blur-sm"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => {
                    playClickSound();
                    toggleTodo(todo.id);
                  }}
                  className="flex-shrink-0 hover:scale-110 transition-transform duration-200 relative z-30"
                  aria-label={todo.done ? "Mark as incomplete" : "Mark as complete"}
                  style={{ pointerEvents: 'auto' }}
                >
                  {todo.done ? (
                    <CheckCircle className="w-3.5 h-3.5 text-amber-500/80 fill-amber-500/15" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-white/25 hover:text-white/40 transition-colors" />
                  )}
                </button>
                
                <span
                  className={clsx(
                    "flex-1 text-xs transition-all select-none",
                    todo.done
                      ? "text-white/20 line-through"
                      : "text-white/60"
                  )}
                >
                  {todo.text}
                </span>

                <button
                  onClick={() => {
                    playClickSound();
                    deleteTodo(todo.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center 
                           hover:bg-white/10 transition-all duration-300 hover:scale-110 relative z-30"
                  aria-label="Delete"
                  style={{ pointerEvents: 'auto' }}
                >
                  <X className="w-2.5 h-2.5 text-white/25" />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};