'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

interface EnvelopeIntroProps {
  onOpen: () => void;
}

export default function EnvelopeIntro({ onOpen }: EnvelopeIntroProps) {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpen = () => {
    if (isOpened) return;
    setIsOpened(true);
    // Trigger the main page reveal after the envelope finishes unfolding
    setTimeout(() => {
      onOpen();
    }, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isOpened ? 0 : 1 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0206] px-4"
    >
      <div className="relative flex flex-col items-center">
        {/* Helper Hint */}
        {!isOpened && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }}
            className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]"
          >
            <Sparkles className="h-4 w-4" /> Tap Wax Seal to Unfold <Sparkles className="h-4 w-4" />
          </motion.p>
        )}

        {/* Outer Envelope Wrapper */}
        <div 
          onClick={handleOpen}
          className="relative h-[260px] w-[340px] sm:w-[420px] sm:h-[280px] cursor-pointer perspective-1000"
        >
          {/* Back Wall of Envelope */}
          <div className="absolute inset-0 rounded-lg bg-[#3a080f] shadow-2xl border border-[#d4af37]/30" />

          {/* Inner Invitation Card (Slides Up) */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: isOpened ? -140 : 0, scale: isOpened ? 1.05 : 1 }}
            transition={{ delay: 0.6, duration: 0.8, ease: 'easeInOut' }}
            className="absolute left-4 right-4 top-4 bottom-4 z-10 flex flex-col items-center justify-center rounded-md border border-[#d4af37] bg-[#2b040a] p-6 text-center shadow-lg"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37]">
              Shubh Vivah
            </span>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#ffe082]">
              Harsh &amp; Rutbi
            </h2>
            <p className="mt-1 text-[11px] tracking-widest text-[#fecdd3]">
              DECEMBER 9, 2026
            </p>
          </motion.div>

          {/* Envelope Pocket (Bottom & Sides - Over the Card) */}
          <div 
            className="absolute inset-0 z-20 pointer-events-none rounded-lg"
            style={{
              clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%, 50% 50%)',
              background: 'linear-[#3a080f]',
              backgroundColor: '#32060c',
              borderBottom: '2px solid #d4af37',
              boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.5)'
            }}
          />

          {/* 3D Top Flap */}
          <motion.div
            initial={{ rotateX: 0 }}
            animate={{ rotateX: isOpened ? 180 : 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top center' }}
            className="absolute left-0 right-0 top-0 h-[140px] z-30 pointer-events-none"
          >
            <div 
              className="h-full w-full rounded-t-lg bg-[#440a12] border-t border-[#d4af37]"
              style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
              }}
            />
          </motion.div>

          {/* Wax Seal Button (Breaks/Fades away) */}
          <motion.div
            animate={{ 
              scale: isOpened ? 1.3 : 1, 
              opacity: isOpened ? 0 : 1 
            }}
            transition={{ duration: 0.4 }}
            className="absolute top-[120px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#d4af37] shadow-xl border-2 border-[#fff8f0] cursor-pointer"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#8B0000] bg-[#a81c24] text-[#ffe082]">
              <Heart className="h-6 w-6 fill-[#ffe082]" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}