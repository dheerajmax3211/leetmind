import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Brain, BookOpen, Target, Video, LayoutDashboard, Users, Building, FileText, Database, Calendar, Menu, X } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  hash: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Brain, hash: '' },
  { id: 'patterns', label: 'Pattern Library', icon: BookOpen, hash: 'patterns' },
  { id: 'tracks', label: 'Curated Tracks', icon: Target, hash: 'tracks' },
  { id: 'mock', label: 'Mock Interview', icon: Video, hash: 'mock-interview' },
  { id: 'system-design', label: 'System Design', icon: LayoutDashboard, hash: 'system-design' },
  { id: 'behavioral', label: 'Behavioral', icon: Users, hash: 'behavioral' },
  { id: 'company', label: 'Company Prep', icon: Building, hash: 'company' },
  { id: 'cheatsheets', label: 'Cheat Sheets', icon: FileText, hash: 'cheatsheets' },
  { id: 'glossary', label: 'Glossary', icon: Database, hash: 'glossary' },
  { id: 'plan', label: 'Study Plan', icon: Calendar, hash: 'study-plan' },
];

export function Navigation() {
  const [currentHash, setCurrentHash] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash.replace('#', ''));
      setIsOpen(false);
    };

    // Initial load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <a href="#" className="flex items-center gap-2 text-xl font-display font-bold text-white hover:text-[var(--color-accent)] transition-colors">
                <span className="text-2xl">🧠</span> 
                LeetMind
              </a>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mask-edges">
              {NAV_ITEMS.map((item) => {
                const isActive = currentHash === item.hash || (currentHash === '' && item.hash === '');
                const Icon = item.icon;
                return (
                  <a
                    key={item.id}
                    href={`#${item.hash}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-xs transition-all whitespace-nowrap ${
                      isActive 
                        ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-bold border border-[var(--color-accent)]/20 shadow-[0_0_15px_rgba(0,255,136,0.1)]' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </a>
                );
              })}
            </div>

            {/* Mobile Nav Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 bg-[#0f0f0f]"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = currentHash === item.hash || (currentHash === '' && item.hash === '');
                const Icon = item.icon;
                return (
                  <a
                    key={item.id}
                    href={`#${item.hash}`}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-sm transition-all ${
                      isActive 
                        ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-bold border border-[var(--color-accent)]/20 border-l-4 border-l-[var(--color-accent)]' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </nav>
    </>
  );
}
