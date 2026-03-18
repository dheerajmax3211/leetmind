import React, { useState, useEffect } from 'react';
import { AnimatedPage } from './AnimatedPage';
import { Target, CheckCircle2, Circle, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { TRACKS } from '../data/tracks';

export function CuratedTracks() {
  const [activeTrack, setActiveTrack] = useState(TRACKS[0].id);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(TRACKS[0].categories.map(c => c.name)));

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('leetmind_completed_tracks');
    if (saved) {
      try {
        setCompletedIds(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error("Failed to parse completed tracks", e);
      }
    }
  }, []);

  const toggleProblem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      
      localStorage.setItem('leetmind_completed_tracks', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const toggleCategory = (catName: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(catName)) next.delete(catName);
      else next.add(catName);
      return next;
    });
  };

  const currentTrack = TRACKS.find(t => t.id === activeTrack)!;

  // Calculate stats
  let totalProblems = 0;
  let completedProblems = 0;
  currentTrack.categories.forEach(cat => {
    cat.problems.forEach(p => {
      totalProblems++;
      if (completedIds.has(p.id)) completedProblems++;
    });
  });
  const progressPercent = totalProblems === 0 ? 0 : Math.round((completedProblems / totalProblems) * 100);

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--color-secondary)]/10 rounded-xl text-[var(--color-secondary)]">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white">Study Tracks</h1>
              <p className="text-gray-400 font-mono mt-1 text-sm">Curated lists to structure your prep</p>
            </div>
          </div>
          
          <div className="flex gap-2 bg-[#1a1a1a] p-1.5 rounded-xl border border-white/10 overflow-x-auto no-scrollbar mask-edges min-w-max">
            {TRACKS.map(track => (
              <button
                key={track.id}
                onClick={() => {
                  setActiveTrack(track.id);
                  setExpandedCategories(new Set(track.categories.map(c => c.name)));
                }}
                className={`px-4 py-2 rounded-lg font-mono text-sm transition-all whitespace-nowrap ${
                  activeTrack === track.id 
                    ? 'bg-white/10 text-white font-bold' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {track.name}
              </button>
            ))}
          </div>
        </div>

        {/* Track Header & Progress */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-transparent border border-white/10 rounded-2xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-secondary)]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <h2 className="text-2xl font-display font-bold text-white mb-2">{currentTrack.name}</h2>
          <p className="text-gray-400 leading-relaxed mb-8 max-w-2xl">{currentTrack.description}</p>
          
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="font-mono text-sm text-gray-400">Track Progress</span>
              <span className="font-display font-bold text-xl text-[var(--color-secondary)]">{progressPercent}%</span>
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)] transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-xs font-mono text-gray-500 mt-2 text-right">{completedProblems} of {totalProblems} completed</p>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-4">
          {currentTrack.categories.map(category => {
            const isExpanded = expandedCategories.has(category.name);
            const catCompleted = category.problems.filter(p => completedIds.has(p.id)).length;
            const catTotal = category.problems.length;
            const isAllCompleted = catCompleted === catTotal && catTotal > 0;

            return (
              <div key={category.name} className="border border-white/10 rounded-2xl overflow-hidden bg-[#0a0a0a]">
                {/* Category Header */}
                <button 
                  onClick={() => toggleCategory(category.name)}
                  className="w-full flex items-center justify-between p-6 bg-[#111] hover:bg-[#151515] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    <h3 className={`text-lg font-display font-bold ${isAllCompleted ? 'text-[var(--color-secondary)]' : 'text-white'}`}>
                      {category.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-gray-500">{catCompleted} / {catTotal}</span>
                    <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${isAllCompleted ? 'bg-[var(--color-secondary)]' : 'bg-gray-500'}`}
                        style={{ width: `${(catCompleted / catTotal) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </button>

                {/* Problems List */}
                {isExpanded && (
                  <div className="divide-y divide-white/5 border-t border-white/5">
                    {category.problems.map(problem => {
                      const isCompleted = completedIds.has(problem.id);
                      return (
                        <div key={problem.id} className="flex items-center justify-between p-4 pl-6 md:pl-16 hover:bg-white/5 transition-colors group">
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={(e) => toggleProblem(problem.id, e)}
                              className="focus:outline-none shrink-0"
                            >
                              {isCompleted 
                                ? <CheckCircle2 className="w-6 h-6 text-[var(--color-secondary)]" /> 
                                : <Circle className="w-6 h-6 text-gray-600 hover:text-gray-400" />
                              }
                            </button>
                            <span className={`font-mono text-sm md:text-base ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                              {problem.title}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${
                              problem.difficulty === 'Easy' ? 'text-green-400 bg-green-400/10' :
                              problem.difficulty === 'Medium' ? 'text-yellow-400 bg-yellow-400/10' :
                              'text-red-400 bg-red-400/10'
                            }`}>
                              {problem.difficulty}
                            </span>
                            
                            <button 
                              onClick={() => { location.hash = ''; setTimeout(() => { alert(`In a full flow, this would pre-fill "${problem.title}" into the InputStudio and start the AI tutor.`); }, 100); }}
                              className="p-2 rounded-lg bg-white/5 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-[var(--color-accent)]/20 hover:text-[var(--color-accent)] transition-all"
                              title="Practice this problem"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedPage>
  );
}
