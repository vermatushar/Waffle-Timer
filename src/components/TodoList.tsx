import React, { useEffect, useState } from 'react';
import { Plus, X, Check } from 'lucide-react';
import { useTodoStore } from '../store/useTodoStore';
import { clsx } from 'clsx';

export const TodoList: React.FC = () => {
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

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
          To-dos
        </h3>
        <button
          onClick={() => setIsAdding(true)}
          className="w-7 h-7 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition-all no-drag"
          aria-label="Add todo"
        >
          <Plus className="w-4 h-4 text-white/70" />
        </button>
      </div>

      {/* Todo Items */}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {todos.length === 0 && !isAdding ? (
          <div className="text-center py-8 text-white/40 text-sm">
            No todos for today
          </div>
        ) : (
          <>
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="group flex items-center gap-3 p-2.5 rounded-lg glass-surface hover:bg-white/5 transition-all"
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={clsx(
                    "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all no-drag",
                    todo.done
                      ? "bg-amber-500 border-amber-500"
                      : "border-white/30 hover:border-white/50"
                  )}
                  aria-label={todo.done ? "Mark as incomplete" : "Mark as complete"}
                >
                  {todo.done && <Check className="w-3 h-3 text-white" />}
                </button>
                
                <span
                  className={clsx(
                    "flex-1 text-sm transition-all",
                    todo.done
                      ? "text-white/40 line-through"
                      : "text-white/90"
                  )}
                >
                  {todo.text}
                </span>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md flex items-center justify-center hover:bg-white/10 transition-all no-drag"
                  aria-label="Delete todo"
                >
                  <X className="w-3.5 h-3.5 text-white/60" />
                </button>
              </div>
            ))}
          </>
        )}

        {/* Add New Todo Input */}
        {isAdding && (
          <div className="flex items-center gap-2 p-2 rounded-lg glass-surface">
            <div className="w-5 h-5 rounded-md border-2 border-white/30" />
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
              className="flex-1 bg-transparent text-sm text-white/90 placeholder-white/40 outline-none no-drag"
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
};
