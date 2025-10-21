import React, { useEffect, useState } from 'react';
import { Plus, X, Check, Circle, CheckCircle, Sparkles } from 'lucide-react';
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

  const completedCount = todos.filter(t => t.done).length;
  const totalCount = todos.length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
            Today's Focus
          </h3>
          {totalCount > 0 && (
            <p className="text-xs text-white/40 mt-0.5">
              {completedCount} of {totalCount} completed
            </p>
          )}
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="btn-icon w-9 h-9 no-drag bg-gradient-to-br from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20"
          aria-label="Add todo"
        >
          <Plus className="w-4 h-4 text-amber-400" />
        </button>
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500 ease-out"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      )}

      {/* Todo Items */}
      <div className="flex-1 overflow-y-auto -mx-2 px-2 space-y-2">
        {todos.length === 0 && !isAdding ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Sparkles className="w-10 h-10 text-white/20" />
            </div>
            <p className="text-white/40 text-sm">No todos for today</p>
            <p className="text-white/30 text-xs mt-1">Add your first task to get started</p>
          </div>
        ) : (
          <>
            {/* Add New Todo Input */}
            {isAdding && (
              <div className="todo-item group animate-in fade-in slide-in-from-top-1 duration-200">
                <Circle className="w-5 h-5 text-white/30" />
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
                  className="flex-1 bg-transparent text-sm text-white/90 placeholder-white/30 outline-none no-drag"
                  autoFocus
                />
              </div>
            )}

            {/* Todo List */}
            {todos.map((todo, index) => (
              <div
                key={todo.id}
                className="todo-item group"
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="flex-shrink-0 no-drag"
                  aria-label={todo.done ? "Mark as incomplete" : "Mark as complete"}
                >
                  {todo.done ? (
                    <CheckCircle className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-white/30 hover:text-white/50 transition-colors" />
                  )}
                </button>
                
                <span
                  className={clsx(
                    "flex-1 text-sm transition-all select-none",
                    todo.done
                      ? "text-white/30 line-through"
                      : "text-white/80"
                  )}
                >
                  {todo.text}
                </span>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 transition-all no-drag"
                  aria-label="Delete todo"
                >
                  <X className="w-3.5 h-3.5 text-white/40 hover:text-white/60" />
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Motivational Quote */}
      {todos.length > 0 && completedCount === totalCount && totalCount > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-400/90 text-center">
            🎉 All tasks completed! Great job!
          </p>
        </div>
      )}
    </div>
  );
};