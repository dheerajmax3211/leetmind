import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Copy, Unlock, Zap, Lightbulb, Trophy, BookOpen, ArrowUp, ArrowDown, Printer, Compass } from 'lucide-react';
import { LeetMindResponse } from '../types';
import { printSolution } from '../utils/printUtils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Maximize2, Minimize2, X } from 'lucide-react';
interface LearningExperienceProps {
  data: Partial<LeetMindResponse>;
  onReset: () => void;
  onExploreNext?: (topic: string) => void;
  isStreaming?: boolean;
}

export function LearningExperience({ data, onReset, onExploreNext, isStreaming }: LearningExperienceProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [focusedStep, setFocusedStep] = useState(0);
  const [showFullSolution, setShowFullSolution] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPrintMenu, setShowPrintMenu] = useState(false);
  const [fullScreenStep, setFullScreenStep] = useState<number | null>(null);

  const steps = data.steps || [];
  const totalSteps = steps.length;
  // During streaming, we only allow review mode if the final JSON is completely received
  // However, keeping simple logic: review mode unlocks when currentStep >= totalSteps and we have at least 1 step.
  const isReviewMode = currentStep >= totalSteps && totalSteps > 0 && !isStreaming;

  // We intentionally do NOT auto-reveal steps during streaming anymore.
  // The user should still click or press Space to reveal them at their own pace.

  // Refs for each step card to enable scroll-into-view
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Auto-scroll to the newly revealed step when spacebar advances it
  useEffect(() => {
    if (currentStep > 0 && currentStep <= totalSteps) {
      stepRefs.current[currentStep - 1]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentStep, totalSteps]);

  // Scroll to focused step when navigating with arrow keys in review mode
  const hasInteractedReview = useRef(false);
  useEffect(() => {
    if (!hasInteractedReview.current) return;
    stepRefs.current[focusedStep]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [focusedStep]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space: reveal next step
      if (e.code === 'Space' && currentStep < totalSteps) {
        e.preventDefault();
        setCurrentStep(prev => prev + 1);
        return;
      }

      // Arrow keys: review mode navigation (only after all steps unlocked)
      if (isReviewMode) {
        if (e.code === 'ArrowDown') {
          e.preventDefault();
          hasInteractedReview.current = true;
          setFocusedStep(prev => Math.min(prev + 1, totalSteps - 1));
        }
        if (e.code === 'ArrowUp') {
          e.preventDefault();
          hasInteractedReview.current = true;
          setFocusedStep(prev => Math.max(prev - 1, 0));
        }
      }
      
      // Escape: close full screen step
      if (e.code === 'Escape' && fullScreenStep !== null) {
        setFullScreenStep(null);
        return;
      }

      // Arrow keys in full screen navigate between revealed steps
      if (fullScreenStep !== null) {
        if (e.code === 'ArrowRight') {
          e.preventDefault();
          // advance to next revealed step; reveal next if not yet revealed
          setFullScreenStep(prev => {
            if (prev === null) return null;
            const next = prev + 1;
            if (next < totalSteps) {
              if (next >= currentStep) {
                // also unlock the step in the main view
                setCurrentStep(next + 1);
              }
              return next;
            }
            return prev;
          });
        }
        if (e.code === 'ArrowLeft') {
          e.preventDefault();
          setFullScreenStep(prev => (prev !== null && prev > 0 ? prev - 1 : prev));
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, totalSteps, isReviewMode, fullScreenStep]);

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
          <h1 className="text-2xl md:text-3xl font-display font-bold">{data.problemTitle || "Thinking..."}</h1>
          {data.difficulty && (
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
              data.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
              data.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
              'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {data.difficulty}
            </span>
          )}
          {data.approach && (
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/10 border border-white/20 text-gray-300 flex items-center gap-1">
              <Zap className="w-3 h-3 text-[var(--color-accent)]" /> {data.approach}
            </span>
          )}
        </div>

        {/* Print button */}
        <div className="relative">
          {!isStreaming && (
            <button
              onClick={() => setShowPrintMenu(v => !v)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-mono text-sm text-gray-300 hover:text-white transition"
            >
              <Printer className="w-4 h-4" /> Download PDF
            </button>
          )}
          {showPrintMenu && (
            <div className="absolute right-0 top-full mt-2 z-20 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-2xl min-w-[170px]">
              <button
                onClick={() => { setShowPrintMenu(false); printSolution(data as LeetMindResponse, 'color'); }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm font-mono text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                🎨 Color PDF
              </button>
              <div className="h-px bg-white/10" />
              <button
                onClick={() => { setShowPrintMenu(false); printSolution(data as LeetMindResponse, 'bw'); }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm font-mono text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                ⬜ Black &amp; White
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto space-y-12 pb-32">
        {/* Problem Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] opacity-50"></div>
          <p className="text-lg md:text-xl font-display text-gray-300 leading-relaxed min-h-[3rem]">
            {data.storyIntro || (isStreaming ? "Analyzing your request..." : "")}
            {isStreaming && (!data.storyIntro) && (
              <span className="inline-block w-2.5 h-4 ml-1 bg-[var(--color-accent)] animate-pulse" />
            )}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="sticky top-4 z-10 bg-[var(--color-bg)]/80 backdrop-blur-md py-4 border-b border-white/10">
          <div className="flex justify-between items-center mb-2 font-mono text-sm text-gray-400">
            <span>Progress</span>
            <div className="flex items-center gap-3">
              {isReviewMode && (
                <span className="flex items-center gap-1.5 text-[var(--color-accent)] text-xs">
                  <ArrowUp className="w-3 h-3" />
                  <ArrowDown className="w-3 h-3" />
                  <span>Review mode</span>
                </span>
              )}
              <span>Step {Math.min(currentStep, totalSteps)} of {totalSteps}</span>
            </div>
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
          {steps.map((step, index) => {
            const isRevealed = index < currentStep;
            const isCurrent = index === currentStep;
            const isFocused = isReviewMode && index === focusedStep;

            return (
              <div
                key={step.stepNumber}
                ref={el => { stepRefs.current[index] = el; }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
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
                  className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl border transition-all duration-500 relative group/card ${
                    isFocused
                      ? 'border-[var(--color-accent)] shadow-[0_0_25px_rgba(0,255,136,0.2)] ring-1 ring-[var(--color-accent)]/30'
                      : isCurrent
                      ? 'border-[var(--color-accent)]/50 shadow-[0_0_15px_rgba(0,255,136,0.08)]'
                      : 'border-white/10 bg-[#1a1a1a]'
                  }`}
                >
                  {isRevealed && (
                    <button 
                      onClick={() => setFullScreenStep(index)}
                      className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-opacity opacity-0 group-hover/card:opacity-100"
                      title="View Full Screen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  )}
                  <h3 className="text-xl font-display font-bold mb-3 flex items-center gap-2 pr-8">
                    <span className="text-[var(--color-accent)] font-mono text-sm">{(index + 1).toString().padStart(2, '0')}</span>
                    {step.title || "Generating step..."}
                  </h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {step.explanation}
                    {isStreaming && index === steps.length - 1 && (
                      <span className="inline-block w-2 h-4 ml-1 bg-gray-500 animate-pulse" />
                    )}
                  </p>

                  {isRevealed && step.code && (
                    <div className="rounded-xl overflow-hidden border border-white/5 bg-black/50">
                      <div className="flex items-center px-4 py-2 bg-white/5 border-b border-white/5">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                        </div>
                      </div>
                      <div className="overflow-x-auto bg-[#1e1e1e]">
                        <SyntaxHighlighter
                          language={(data.language || 'javascript').toLowerCase()}
                          style={vscDarkPlus}
                          customStyle={{ margin: 0, padding: '1rem', background: 'transparent', fontSize: '0.875rem' }}
                        >
                          {step.code}
                        </SyntaxHighlighter>
                      </div>
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
            className="flex flex-col items-center gap-3 mt-12"
          >
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="group flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-mono text-lg transition-all hover:scale-105"
            >
              Reveal Step {currentStep + 1}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-gray-500 font-mono text-xs">or press Spacebar</p>
          </motion.div>
        )}

        {/* Full Solution & Extras */}
        {!isStreaming && currentStep >= totalSteps && totalSteps > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 mt-16"
          >
            {/* Review mode hint */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 font-mono text-xs text-[var(--color-accent)]">
                <ArrowUp className="w-3.5 h-3.5" />
                <ArrowDown className="w-3.5 h-3.5" />
                <span>Use arrow keys to revisit any step</span>
              </div>
            </div>

            {/* Complexity */}
            {data.complexityBreakdown && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-400 font-mono text-sm">Time Complexity</p>
                      <p className="text-2xl font-mono font-bold text-white">{data.complexityBreakdown.time || "N/A"}</p>
                    </div>
                  </div>
                  <div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-400 font-mono text-sm">Space Complexity</p>
                      <p className="text-2xl font-mono font-bold text-white">{data.complexityBreakdown.space || "N/A"}</p>
                    </div>
                  </div>
                </div>
                <p className="text-center text-gray-400 italic">{data.complexityBreakdown.explanation}</p>
              </>
            )}

            {/* Tips & Facts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.proTip && (
                <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <h4 className="text-orange-400 font-display font-bold flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5" /> Pro Tip
                  </h4>
                  <p className="text-orange-100/80 leading-relaxed relative z-10">{data.proTip}</p>
                </div>
              )}
              {data.funFact && (
                <div className="bg-teal-500/10 border border-teal-500/20 p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <h4 className="text-teal-400 font-display font-bold flex items-center gap-2 mb-3">
                    <Trophy className="w-5 h-5" /> Fun Fact
                  </h4>
                  <p className="text-teal-100/80 leading-relaxed relative z-10">{data.funFact}</p>
                </div>
              )}
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
                  {data.fullSolution ? (
                    <div className="overflow-x-auto bg-[#1e1e1e]">
                      <SyntaxHighlighter
                        language={(data.language || 'javascript').toLowerCase()}
                        style={vscDarkPlus}
                        customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', fontSize: '0.875rem', lineHeight: '1.6' }}
                      >
                        {data.fullSolution}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <div className="p-6 text-gray-400 text-sm font-mono italic">No full solution provided.</div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Next Steps */}
            {data.nextSteps && data.nextSteps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-8 space-y-4"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)]">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-display font-bold text-white">Explore Next</h4>
                    <p className="text-sm font-mono text-gray-400">Deepen your understanding</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.nextSteps.map((step, idx) => (
                    <button
                      key={idx}
                      onClick={() => onExploreNext?.(step)}
                      className="text-left p-5 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[var(--color-accent)]/50 hover:bg-white/10 transition-all group relative overflow-hidden flex flex-col gap-2"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                        <ChevronRight className="w-5 h-5 text-[var(--color-accent)]" />
                      </div>
                      <span className="font-mono text-[var(--color-accent)] text-xs">Option {idx + 1}</span>
                      <span className="font-display font-bold text-gray-200 group-hover:text-white transition-colors">{step}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>

      {/* Full Screen Step Modal */}
      <AnimatePresence>
        {fullScreenStep !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm"
            onClick={() => setFullScreenStep(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl max-h-[90vh] flex flex-col bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-black bg-[var(--color-accent)] text-black font-bold text-xl">
                    {steps[fullScreenStep].emoji}
                  </div>
                  <h2 className="text-2xl font-display font-bold text-white">
                    <span className="text-[var(--color-accent)] font-mono text-lg mr-3">
                      {(fullScreenStep + 1).toString().padStart(2, '0')}
                    </span>
                    {steps[fullScreenStep].title}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFullScreenStep(null)}
                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
                  >
                    <Minimize2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setFullScreenStep(null)}
                    className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-colors text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-display">
                  {steps[fullScreenStep].explanation}
                </p>
                {steps[fullScreenStep].code && (
                  <div className="rounded-xl overflow-hidden border border-white/10 bg-black/50">
                    <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/10">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                      </div>
                    </div>
                    <div className="overflow-x-auto bg-[#1e1e1e]">
                      <SyntaxHighlighter
                        language={(data.language || 'javascript').toLowerCase()}
                        style={vscDarkPlus}
                        customStyle={{ margin: 0, padding: '2rem', background: 'transparent', fontSize: '1rem', lineHeight: '1.6' }}
                      >
                        {steps[fullScreenStep].code}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/5">
                <button
                  onClick={() => setFullScreenStep(prev => (prev !== null && prev > 0 ? prev - 1 : prev))}
                  disabled={fullScreenStep === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-sm bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev Step
                </button>
                <span className="font-mono text-xs text-gray-500">
                  {fullScreenStep + 1} / {Math.max(currentStep, fullScreenStep + 1)}
                  <span className="ml-2 opacity-50">← →</span>
                </span>
                <button
                  onClick={() => {
                    const next = fullScreenStep + 1;
                    if (next < totalSteps) {
                      if (next >= currentStep) setCurrentStep(next + 1);
                      setFullScreenStep(next);
                    }
                  }}
                  disabled={fullScreenStep >= totalSteps - 1}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-sm bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/30 text-[var(--color-accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

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
