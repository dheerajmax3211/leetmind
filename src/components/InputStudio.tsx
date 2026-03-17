import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, X, Code2, Zap, BookOpen, Briefcase, Brain, Sparkles } from 'lucide-react';
import { Language, Vibe, AIProvider } from '../types';

interface InputStudioProps {
  onSubmit: (problemText: string, images: string[], language: Language, vibe: Vibe, provider: AIProvider) => void;
}

const LANGUAGES: Language[] = ["Python", "JavaScript", "Java", "C++", "Go", "Rust", "TypeScript"];
const VIBES: { value: Vibe; icon: React.ElementType; label: string }[] = [
  { value: "Concise",  icon: Zap,       label: "Concise"   },
  { value: "Detailed", icon: BookOpen,   label: "Detailed"  },
  { value: "Interview",icon: Briefcase,  label: "Interview" },
];

const PROVIDERS: { value: AIProvider; label: string; icon: React.ElementType; color: string; activeClass: string }[] = [
  {
    value: "Claude",
    label: "Claude",
    icon: Brain,
    color: "#d97706",
    activeClass: "bg-amber-500 text-black font-bold shadow-[0_0_15px_rgba(217,119,6,0.4)]",
  },
  {
    value: "Gemini",
    label: "Gemini",
    icon: Sparkles,
    color: "#8b5cf6",
    activeClass: "bg-violet-500 text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.4)]",
  },
];

export function InputStudio({ onSubmit }: InputStudioProps) {
  const [problemText, setProblemText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [language, setLanguage] = useState<Language>("Python");
  const [vibe, setVibe] = useState<Vibe>("Concise");
  const [provider, setProvider] = useState<AIProvider>("Claude");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setImages(prev => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 min-h-screen flex flex-col"
    >
      <div className="text-center mb-12 mt-8">
        <motion.h1 
          animate={{ textShadow: ["0 0 10px #00ff88", "0 0 20px #00ff88", "0 0 10px #00ff88"] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl font-display font-bold text-white mb-4 flex items-center justify-center gap-4"
        >
          LeetMind <span className="text-4xl">🧠</span>
        </motion.h1>
        <p className="text-gray-400 font-mono">Your interactive, gamified LeetCode tutor</p>
      </div>

      <div className="space-y-8 flex-1">
        {/* Text Input */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <textarea
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            placeholder="Paste your LeetCode problem here..."
            className="relative w-full h-48 bg-[#1a1a1a] text-white font-mono p-6 rounded-xl border border-white/10 focus:border-[var(--color-accent)] focus:outline-none resize-none placeholder-gray-600"
          />
        </div>

        {/* Image Upload */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragging ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10' : 'border-white/20 hover:border-white/40'
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleImageUpload(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={(e) => handleImageUpload(e.target.files)}
          />
          <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-400 font-mono">Drop problem images here 📎 or click to browse</p>
        </div>

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="flex gap-4 overflow-x-auto py-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative shrink-0">
                <img src={img} alt="Upload preview" className="h-24 w-24 object-cover rounded-lg border border-white/20" />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Language Selector */}
          <div className="space-y-3">
            <label className="text-gray-400 font-mono text-sm flex items-center gap-2">
              <Code2 className="w-4 h-4" /> Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="w-full bg-[#1a1a1a] text-white font-mono p-4 rounded-xl border border-white/10 focus:border-[var(--color-accent)] focus:outline-none appearance-none"
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Vibe Toggle */}
          <div className="space-y-3">
            <label className="text-gray-400 font-mono text-sm flex items-center gap-2">
              <Zap className="w-4 h-4" /> Choose your vibe
            </label>
            <div className="flex gap-2 bg-[#1a1a1a] p-2 rounded-xl border border-white/10">
              {VIBES.map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setVibe(value)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg font-mono text-xs transition-all whitespace-nowrap ${
                    vibe === value 
                      ? 'bg-[var(--color-accent)] text-black font-bold shadow-[0_0_15px_rgba(0,255,136,0.3)]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Provider Toggle */}
          <div className="space-y-3">
            <label className="text-gray-400 font-mono text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> AI Engine
            </label>
            <div className="flex gap-2 bg-[#1a1a1a] p-2 rounded-xl border border-white/10">
              {PROVIDERS.map(({ value, label, icon: Icon, activeClass }) => (
                <button
                  key={value}
                  onClick={() => setProvider(value)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-mono text-xs transition-all ${
                    provider === value
                      ? activeClass
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSubmit(problemText, images, language, vibe, provider)}
          disabled={!problemText.trim() && images.length === 0}
          className="w-full py-6 mt-8 bg-[var(--color-accent)] text-black font-display font-bold text-2xl rounded-xl shadow-[0_0_30px_rgba(0,255,136,0.4)] hover:shadow-[0_0_50px_rgba(0,255,136,0.6)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          PROCEED →
        </motion.button>
      </div>
    </motion.div>
  );
}
