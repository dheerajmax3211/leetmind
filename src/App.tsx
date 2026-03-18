import React, { useState, useEffect } from 'react';
import { InputStudio } from './components/InputStudio';
import { LearningExperience } from './components/LearningExperience';
import { LoadingScreen } from './components/LoadingScreen';
import { fetchLeetMindSolution } from './services/claudeService';
import { fetchGeminiSolution } from './services/geminiService';
import { LeetMindResponse, Language, Vibe, AIProvider } from './types';
import { AlertCircle } from 'lucide-react';
import { Navigation } from './components/Navigation';
import { AnimatedPage } from './components/AnimatedPage';
import { PatternLibrary } from './components/PatternLibrary';
import { CuratedTracks } from './components/CuratedTracks';
import { MockInterview } from './components/MockInterview';
import { SystemDesign } from './components/SystemDesign';
import { BehavioralCoach } from './components/BehavioralCoach';
import { CheatSheets } from './components/CheatSheets';
import { Glossary } from './components/Glossary';
import { StudyPlanGenerator } from './components/StudyPlanGenerator';
import { CompanyTracks } from './components/CompanyTracks';
import { AnimatePresence } from 'motion/react';

export function Home({ initialQuery = '' }: { initialQuery?: string }) {
  const [appState, setAppState] = useState<'input' | 'loading' | 'experience' | 'error'>('input');
  const [solutionData, setSolutionData] = useState<Partial<LeetMindResponse> | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [lastParams, setLastParams] = useState<{language: Language, vibe: Vibe, provider: AIProvider} | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    if (initialQuery && appState === 'input') {
      handleSubmit(initialQuery, [], 'Python', 'Detailed', 'Gemini');
    }
  }, [initialQuery]);

  const handleSubmit = async (problemText: string, images: string[], language: Language, vibe: Vibe, provider: AIProvider) => {
    setAppState('loading');
    setErrorMessage('');
    setIsGenerating(true);
    setLastParams({ language, vibe, provider });

    const handleProgress = (partial: Partial<LeetMindResponse>) => {
      setSolutionData((prev) => ({ ...prev, ...partial, language }));
      setAppState('experience');
    };
    
    try {
      const data = provider === 'Gemini'
        ? await fetchGeminiSolution(problemText, images, language, vibe, handleProgress)
        : await fetchLeetMindSolution(problemText, images, language, vibe, handleProgress);
      data.language = language;
      setSolutionData(data);
      setAppState('experience');
    } catch (error: any) {
      console.error("Error fetching solution:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
      setAppState('error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setAppState('input');
    setSolutionData(null);
    setErrorMessage('');
  };

  const handleExploreNext = (topic: string) => {
    if (!lastParams) return;
    handleSubmit(topic, [], lastParams.language, lastParams.vibe, lastParams.provider);
  };

  return (
    <AnimatedPage>
      {appState === 'input' && (
        <InputStudio onSubmit={handleSubmit} />
      )}
      
      {appState === 'loading' && (
        <LoadingScreen />
      )}
      
      {appState === 'experience' && solutionData && (
        <LearningExperience 
          data={solutionData} 
          onReset={handleReset} 
          onExploreNext={handleExploreNext}
          isStreaming={isGenerating}
        />
      )}
      
      {appState === 'error' && (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#1a1a1a] border border-red-500/30 rounded-2xl p-8 text-center shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-4">Oops, something broke!</h2>
            <p className="text-gray-400 font-mono text-sm mb-8">{errorMessage}</p>
            <button 
              onClick={handleReset}
              className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-mono transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}

// Placeholder for other pages during phase 1 wireup
function PlaceholderPage({ title }: { title: string }) {
  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-display font-bold text-white mb-8">{title}</h1>
        <div className="p-12 text-center border border-dashed border-white/20 rounded-2xl text-gray-500 font-mono">
          {title} UI is currently under construction...
        </div>
      </div>
    </AnimatedPage>
  );
}

export default function App() {
  const [currentHash, setCurrentHash] = useState('');
  const [globalQuery, setGlobalQuery] = useState('');

  useEffect(() => {
    const handleStartTutor = (e: Event) => {
      const customEvent = e as CustomEvent<{ query: string }>;
      setGlobalQuery(customEvent.detail.query);
      window.location.hash = ''; // Force navigate to home
    };

    window.addEventListener('start-tutor', handleStartTutor);
    return () => window.removeEventListener('start-tutor', handleStartTutor);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash.replace('#', ''));
    };

    // Initial load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (currentHash) {
      case 'patterns': return <PatternLibrary key="patterns" />;
      case 'tracks': return <CuratedTracks key="tracks" />;
      case 'mock-interview': return <MockInterview key="mock" />;
      case 'system-design': return <SystemDesign key="sys" />;
      case 'behavioral': return <BehavioralCoach key="behav" />;
      case 'company': return <CompanyTracks key="comp" />;
      case 'cheatsheets': return <CheatSheets key="cheat" />;
      case 'glossary': return <Glossary key="gloss" />;
      case 'study-plan': return <StudyPlanGenerator key="plan" />;
      default: return <Home key="home" initialQuery={globalQuery} />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-white font-sans selection:bg-[var(--color-accent)] selection:text-black">
      <Navigation />
      <AnimatePresence mode="wait">
        {renderPage()}
      </AnimatePresence>
    </div>
  );
}

