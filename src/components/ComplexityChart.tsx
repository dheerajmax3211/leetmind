import React from 'react';
import { LineChart, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface ComplexityChartProps {
  activeComplexityKey?: string; // e.g., 'o1', 'ologn', 'on', 'onlogn', 'on2', 'o2n'
  title?: string;
}

export function ComplexityChart({ activeComplexityKey = 'on', title = "Time Complexity Comparison" }: ComplexityChartProps) {
  
  const parseComplexityToKey = (comp: string): string => {
    if (!comp) return 'on';
    const clean = comp.toLowerCase().replace(/\\s/g, '');
    if (clean.includes('1')) return 'o1';
    if (clean.includes('logn') && !clean.includes('nlogn')) return 'ologn';
    if (clean.includes('nlogn')) return 'onlogn';
    if (clean.includes('n^2') || clean.includes('n2') || clean.includes('n*n')) return 'on2';
    if (clean.includes('2^n') || clean.includes('e^n') || clean.includes('n!')) return 'o2n';
    return 'on'; // default fallback is linear
  };

  const parsedKey = activeComplexityKey.startsWith('o') ? activeComplexityKey : parseComplexityToKey(activeComplexityKey);

  const complexities = [
    { key: 'o1', label: 'O(1)', color: '#00ff88', points: '0,100 100,100', desc: 'Constant (Excellent)' },
    { key: 'ologn', label: 'O(log N)', color: '#3b82f6', points: '0,100 20,80 40,75 60,70 80,68 100,65', desc: 'Logarithmic (Good)' },
    { key: 'on', label: 'O(N)', color: '#eab308', points: '0,100 100,0', desc: 'Linear (Fair)' },
    { key: 'onlogn', label: 'O(N log N)', color: '#f97316', points: '0,100 50,60 100,-20', desc: 'Log-Linear (Bad)' },
    { key: 'on2', label: 'O(N²)', color: '#ef4444', points: '0,100 20,95 40,80 60,50 80,0', desc: 'Quadratic (Horrible)' },
    { key: 'o2n', label: 'O(2^N)', color: '#7f1d1d', points: '0,100 10,95 20,80 30,50 40,0', desc: 'Exponential (Avoid)' },
  ];

  return (
    <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
          <LineChart className="w-5 h-5 text-[var(--color-accent)]" /> {title}
        </h3>
        <div className="text-sm font-mono text-gray-400 flex items-center gap-2">
          N = Elements <span className="opacity-50 mx-1">|</span> Time = Operations
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 relative z-10">
        {/* Chart Area */}
        <div className="relative w-full md:w-2/3 aspect-[2/1] bg-[#1a1a1a] border-l-2 border-b-2 border-white/20 rounded-bl">
          {/* Grid lines */}
          <div className="absolute inset-0 border-t border-r border-white/5 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:10%_20%]"></div>
          
          {/* Axis Labels */}
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-mono text-gray-500 tracking-widest uppercase">Time / Operations</div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-gray-500 tracking-widest uppercase">Input Size (N)</div>

          {/* SVG Curves */}
          <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
            {complexities.map((comp) => {
              const isActive = comp.key === parsedKey;
              return (
                <polyline
                  key={comp.key}
                  points={comp.points}
                  fill="none"
                  stroke={comp.color}
                  strokeWidth={isActive ? "4" : "1.5"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-all duration-500 ${isActive ? 'opacity-100 shadow-[0_0_10px_rgba(currentColor,0.5)]' : 'opacity-20 hover:opacity-50'}`}
                  style={{ filter: isActive ? `drop-shadow(0 0 8px ${comp.color}66)` : 'none' }}
                />
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="w-full md:w-1/3 flex flex-col gap-2 justify-center">
          {complexities.map((comp) => {
            const isActive = comp.key === parsedKey;
            return (
              <div 
                key={comp.key}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${isActive ? 'bg-white/10' : ''}`}
              >
                <div 
                  className={`w-3 h-3 rounded-full shrink-0 ${isActive ? 'ring-2 ring-offset-2 ring-offset-[#151515]' : ''}`} 
                  style={{ backgroundColor: comp.color, borderColor: comp.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className={`font-mono text-sm font-bold ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {comp.label}
                  </div>
                  {isActive && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-xs text-gray-400 mt-0.5 truncate"
                    >
                      {comp.desc}
                    </motion.div>
                  )}
                </div>
                {isActive && <Zap className="w-4 h-4" style={{ color: comp.color }} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
