import React, { useState, useEffect } from 'react';
import { AnimatedPage } from './AnimatedPage';
import { Users, MessageSquare, Play, CheckCircle2, Star, ShieldAlert, Zap, Mic, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { fetchGeminiJson, fetchGeminiStream } from '../services/geminiGenericService';

interface BQuestion {
  id: string;
  category: string;
  text: string;
  hint: string;
}

export function BehavioralCoach() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedQuestion, setSelectedQuestion] = useState<BQuestion | null>(null);
  const [answer, setAnswer] = useState('');
  const [questions, setQuestions] = useState<BQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState('');

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'leadership', name: 'Leadership & Influence' },
    { id: 'conflict', name: 'Conflict Resolution' },
    { id: 'failure', name: 'Overcoming Failure' },
    { id: 'ambiguity', name: 'Navigating Ambiguity' },
    { id: 'indian_context', name: 'Indian Corporate / Startup Context' }
  ];

  const loadQuestions = async () => {
    setIsLoadingQuestions(true);
    try {
      const systemPrompt = `Generate 10 highly realistic behavioral interview questions.
It should be a mix of categories, including many questions specifically targeting real-world challenges in the Indian IT and Startup industry (e.g. strict deadlines, timezone differences, lack of specific requirements, hierarchical disagreements).
Return strict JSON with this shape:
{ "questions": [{ "id": "uuid", "category": "indian_context" | "leadership" | "conflict" | "failure" | "ambiguity", "text": "string - question text", "hint": "string - STAR method hint" }] }`;

      const response = await fetchGeminiJson<{ questions: BQuestion[] }>(systemPrompt, "Generate 10 behavioral questions.");
      setQuestions(response.questions);
    } catch (e) {
      console.error(e);
      // fallback
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const getFeedback = async () => {
    if (!selectedQuestion || answer.length < 50) return;
    setIsAnalyzing(true);
    setFeedback('');

    try {
      const systemPrompt = `You are an expert HR and Engineering Manager at a top-tier tech company.
The candidate is answering the following behavioral question: "${selectedQuestion.text}"
Their answer: "${answer}"

Provide a highly critical, detailed critique evaluating:
1. Did they follow the STAR method correctly?
2. Did they answer the core question?
3. Was the outcome/results impactful enough?
4. What could they improve (specifically highlighting any red flags or weak points)?

Respond in Markdown.`;

      await fetchGeminiStream(systemPrompt, `Evaluate my behavioral answer to "${selectedQuestion.text}"`, 'gemini-3-flash-preview', (chunk) => {
        setFeedback(prev => prev + chunk);
      });
    } catch (e) {
      setFeedback('Error analyzing response. Try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredQuestions = activeCategory === 'all' 
    ? questions 
    : questions.filter(q => q.category === activeCategory);

  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white">Behavioral Coach</h1>
              <p className="text-gray-400 font-mono mt-1 text-sm">Master the STAR method for cultural interviews</p>
            </div>
          </div>
          <button 
            onClick={loadQuestions} 
            disabled={isLoadingQuestions}
            className="flex items-center gap-2 px-4 py-2 bg-pink-500/10 text-pink-400 rounded-lg hover:bg-pink-500/20 font-bold transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingQuestions ? 'animate-spin' : ''}`} />
            Generate New Questions
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full font-mono text-xs transition-all ${
                    activeCategory === cat.id 
                      ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30 font-bold' 
                      : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {isLoadingQuestions && questions.length === 0 ? (
                <div className="text-center py-10 text-gray-500">Generating hyper-realistic questions...</div>
              ) : (
                filteredQuestions.map(q => (
                  <button
                    key={q.id}
                    onClick={() => { setSelectedQuestion(q); setAnswer(''); setFeedback(''); }}
                    className={`w-full text-left p-5 rounded-2xl border transition-all ${
                      selectedQuestion?.id === q.id
                        ? 'bg-white/10 border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.1)]'
                        : 'bg-[#111] border-white/5 hover:border-white/20 hover:bg-[#151515]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-pink-400 bg-pink-400/10 px-2 py-0.5 rounded">
                        {q.category.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-200 text-sm leading-relaxed">{q.text}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {selectedQuestion ? (
                <motion.div
                  key={selectedQuestion.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[700px]"
                >
                  <div className="p-8 border-b border-white/10 bg-[#161616]">
                    <h2 className="text-xl font-display font-bold text-white mb-4 leading-relaxed">{selectedQuestion.text}</h2>
                    <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-200/80 text-sm font-sans">
                      <Zap className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-yellow-500 block mb-1">Interviewer Hint:</span>
                        {selectedQuestion.hint}
                      </div>
                    </div>
                  </div>

                  {feedback.length > 0 || isAnalyzing ? (
                    <div className="flex-1 p-8 overflow-y-auto bg-[#0a0a0a]">
                       <h3 className="text-2xl font-display font-bold text-white mb-6">AI Critique</h3>
                       <div className="prose prose-invert prose-pink">
                         {isAnalyzing && feedback.length === 0 ? "Analyzing your response structure..." : <ReactMarkdown>{feedback}</ReactMarkdown>}
                       </div>
                    </div>
                  ) : (
                    <div className="flex-1 p-8 flex flex-col items-center justify-center bg-[#0a0a0a] relative">
                      <div className="absolute inset-x-0 top-0 flex items-center justify-center -translate-y-1/2">
                        <div className="px-4 py-1 bg-[#222] border border-white/10 rounded-full text-xs font-mono text-gray-400 flex items-center gap-2">
                          <Star className="w-3 h-3 text-[var(--color-accent)]" /> Remember the STAR Method
                        </div>
                      </div>

                      <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your answer here using the STAR method (Situation, Task, Action, Result)..."
                        className="w-full h-full bg-transparent resize-none text-gray-300 leading-relaxed font-sans focus:outline-none placeholder:text-gray-600"
                      />
                    </div>
                  )}

                  {!feedback && !isAnalyzing && (
                    <div className="p-4 border-t border-white/10 bg-[#161616] flex items-center justify-between">
                       <p className="text-xs font-mono text-gray-500">
                          {answer.split(' ').filter(w => w.length > 0).length} words
                       </p>
                      <button 
                        onClick={getFeedback}
                        className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                          answer.length > 50 
                            ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]' 
                            : 'bg-white/5 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={answer.length <= 50}
                      >
                        <MessageSquare className="w-5 h-5" /> Get AI Feedback
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="h-full min-h-[500px] border border-white/5 border-dashed rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-[#111]">
                  <MessageSquare className="w-16 h-16 text-gray-600 mb-6" />
                  <h3 className="text-xl font-display font-bold text-white mb-2">Select a Question</h3>
                  <p className="text-gray-400 max-w-sm">Choose a behavioral question from the bank to start practicing your STAR method responses.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
