import React, { useState } from 'react';
import { AnimatedPage } from './AnimatedPage';
import { CalendarDays, CalendarCheck, CalendarRange, Wand2, Target, Briefcase, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StudyPlan } from '../types';
import { fetchGeminiJson } from '../services/geminiGenericService';

export function StudyPlanGenerator() {
  const [step, setStep] = useState<1 | 2>(1);
  const [goal, setGoal] = useState<'faang' | 'startup' | 'internship'>('faang');
  const [duration, setDuration] = useState<4 | 8 | 12>(8);
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<StudyPlan | null>(null);

  const generatePlan = async () => {
    setIsGenerating(true);
    try {
      const systemPrompt = `You are an expert technical recruiter and interview coach. 
Generate a comprehensive, actionable study plan for a software engineer preparing for a ${goal.toUpperCase()} role over ${duration} weeks.
Return a strict JSON object matching this schema:
{
  "id": "random-id",
  "title": "string",
  "durationWeeks": number,
  "targetRole": "string",
  "weeks": [
    {
      "weekNumber": number,
      "focus": "string (main topic for the week)",
      "tasks": [
        { "id": "task-id", "title": "string", "type": "learning" | "practice" | "mock", "completed": false }
      ]
    }
  ]
}
Make the plan rigorous, highly specific to the target role (${goal}), and realistic. Include exact topics (e.g. 'Dynamic Programming: Knapsack', 'System Design: Distributed Cache').`;

      const prompt = `Goal: ${goal}\nDuration: ${duration} weeks. Please generate my curriculum.`;
      
      const generatedPlan = await fetchGeminiJson<StudyPlan>(systemPrompt, prompt);
      setPlan(generatedPlan);
      setStep(2);
    } catch (e) {
      console.error(e);
      alert("Failed to generate study plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
            <CalendarDays className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Study Plan Generator</h1>
            <p className="text-gray-400 font-mono mt-1 text-sm">AI-tailored curriculum for your timeline</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#111] border border-white/10 rounded-3xl p-8"
            >
              <h2 className="text-xl font-display font-bold text-white mb-8">What are you preparing for?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <button
                  onClick={() => setGoal('faang')}
                  className={`p-6 rounded-2xl border text-left transition-all ${
                    goal === 'faang' ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'bg-[#1a1a1a] border-white/5 hover:border-white/20'
                  }`}
                >
                  <Target className={`w-8 h-8 mb-4 ${goal === 'faang' ? 'text-cyan-400' : 'text-gray-500'}`} />
                  <h3 className={`font-bold mb-1 ${goal === 'faang' ? 'text-white' : 'text-gray-300'}`}>FAANG/Big Tech</h3>
                  <p className="text-xs text-gray-500 font-mono">Heavy DS&A + System Design</p>
                </button>
                <button
                  onClick={() => setGoal('startup')}
                  className={`p-6 rounded-2xl border text-left transition-all ${
                    goal === 'startup' ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'bg-[#1a1a1a] border-white/5 hover:border-white/20'
                  }`}
                >
                  <Briefcase className={`w-8 h-8 mb-4 ${goal === 'startup' ? 'text-cyan-400' : 'text-gray-500'}`} />
                  <h3 className={`font-bold mb-1 ${goal === 'startup' ? 'text-white' : 'text-gray-300'}`}>Startup/Mid-tier</h3>
                  <p className="text-xs text-gray-500 font-mono">Practical coding + Domain specific</p>
                </button>
                <button
                  onClick={() => setGoal('internship')}
                  className={`p-6 rounded-2xl border text-left transition-all ${
                    goal === 'internship' ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'bg-[#1a1a1a] border-white/5 hover:border-white/20'
                  }`}
                >
                  <GraduationCap className={`w-8 h-8 mb-4 ${goal === 'internship' ? 'text-cyan-400' : 'text-gray-500'}`} />
                  <h3 className={`font-bold mb-1 ${goal === 'internship' ? 'text-white' : 'text-gray-300'}`}>New Grad/Intern</h3>
                  <p className="text-xs text-gray-500 font-mono">Core DS&A + Behavioral</p>
                </button>
              </div>

              <h2 className="text-xl font-display font-bold text-white mb-6">How much time do you have?</h2>
              <div className="flex gap-4 mb-12">
                {[4, 8, 12].map((w) => (
                  <button
                    key={w}
                    onClick={() => setDuration(w as any)}
                    className={`flex-1 py-4 rounded-xl border font-mono font-bold transition-all ${
                      duration === w ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-[#1a1a1a] border-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {w} Weeks
                  </button>
                ))}
              </div>

              <button
                onClick={generatePlan}
                disabled={isGenerating}
                className="w-full py-5 bg-cyan-500 hover:bg-cyan-600 text-black rounded-2xl font-display font-bold text-xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
              >
                {isGenerating ? (
                  <><div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> Analyzing...</>
                ) : (
                  <><Wand2 className="w-6 h-6" /> Generate Curriculum</>
                )}
              </button>
            </motion.div>
          )}

          {step === 2 && plan && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <h2 className="text-2xl font-display font-bold text-white">{plan.title}</h2>
                <button onClick={() => setStep(1)} className="text-sm font-mono text-cyan-400 hover:text-cyan-300 transition-colors">
                  Recalibrate
                </button>
              </div>

              <div className="space-y-4 pt-4">
                {plan.weeks.map((week) => (
                  <div key={week.weekNumber} className="bg-[#111] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Week</span>
                        <span className="text-xl font-display font-bold leading-none">{week.weekNumber}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{week.focus}</h3>
                        <p className="text-sm text-gray-500 font-mono">{week.tasks.length} specific tasks</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
                      {week.tasks.map(task => (
                        <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#161616] border border-transparent hover:border-white/10 transition-colors">
                          <button className="w-5 h-5 rounded-md border border-gray-500 flex items-center justify-center shrink-0">
                            {/* Empty checkbox */}
                          </button>
                          <span className="text-sm text-gray-300">{task.title}</span>
                          <span className={`ml-auto text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded ${
                            task.type === 'learning' ? 'bg-blue-500/10 text-blue-400' :
                            task.type === 'practice' ? 'bg-green-500/10 text-green-400' :
                            'bg-pink-500/10 text-pink-400'
                          }`}>
                            {task.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
}
