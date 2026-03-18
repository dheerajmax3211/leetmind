import React, { useState } from 'react';
import { AnimatedPage } from './AnimatedPage';
import { Building2, Search, Wand2, BookOpen, Cloud, Code2, Workflow } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchGeminiJson } from '../services/geminiGenericService';

interface GeneratedTopic {
  title: string;
  category: string; // e.g. "Algorithm", "Cloud", "SDLC", "System Design"
  reason: string;
}

interface CompanyTrackResponse {
  company: string;
  roleContext: string;
  topics: GeneratedTopic[];
}

export function CompanyTracks() {
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [trackData, setTrackData] = useState<CompanyTrackResponse | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!companyName.trim()) {
      setError('Please enter a company name.');
      return;
    }
    setError('');
    setIsGenerating(true);

    try {
      const systemPrompt = `You are an elite Tech Career Coach. The user wants to prepare for an interview at a specific company, and optionally provided a job description (JD).
Your job is to generate a massive, comprehensive list of ALL the programs, algorithms, architectural patterns, cloud concepts, and Software Development Life Cycle (SDLC) topics they must learn.
Include AT LEAST 20 highly specific, relevant topics. Be thorough.
Return strict JSON with this shape:
{
  "company": "string",
  "roleContext": "string - short summary of what this role entails based on JD and company",
  "topics": [
    {
      "title": "string - specific topic or algorithm (e.g., 'Consistent Hashing', 'AWS S3 Architecture', 'Merge K Sorted Lists', 'Agile Scrum SDLC')",
      "category": "Algorithm" | "System Design" | "Cloud" | "SDLC" | "Core Language",
      "reason": "short string explaining why it's asked here"
    }
  ]
}`;

      const prompt = `Company: ${companyName}\nJob Description (Optional): ${jobDescription}`;

      const data = await fetchGeminiJson<CompanyTrackResponse>(systemPrompt, prompt);
      
      // Ensure we have an array
      if (!data.topics || !Array.isArray(data.topics)) {
        throw new Error("Invalid response format from AI");
      }
      
      setTrackData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate track.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTopicClick = (topicName: string) => {
    window.dispatchEvent(new CustomEvent('start-tutor', { detail: { query: topicName } }));
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('Cloud')) return <Cloud className="w-4 h-4 text-blue-400" />;
    if (category.includes('Design') || category.includes('Architecture')) return <Workflow className="w-4 h-4 text-purple-400" />;
    if (category.includes('SDLC')) return <Workflow className="w-4 h-4 text-green-400" />;
    return <Code2 className="w-4 h-4 text-[var(--color-accent)]" />;
  };

  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white">Company Prep</h1>
              <p className="text-gray-400 font-mono mt-1 text-sm">Dynamic AI-generated curriculum for your target role</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#111] border border-white/10 rounded-3xl p-6">
              <h2 className="text-xl font-display font-bold text-white mb-6">Target Parameters</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Company Name *</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Google, Stripe, OpenAI"
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white font-mono text-sm focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Job Description (Optional)</label>
                  <textarea 
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the JD here to make the generated curriculum highly specific..."
                    className="w-full h-40 bg-[#1a1a1a] border border-white/10 rounded-xl p-4 text-white font-sans text-sm focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {error && <div className="text-red-400 text-sm font-mono p-3 bg-red-500/10 border border-red-500/20 rounded-xl">{error}</div>}

                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                >
                  {isGenerating ? (
                    <><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Analyzing...</>
                  ) : (
                    <><Wand2 className="w-5 h-5" /> Generate Track</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[500px] border border-white/10 rounded-3xl bg-[#111] flex flex-col items-center justify-center space-y-6"
                >
                  <div className="w-16 h-16 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin"></div>
                  <div className="text-center">
                    <h3 className="text-xl font-display font-bold text-white mb-2">Researching {companyName || 'Company'}...</h3>
                    <p className="text-gray-400 font-mono text-sm">Compiling algorithms, cloud concepts, and SDLC topics.</p>
                  </div>
                </motion.div>
              ) : trackData ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden"
                >
                  <div className="p-8 border-b border-white/10 bg-gradient-to-b from-blue-500/5 to-transparent">
                    <h2 className="text-3xl font-display font-bold text-white mb-2">{trackData.company} Interview Track</h2>
                    <p className="text-gray-400 leading-relaxed font-sans">{trackData.roleContext}</p>
                  </div>

                  <div className="p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Comprehensive Curriculum ({trackData.topics.length} topics)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {trackData.topics.map((topic, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => handleTopicClick(topic.title)}
                          className="flex flex-col text-left p-5 rounded-2xl bg-[#1a1a1a] border border-white/5 hover:border-blue-500/50 hover:bg-[#1f1f1f] transition-all group"
                        >
                          <div className="flex items-center justify-between mb-3 w-full">
                            <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-white/5 text-gray-300 flex items-center gap-1.5">
                              {getCategoryIcon(topic.category)}
                              {topic.category}
                            </span>
                          </div>
                          <span className="font-bold text-gray-200 group-hover:text-white mb-2 text-lg">{topic.title}</span>
                          <span className="text-sm text-gray-500 line-clamp-2">{topic.reason}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[500px] border border-white/5 border-dashed rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-[#111]">
                  <Building2 className="w-16 h-16 text-gray-600 mb-6" />
                  <h3 className="text-xl font-display font-bold text-white mb-2">No Company Selected</h3>
                  <p className="text-gray-400 max-w-sm">Enter a company name and job description to generate a targeted, highly comprehensive study track.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
