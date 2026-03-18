import React, { useState, useEffect } from 'react';
import { AnimatedPage } from './AnimatedPage';
import { FileText, Download, Printer, Copy, CheckCircle2, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { fetchGeminiStream } from '../services/geminiGenericService';

export function CheatSheets() {
  const [selectedTopic, setSelectedTopic] = useState('arrays');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');

  const topics = [
    { id: 'arrays', name: 'Arrays & Strings' },
    { id: 'trees', name: 'Trees & Graphs' },
    { id: 'dp', name: 'Dynamic Programming' },
    { id: 'sql', name: 'SQL for Interviews' },
    { id: 'python', name: 'Python Collections' },
    { id: 'java', name: 'Java Utility Classes' },
    { id: 'cloud', name: 'Cloud Computing' },
    { id: 'sdlc', name: 'SDLC Models' }
  ];

  const generateCheatSheet = async (topicId: string) => {
    setIsGenerating(true);
    setMarkdownContent('');
    
    const topicName = topics.find(t => t.id === topicId)?.name || topicId;

    try {
      const systemPrompt = `You are an expert technical educator creating hyper-detailed interview cheat sheets.
Your specific topic is: ${topicName}.
Ensure this is highly detailed, extremely long, comprehensive, and exhaustive. 
Provide a high-quality markdown response. Use plenty of code blocks. Do not produce the 'same two topics' every time. Output a full curriculum cheat sheet specifically for ${topicName}.`;
      
      await fetchGeminiStream(
        systemPrompt,
        `Generate a massive interview cheat sheet on ${topicName}. Include all key templates and edge cases.`,
        'gemini-3-flash-preview',
        (chunk) => {
          setMarkdownContent(prev => prev + chunk);
        }
      );
    } catch (e) {
      console.error(e);
      setMarkdownContent('Failed to generate cheat sheet. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateCheatSheet(selectedTopic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopic]);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white">Cheat Sheets</h1>
              <p className="text-gray-400 font-mono mt-1 text-sm">Massive dynamically generated reference guides</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-[#1a1a1a] border border-white/10 hover:border-white/30 rounded-xl text-sm font-mono transition-colors flex items-center gap-2" onClick={() => window.print()}>
              <Printer className="w-4 h-4" /> Print
            </button>
            <button 
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-mono font-bold transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center gap-2"
              onClick={() => generateCheatSheet(selectedTopic)}
              disabled={isGenerating}
            >
              <Wand2 className="w-4 h-4" /> {isGenerating ? 'Generating...' : 'Regenerate'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-2">
            <h3 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4">Categories</h3>
            {topics.map(topic => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`w-full text-left px-4 py-3 rounded-xl font-mono text-sm transition-all flex items-center justify-between ${
                  selectedTopic === topic.id 
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold' 
                    : 'bg-transparent text-gray-400 border border-transparent hover:bg-white/5'
                }`}
              >
                {topic.name}
              </button>
            ))}
          </div>

          <div className="lg:col-span-3">
            <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-lg">
              <div className="px-6 py-4 bg-[#161616] border-b border-white/10 flex items-center justify-between">
                <h2 className="text-lg font-display font-bold text-white">
                  {topics.find(t => t.id === selectedTopic)?.name} Reference
                </h2>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-white transition"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy Content'}
                </button>
              </div>
              
              <div className="bg-[#1e1e1e] p-6 text-gray-300">
                {isGenerating && markdownContent.length === 0 ? (
                  <div className="h-[300px] flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="font-mono text-sm text-gray-400">Compiling extensive cheat sheet...</p>
                  </div>
                ) : (
                  <div className="prose prose-invert prose-indigo max-w-none">
                    <ReactMarkdown
                      components={{
                        code({node, inline, className, children, ...props}: any) {
                          const match = /language-(\w+)/.exec(className || '')
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus as any}
                              language={match[1]}
                              PreTag="div"
                              className="rounded-xl !bg-[#161616] border border-white/5"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-sm" {...props}>
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {markdownContent}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
