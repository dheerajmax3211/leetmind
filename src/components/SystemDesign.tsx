import React, { useState } from 'react';
import { AnimatedPage } from './AnimatedPage';
import { Server, Database, Activity, LayoutTemplate, Layers, CloudFog, PenTool, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function SystemDesign() {
  const [activeTab, setActiveTab] = useState<'learn' | 'practice'>('learn');

  const coreConcepts = [
    { title: 'Load Balancing', icon: <Layers className="w-6 h-6" />, desc: 'Distributing traffic across multiple servers to ensure reliability and performance.' },
    { title: 'Caching', icon: <Zap className="w-6 h-6" />, desc: 'Storing frequently accessed data in memory (like Redis) to reduce database load.' },
    { title: 'Database Scaling', icon: <Database className="w-6 h-6" />, desc: 'Understanding Sharding, Replication, and SQL vs NoSQL trade-offs.' },
    { title: 'Microservices', icon: <CloudFog className="w-6 h-6" />, desc: 'Breaking down monolithic applications into smaller, independent services.' },
  ];

  const practiceProblems = [
    { id: 1, title: 'Design a URL Shortener (TinyURL)', difficulty: 'Medium' },
    { id: 2, title: 'Design WhatsApp / Chat System', difficulty: 'Hard' },
    { id: 3, title: 'Design Netflix / YouTube', difficulty: 'Hard' },
    { id: 4, title: 'Design Twitter / X Newsfeed', difficulty: 'Hard' },
  ];

  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
              <Server className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white">System Design</h1>
              <p className="text-gray-400 font-mono mt-1 text-sm">Master scalable architectures for senior roles</p>
            </div>
          </div>
          
          <div className="flex bg-[#1a1a1a] p-1.5 rounded-xl border border-white/10 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('learn')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-mono font-bold transition-all ${
                activeTab === 'learn' 
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              Learn Concepts
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-mono font-bold transition-all ${
                activeTab === 'practice' 
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              Practice Scenarios
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'learn' ? (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {coreConcepts.map((concept, idx) => (
                  <div key={idx} className="bg-[#111] border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-white/5 text-gray-400 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                      {concept.icon}
                    </div>
                    <h3 className="text-lg font-display font-bold text-white mb-2">{concept.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{concept.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-purple-500/10 blur-3xl translate-x-1/4 translate-y-1/4 rounded-full"></div>
                
                <h2 className="text-2xl font-display font-bold text-white mb-6 relative z-10">The Standard Architecture Framework</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10 text-center text-sm font-mono">
                  <div className="p-4 bg-[#222] border border-white/5 rounded-xl flex flex-col items-center justify-center gap-2">
                    <LayoutTemplate className="w-5 h-5 text-gray-400" />
                    <span className="text-white">Clients</span>
                    <span className="text-xs text-gray-500">(Mobile, Web)</span>
                  </div>
                  <div className="hidden md:flex items-center justify-center text-gray-600">→</div>
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl flex flex-col items-center justify-center gap-2">
                    <Server className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-300">API Gateway / LB</span>
                  </div>
                  <div className="hidden md:flex items-center justify-center text-gray-600">→</div>
                  <div className="space-y-4">
                    <div className="p-4 bg-[#222] border border-white/5 rounded-xl flex flex-col items-center justify-center gap-2">
                      <CloudFog className="w-5 h-5 text-blue-400" />
                      <span className="text-white">Services</span>
                    </div>
                    <div className="p-4 bg-[#222] border border-white/5 rounded-xl flex flex-col items-center justify-center gap-2">
                      <Database className="w-5 h-5 text-green-400" />
                      <span className="text-white">Databases</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
               <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
                 {practiceProblems.map(prob => (
                   <div key={prob.id} className="bg-[#111] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-white/20 transition-colors">
                     <div>
                       <h3 className="text-xl font-display font-bold text-white mb-2">{prob.title}</h3>
                       <div className="flex items-center gap-4 text-sm font-mono">
                         <span className={`px-2 py-1 rounded ${prob.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}>{prob.difficulty}</span>
                         <span className="text-gray-500 line-clamp-1">Requirements • APIs • DB Schema • High Level Design</span>
                       </div>
                     </div>
                     <button 
                       onClick={(e) => { 
                         e.preventDefault(); 
                         window.dispatchEvent(new CustomEvent('start-tutor', { detail: { query: 'System Design: ' + prob.title } })); 
                       }}
                       className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white border border-purple-500/50 rounded-xl font-bold transition-colors whitespace-nowrap flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                       <PenTool className="w-4 h-4" /> Start AI Walkthrough
                     </button>
                   </div>
                 ))}

                 <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-4">
                   <Activity className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
                   <div>
                     <h4 className="text-white font-bold mb-1">Interactive Walkthrough Enabled</h4>
                     <p className="text-gray-400 text-sm leading-relaxed">Click any scenario to enter a guided System Design walkthrough with our AI tutor focusing on DB Schema, API Contracts, and scaling.</p>
                   </div>
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
}
