import React, { useState } from 'react';
import { InputStudio } from './components/InputStudio';
import { LearningExperience } from './components/LearningExperience';
import { LoadingScreen } from './components/LoadingScreen';
import { fetchLeetMindSolution } from './services/claudeService';
import { fetchGeminiSolution } from './services/geminiService';
import { LeetMindResponse, Language, Vibe, AIProvider } from './types';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<'input' | 'loading' | 'experience' | 'error'>('input');
  const [solutionData, setSolutionData] = useState<Partial<LeetMindResponse> | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [lastParams, setLastParams] = useState<{language: Language, vibe: Vibe, provider: AIProvider} | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleSubmit = async (problemText: string, images: string[], language: Language, vibe: Vibe, provider: AIProvider) => {
    setAppState('loading');
    setErrorMessage('');
    setIsGenerating(true);

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
    <div className="min-h-screen bg-[var(--color-bg)] text-white font-sans selection:bg-[var(--color-accent)] selection:text-black">
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
        <div className="min-h-screen flex items-center justify-center p-4">
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
    </div>
  );
}
