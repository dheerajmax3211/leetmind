import React, { useState } from 'react';
import { AnimatedPage } from './AnimatedPage';
import { BookA, Search, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { glossaryTerms } from '../data/glossaryData';

export function Glossary() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = glossaryTerms.filter(t => 
    t.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by starting letter
  const groupedTerms = filteredTerms.reduce((acc, current) => {
    const letter = current.term[0].toUpperCase();
    if (!acc[letter]) {
      acc[letter] = [];
    }
    acc[letter].push(current);
    return acc;
  }, {} as Record<string, typeof glossaryTerms>);

  const letters = Object.keys(groupedTerms).sort();

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <BookA className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white">Glossary</h1>
              <p className="text-gray-400 font-mono mt-1 text-sm">Tech terms and concepts defined</p>
            </div>
          </div>
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search concepts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white font-mono text-sm focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-12">
          <AnimatePresence>
            {letters.map((letter) => (
              <motion.div 
                key={letter}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center gap-4 mb-6 sticky top-[80px] z-10 bg-[var(--color-bg)]/90 backdrop-blur pb-2 pt-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-display font-bold text-xl">
                    {letter}
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                </div>
                
                <div className="grid gap-4 pl-0 md:pl-14">
                  {groupedTerms[letter].map((item, idx) => (
                    <div key={idx} className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors group">
                      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <Hash className="w-4 h-4 text-emerald-500/50 group-hover:text-emerald-500 transition-colors" />
                        {item.term}
                      </h3>
                      <p className="text-gray-400 leading-relaxed font-sans">{item.definition}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            {filteredTerms.length === 0 && (
               <div className="text-center py-20">
                 <h3 className="text-xl font-display font-bold text-white mb-2">No terms found</h3>
                 <p className="text-gray-500 font-mono">Try adjusting your search query.</p>
               </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AnimatedPage>
  );
}
