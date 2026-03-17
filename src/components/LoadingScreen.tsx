import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const EMOJIS = ['🧠', '💡', '⚡', '🎯'];

export function LoadingScreen() {
  const [emojiIndex, setEmojiIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setEmojiIndex((prev) => (prev + 1) % EMOJIS.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[var(--color-bg)] flex flex-col items-center justify-center z-50">
      <div className="relative w-32 h-32 flex items-center justify-center mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-[var(--color-accent)] border-t-transparent rounded-full opacity-50"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 border-4 border-[var(--color-secondary)] border-b-transparent rounded-full opacity-50"
        />
        <AnimatePresence mode="wait">
          <motion.span
            key={emojiIndex}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-6xl absolute"
          >
            {EMOJIS[emojiIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
      
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-xl font-mono text-[var(--color-accent)]"
      >
        LeetMind is cooking your solution...
      </motion.div>
    </div>
  );
}
