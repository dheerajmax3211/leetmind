import React, { useState, useEffect } from 'react';
import { AnimatedPage } from './AnimatedPage';
import { Video, Clock, StopCircle, Play, Mic, MessageSquare, AlertTriangle, CheckCircle, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { fetchGeminiJson } from '../services/geminiGenericService';

interface MockProblem {
  title: string;
  description: string;
}

export function MockInterview() {
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [notes, setNotes] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingProblem, setIsGeneratingProblem] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [problem, setProblem] = useState<MockProblem | null>(null);

  const startInterview = async () => {
    setIsGeneratingProblem(true);
    try {
      const data = await fetchGeminiJson<MockProblem>(
        `You are a FAANG interviewer. Generate a random, challenging algorithmic coding interview problem.
        Return JSON format: { "title": "short title", "description": "full markdown description including constraints and examples" }`,
        "Give me a random Medium or Hard difficulty algorithmic problem."
      );
      setProblem(data);
      setIsStarted(true);
      setTimeLeft(45 * 60);
      setNotes('');
      setFeedback('');
      setIsFinished(false);
    } catch (e) {
      console.error(e);
      alert("Failed to generate a problem. Please try again.");
    } finally {
      setIsGeneratingProblem(false);
    }
  };

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted && !isFinished && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isFinished) {
      handleFinish();
    }
    return () => clearInterval(interval);
  }, [isStarted, isFinished, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinish = async () => {
    setIsFinished(true);
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/mock-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: problem?.description || "Unknown",
          notes,
          duration: 45 * 60 - timeLeft
        })
      });

      if (!response.ok) throw new Error("Failed to get feedback");
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      if (!reader) throw new Error("No reader");

      let currentFeedback = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                currentFeedback += parsed.text;
                setFeedback(currentFeedback);
              }
            } catch (e) {}
          }
        }
      }
    } catch (err) {
      console.error(err);
      setFeedback("Sorry, there was an error analyzing your interview. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isStarted && !isFinished) {
    return (
      <AnimatedPage>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Video className="w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Mock Interview Simulator</h1>
          <p className="text-xl text-gray-400 leading-relaxed mb-12 max-w-2xl mx-auto">
            Experience a realistic 45-minute FAANG interview. A random problem will appear, and you must "think out loud" by typing your approach, edge cases, and code. AI will evaluate you like a real interviewer.
          </p>

          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 max-w-xl mx-auto text-left mb-12">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" /> Rules of Engagement
            </h3>
            <ul className="space-y-3 font-mono text-sm text-gray-400">
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" /> Do not look up syntax.</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" /> Talk (type) through your brute force approach first.</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" /> Discuss time & space complexity before coding.</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" /> Dry run your code with an example at the end.</li>
            </ul>
          </div>

          <button 
            onClick={startInterview}
            disabled={isGeneratingProblem}
            className="px-10 py-5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-display font-bold text-xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(239,68,68,0.3)] disabled:opacity-50 disabled:scale-100 flex items-center justify-center mx-auto gap-3"
          >
            {isGeneratingProblem ? (
              <><div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Generating Problem...</>
            ) : (
              "Start Interview (45:00)"
            )}
          </button>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      {/* 
        Instead of a standard max-w wrap, we use full screen height layout 
        for the active interview to simulate a real coding pad environment 
      */}
      <div className="fixed inset-0 top-[65px] bg-[#0a0a0a] z-40 flex flex-col md:flex-row">
        
        {/* Left Side: Problem Statement */}
        <div className="w-full md:w-1/3 border-r border-white/10 bg-[#111] flex flex-col">
          <div className="p-4 border-b border-white/10 bg-[#1a1a1a] flex items-center justify-between">
            <h2 className="font-display font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" /> Readert Interview
            </h2>
            <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 font-mono font-bold ${
              timeLeft < 300 ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-white/5 text-gray-300'
            }`}>
              <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
            </div>
          </div>
          <div className="p-6 overflow-y-auto flex-1 text-gray-300 font-sans leading-relaxed text-sm md:text-base prose prose-invert">
            <h3 className="font-bold text-white text-lg mb-4">{problem?.title}</h3>
            <ReactMarkdown>{problem?.description || ""}</ReactMarkdown>
          </div>
        </div>

        {/* Right Side: Scratchpad & Code */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e]">
          {!isFinished ? (
            <>
              <div className="p-4 bg-[#252525] border-b border-[#333] flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400 font-mono text-sm">
                  <Mic className="w-4 h-4 text-green-500 animate-pulse" /> Recording your "thoughts"
                </div>
                <button 
                  onClick={handleFinish}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                >
                  <StopCircle className="w-4 h-4" /> End Interview
                </button>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="// Type your thoughts, approach, complexity analysis, and code here...&#10;// Act as if this text box is what you are saying to the interviewer out loud."
                className="flex-1 w-full bg-transparent text-gray-300 font-mono p-6 focus:outline-none resize-none"
                spellCheck="false"
              />
            </>
          ) : (
            <div className="flex-1 bg-[#111] flex flex-col">
              <div className="p-6 border-b border-white/10 bg-[#1a1a1a] flex items-center justify-between sticky top-0 z-10">
                <h2 className="font-display font-bold text-2xl text-white flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-[var(--color-accent)]" /> 
                  Interview Feedback
                </h2>
                <button 
                  onClick={() => { setIsStarted(false); setIsFinished(false); setNotes(''); setTimeLeft(45*60); }}
                  className="text-sm font-mono text-gray-400 hover:text-white transition-colors"
                >
                  Start New Session
                </button>
              </div>
              <div className="p-8 overflow-y-auto flex-1 pb-32">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                    <div className="w-16 h-16 border-4 border-white/10 border-t-[var(--color-accent)] rounded-full animate-spin"></div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Analyzing your performance...</h3>
                      <p className="text-gray-400 font-mono text-sm">Evaluating communication, correctness, and edge cases.</p>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-invert prose-emerald max-w-3xl mx-auto">
                    <ReactMarkdown>{feedback}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
}
