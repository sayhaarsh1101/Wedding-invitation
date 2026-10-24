'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface LanguageSwitchProps {
  currentLang: 'en' | 'hi';
}

export default function LanguageSwitch({ currentLang }: LanguageSwitchProps) {
  const targetHref = currentLang === 'en' ? '/hi' : '/';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed',
        top: '14px',
        right: '14px',
        zIndex: 80,
      }}
    >
      <Link
        href={targetHref}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 255, 255, 0.55) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.95)',
          padding: '7px 16px',
          borderRadius: '9999px',
          color: '#732335',
          fontSize: '11.5px',
          textDecoration: 'none',
          boxShadow: '0 8px 24px -4px rgba(115, 35, 53, 0.15), inset 0 1.5px 2px rgba(255, 255, 255, 1)',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
        }}
      >
        <span style={{ fontSize: '13px' }}>🌐</span>
        <span
          style={{
            color: currentLang === 'en' ? '#8c2d42' : '#8a6570',
            fontWeight: currentLang === 'en' ? '800' : '500',
          }}
        >
          EN
        </span>
        <span style={{ color: '#d4af37', fontSize: '10px' }}>|</span>
        <span
          style={{
            color: currentLang === 'hi' ? '#8c2d42' : '#8a6570',
            fontWeight: currentLang === 'hi' ? '800' : '500',
            fontFamily: "'Noto Serif Devanagari', serif",
            fontSize: '12px',
          }}
        >
          हिन्दी
        </span>
      </Link>
    </motion.div>
  );
}
