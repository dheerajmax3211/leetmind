import React, { useState } from 'react';
import { AnimatedPage } from './AnimatedPage';
import { BookOpen, Search, ArrowRight, Zap, Play } from 'lucide-react';
import { PATTERNS } from '../data/patterns';
import { motion, AnimatePresence } from 'motion/react';

export function PatternLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activePattern, setActivePattern] = useState<string | null>(null);

  const categories = Array.from(new Set(PATTERNS.map(p => p.category)));

  const filteredPatterns = PATTERNS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.classicProblems.some(cp => cp.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--color-accent)]/10 rounded-xl text-[var(--color-accent)]">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white">Pattern Library</h1>
              <p className="text-gray-400 font-mono mt-1 text-sm">Master the 15 core algorithmic patterns</p>
            </div>
          </div>
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search patterns or problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white font-mono text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full font-mono text-xs transition-all ${
              selectedCategory === null 
                ? 'bg-[var(--color-accent)] text-black font-bold' 
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            All Patterns
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-mono text-xs transition-all ${
                selectedCategory === cat 
                  ? 'bg-[var(--color-accent)] text-black font-bold' 
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPatterns.map(pattern => (
              <motion.div
                key={pattern.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 hover:border-[var(--color-accent)]/50 transition-all group flex flex-col"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl group-hover:bg-[var(--color-accent)]/20 transition-colors">
                    {pattern.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-display font-bold text-white mb-1 truncate">{pattern.name}</h3>
                    <span className="inline-block px-2 py-1 rounded text-[10px] font-mono font-bold bg-white/5 text-gray-400">
                      {pattern.category.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1 line-clamp-3">
                  {pattern.description}
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-mono text-[var(--color-accent)] uppercase mb-2">Classic Problems</h4>
                    <ul className="space-y-1.5">
                      {pattern.classicProblems.slice(0, 3).map((prob, idx) => (
                        <li key={idx} className="text-xs text-gray-300 font-mono truncate flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-white/20" /> {prob}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs font-mono text-gray-400">
                        <Zap className="w-3 h-3 text-yellow-500" /> {pattern.complexityOptions.time}
                      </span>
                    </div>
                    <button 
                      onClick={() => setActivePattern(pattern.id)}
                      className="text-[var(--color-accent)] hover:text-white transition-colors flex items-center gap-1 text-sm font-mono"
                    >
                      Study <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPatterns.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-display font-bold text-white mb-2">No patterns found</h3>
            <p className="text-gray-400 font-mono">Try adjusting your search or category filter.</p>
          </div>
        )}

        {/* Detail Modal (Simplified implementation for phase 1) */}
        {activePattern && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setActivePattern(null)}>
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              {(() => {
                const p = PATTERNS.find(x => x.id === activePattern)!;
                return (
                  <div>
                    <div className="p-8 border-b border-white/10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center text-4xl">
                          {p.emoji}
                        </div>
                        <div>
                          <h2 className="text-3xl font-display font-bold text-white">{p.name}</h2>
                          <span className="text-sm font-mono text-[var(--color-accent)]">{p.category}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed text-lg">{p.description}</p>
                    </div>
                    
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-display font-bold text-white mb-4 border-b border-white/10 pb-2">Complexity Setup</h3>
                        <div className="space-y-4">
                          <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5">
                            <p className="text-xs text-gray-500 font-mono mb-1">Time Complexity Focus</p>
                            <p className="text-lg font-mono text-[var(--color-accent)]">{p.complexityOptions.time}</p>
                          </div>
                          <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5">
                            <p className="text-xs text-gray-500 font-mono mb-1">Space Complexity Focus</p>
                            <p className="text-lg font-mono text-[var(--color-accent)]">{p.complexityOptions.space}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-bold text-white mb-4 border-b border-white/10 pb-2">Practice Problems</h3>
                        <div className="space-y-3">
                          {p.classicProblems.map((prob, i) => (
                            <a 
                              key={i}
                              href="#" 
                              onClick={(e) => { 
                                e.preventDefault(); 
                                window.dispatchEvent(new CustomEvent('start-tutor', { detail: { query: prob } })); 
                              }}
                              className="flex items-center justify-between p-4 rounded-xl bg-[#1a1a1a] border border-white/5 hover:border-[var(--color-accent)]/50 transition-colors group"
                            >
                              <span className="font-mono text-sm text-gray-300 group-hover:text-white">{prob}</span>
                              <Play className="w-4 h-4 text-gray-500 group-hover:text-[var(--color-accent)]" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}

