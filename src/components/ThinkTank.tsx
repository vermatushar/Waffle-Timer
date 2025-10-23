import React from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useThinkTankStore } from '../store/useThinkTankStore';

export const ThinkTank: React.FC = () => {
  const { 
    ideas, 
    currentIdea, 
    isOpen,
    addIdea, 
    removeIdea, 
    clearIdeas,
    setCurrentIdea,
    closeThinkTank 
  } = useThinkTankStore();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addIdea(currentIdea);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-[250px] max-h-[320px] rounded-xl
                      bg-black/80 backdrop-blur-2xl border border-white/10
                      shadow-2xl p-4">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white/80">Think Tank</h3>
          <button
            onClick={closeThinkTank}
            className="w-5 h-5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06]
                     flex items-center justify-center transition-all"
            aria-label="Close"
          >
            <X className="w-3 h-3 text-white/40" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-3">
          <div className="flex gap-1">
            <input
              type="text"
              value={currentIdea}
              onChange={(e) => setCurrentIdea(e.target.value)}
              placeholder="Capture your idea..."
              className="flex-1 px-2 py-1.5 text-xs rounded-lg
                       bg-white/[0.03] border border-white/10
                       text-white placeholder-white/30
                       focus:outline-none focus:border-white/20"
              autoFocus
            />
            <button
              type="submit"
              className="w-7 h-7 rounded-lg bg-amber-500/10 hover:bg-amber-500/20
                       flex items-center justify-center transition-all"
              aria-label="Add idea"
            >
              <Plus className="w-3 h-3 text-amber-400" />
            </button>
          </div>
        </form>

        {/* Ideas List */}
        <div className="max-h-[200px] overflow-y-auto space-y-1 mb-2">
          {ideas.length === 0 ? (
            <p className="text-[10px] text-white/30 text-center py-4">
              No ideas yet. Start capturing!
            </p>
          ) : (
            ideas.map((idea, index) => (
              <div
                key={index}
                className="group flex items-start gap-2 p-2 rounded-lg
                         bg-white/[0.02] hover:bg-white/[0.04] transition-all"
              >
                <p className="flex-1 text-xs text-white/70 break-words">
                  {idea}
                </p>
                <button
                  onClick={() => removeIdea(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity
                           w-4 h-4 rounded bg-red-500/10 hover:bg-red-500/20
                           flex items-center justify-center"
                  aria-label="Remove idea"
                >
                  <Trash2 className="w-2.5 h-2.5 text-red-400/60" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Clear All Button */}
        {ideas.length > 0 && (
          <button
            onClick={clearIdeas}
            className="w-full py-1 text-[10px] rounded-lg
                     bg-red-500/10 hover:bg-red-500/20
                     text-red-400/60 transition-all"
          >
            Clear All Ideas
          </button>
        )}
      </div>
    </div>
  );
};
