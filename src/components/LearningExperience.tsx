import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2, ChevronRight, Copy, Lock, Unlock, Zap, Lightbulb, Trophy, BookOpen } from 'lucide-react';
import { LeetMindResponse } from '../types';

interface LearningExperienceProps {
  data: LeetMindResponse;
  onReset: () => void;
}

export function LearningExperience({ data, onReset }: LearningExperienceProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showFullSolution, setShowFullSolution] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const totalSteps = data.steps.length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && currentStep < totalSteps) {
        e.preventDefault();
        setCurrentStep(prev => prev + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, totalSteps]);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.fullSolution);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUnlock = () => {
    setShowFullSolution(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 120 }}
      className="min-h-screen bg-[var(--color-bg)] text-white p-4 md:p-8"
    >
      {showConfetti && <Confetti />}

      {/* Header */}
      <header className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition font-mono text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> New Problem
        </button>
        
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-display font-bold">{data.problemTitle}</h1>
          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
            data.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
            data.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
            'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {data.difficulty}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/10 border border-white/20 text-gray-300 flex items-center gap-1">
            <Zap className="w-3 h-3 text-[var(--color-accent)]" /> {data.approach}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto space-y-12 pb-32">
        {/* Story Intro */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] opacity-50"></div>
          <p className="text-lg md:text-xl font-display italic text-gray-300 leading-relaxed">
            {data.storyIntro}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="sticky top-4 z-10 bg-[var(--color-bg)]/80 backdrop-blur-md py-4 border-b border-white/10">
          <div className="flex justify-between items-center mb-2 font-mono text-sm text-gray-400">
            <span>Progress</span>
            <span>Step {Math.min(currentStep, totalSteps)} of {totalSteps}</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[var(--color-accent)]"
              initial={{ width: 0 }}
              animate={{ width: `${(Math.min(currentStep, totalSteps) / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
          {data.steps.map((step, index) => {
            const isRevealed = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={step.stepNumber} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Timeline dot */}
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 border-[var(--color-bg)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm transition-colors duration-500 ${
                  isRevealed ? 'bg-[var(--color-accent)] text-black' : 'bg-[#1a1a1a] text-gray-500'
                }`}>
                  <span className="text-xl">{step.emoji}</span>
                </div>

                {/* Card */}
                <motion.div 
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  animate={{ 
                    opacity: isRevealed ? 1 : 0.3, 
                    x: isRevealed ? 0 : (index % 2 === 0 ? 20 : -20),
                    filter: isRevealed ? 'blur(0px)' : 'blur(4px)'
                  }}
                  className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl border transition-all duration-500 ${
                    isCurrent ? 'border-[var(--color-accent)] shadow-[0_0_20px_rgba(0,255,136,0.1)]' : 'border-white/10 bg-[#1a1a1a]'
                  }`}
                >
                  <h3 className="text-xl font-display font-bold mb-3 flex items-center gap-2">
                    <span className="text-[var(--color-accent)] font-mono text-sm">{(index + 1).toString().padStart(2, '0')}</span>
                    {step.title}
                  </h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{step.explanation}</p>
                  
                  {isRevealed && (
                    <div className="rounded-xl overflow-hidden border border-white/5 bg-black/50">
                      <div className="flex items-center px-4 py-2 bg-white/5 border-b border-white/5">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                        </div>
                      </div>
                      <pre className="p-4 overflow-x-auto font-mono text-sm text-gray-300">
                        <code>{step.code}</code>
                      </pre>
                    </div>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Next Step Button */}
        {currentStep < totalSteps && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-12"
          >
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="group flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-mono text-lg transition-all hover:scale-105"
            >
              Reveal Step {currentStep + 1}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="absolute mt-16 text-gray-500 font-mono text-xs">or press Spacebar</p>
          </motion.div>
        )}

        {/* Full Solution & Extras */}
        {currentStep >= totalSteps && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 mt-16"
          >
            {/* Complexity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-400 font-mono text-sm">Time Complexity</p>
                  <p className="text-2xl font-mono font-bold text-white">{data.complexityBreakdown.time}</p>
                </div>
              </div>
              <div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-400 font-mono text-sm">Space Complexity</p>
                  <p className="text-2xl font-mono font-bold text-white">{data.complexityBreakdown.space}</p>
                </div>
              </div>
            </div>
            <p className="text-center text-gray-400 italic">{data.complexityBreakdown.explanation}</p>

            {/* Tips & Facts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <h4 className="text-orange-400 font-display font-bold flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5" /> Pro Tip
                </h4>
                <p className="text-orange-100/80 leading-relaxed relative z-10">{data.proTip}</p>
              </div>
              <div className="bg-teal-500/10 border border-teal-500/20 p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <h4 className="text-teal-400 font-display font-bold flex items-center gap-2 mb-3">
                  <Trophy className="w-5 h-5" /> Fun Fact
                </h4>
                <p className="text-teal-100/80 leading-relaxed relative z-10">{data.funFact}</p>
              </div>
            </div>

            {/* Full Solution Reveal */}
            <div className="pt-8">
              {!showFullSolution ? (
                <button
                  onClick={handleUnlock}
                  className="w-full py-6 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] text-black font-display font-bold text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] flex items-center justify-center gap-3"
                >
                  <Unlock className="w-6 h-6" /> Unlock Full Solution
                </button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-2xl overflow-hidden border border-white/20 bg-[#0a0a0a]"
                >
                  <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10">
                    <span className="font-mono text-sm text-gray-400">Optimal Solution</span>
                    <button 
                      onClick={handleCopy}
                      className="flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-white transition"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>
                  <pre className="p-6 overflow-x-auto font-mono text-sm text-green-400/90 leading-relaxed">
                    <code>{data.fullSolution}</code>
                  </pre>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}

// Simple CSS Confetti Component
function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute top-0 w-3 h-3 animate-confetti"
          style={{
            left: `${Math.random() * 100}vw`,
            backgroundColor: ['#00ff88', '#ff6b35', '#3b82f6', '#a855f7', '#facc15'][Math.floor(Math.random() * 5)],
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation-name: confetti;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}
