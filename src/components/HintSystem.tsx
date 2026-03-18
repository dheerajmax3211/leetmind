import React, { useState } from 'react';
import { Lightbulb, ChevronRight, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HintSystemProps {
  problemTitle: string;
  approach: string;
}

export function HintSystem({ problemTitle, approach }: HintSystemProps) {
  const [hintsUnlocked, setHintsUnlocked] = useState(0);

  const getHintText = (level: number) => {
    switch (level) {
      case 1:
        return `Think about using the ${approach} pattern. What data structures are commonly associated with ${approach}?`;
      case 2:
        return `The core insight here is that you need to try tracking state. For ${problemTitle}, how can a simple map or multiple pointers help you avoid O(N^2) time?`;
      case 3:
        return `Still stuck? Try setting up a basic loop and maintain two pieces of state: your current best answer, and the running value you just calculated. Update the best answer dynamically.`;
      default:
        return '';
    }
  };

  return (
    <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 mb-12">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" /> Need a hint?
        </h3>
        {hintsUnlocked < 3 && (
          <button
            onClick={() => setHintsUnlocked(prev => prev + 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono text-gray-300 transition-colors"
          >
            Request Hint {hintsUnlocked + 1} <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((level) => {
          const isUnlocked = level <= hintsUnlocked;
          return (
            <div key={level} className={`relative rounded-xl border p-4 transition-all duration-300 ${isUnlocked ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-white/5 bg-[#1a1a1a]'}`}>
              {!isUnlocked && (
                <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[2px] rounded-xl text-gray-500 gap-2 font-mono text-sm">
                  <Lock className="w-4 h-4" /> Hint {level} Locked
                </div>
              )}
              <div className={`flex gap-3 ${!isUnlocked && 'opacity-20 blur-[2px] select-none'}`}>
                <div className="w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-xs font-bold shrink-0">
                  {level}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed font-sans">
                  {getHintText(level)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
