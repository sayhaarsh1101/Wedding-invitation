'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface HeartScratchCardProps {
  dateText?: string;
  venueText?: string;
  coupleName?: string;
  foilHeader?: string;
  foilSubtitle?: string;
  revealedPillText?: string;
  celebrateNote?: string;
  revealedStatusText?: string;
  autoRevealText?: string;
  swipeToScratchText?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export default function HeartScratchCard({
  dateText = 'DECEMBER 09, 2026',
  venueText = 'Hotel Nalanda Regency, Rajgir',
  coupleName = 'Harsh & Rutbi',
  foilHeader = 'SCRATCH TO REVEAL DATE',
  foilSubtitle = '✦ USE YOUR FINGER OR MOUSE ✦',
  revealedPillText = '✦ Sacred Date Revealed ✦',
  celebrateNote = 'We cannot wait to celebrate with you!',
  revealedStatusText = 'Date Revealed! 🎉',
  autoRevealText = 'Auto Reveal ✨',
  swipeToScratchText = 'Swipe to scratch',
}: HeartScratchCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isScratching, setIsScratching] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Initialize canvas with rich gold foil texture
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.offsetWidth || 340;
    const height = canvas.offsetHeight || 190;
    canvas.width = width;
    canvas.height = height;

    // Rich multi-stop metallic gold gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#f9e8a2');
    grad.addColorStop(0.2, '#d4af37');
    grad.addColorStop(0.4, '#aa771c');
    grad.addColorStop(0.6, '#f9e8a2');
    grad.addColorStop(0.8, '#c59b27');
    grad.addColorStop(1, '#e6ca65');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Add subtle luxury sparkle / noise texture to the foil
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    for (let i = 0; i < 300; i++) {
      const px = Math.random() * width;
      const py = Math.random() * height;
      const pr = Math.random() * 1.5;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Inner gold border line on foil
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Decorative corner brackets on the foil
    const cornerSize = 14;
    ctx.strokeStyle = '#6b4c05';
    ctx.lineWidth = 2;

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(14, 14 + cornerSize);
    ctx.lineTo(14, 14);
    ctx.lineTo(14 + cornerSize, 14);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(width - 14 - cornerSize, 14);
    ctx.lineTo(width - 14, 14);
    ctx.lineTo(width - 14, 14 + cornerSize);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(14, height - 14 - cornerSize);
    ctx.lineTo(14, height - 14);
    ctx.lineTo(14 + cornerSize, height - 14);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(width - 14 - cornerSize, height - 14);
    ctx.lineTo(width - 14, height - 14);
    ctx.lineTo(width - 14, height - 14 - cornerSize);
    ctx.stroke();

    // Center Gold Icon (Sparkle/Coin symbol)
    ctx.fillStyle = '#5c3d05';
    ctx.font = 'bold 22px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨', width / 2, height / 2 - 22);

    // Foil Header Typography
    ctx.font = 'bold 12px "Playfair Display", "Noto Serif Devanagari", Georgia, serif';
    ctx.letterSpacing = '1.5px';
    ctx.fillStyle = '#4a3002';
    ctx.fillText(foilHeader, width / 2, height / 2 + 6);

    // Foil Subtitle
    ctx.font = '500 10px "Plus Jakarta Sans", "Noto Serif Devanagari", sans-serif';
    ctx.letterSpacing = '1.2px';
    ctx.fillStyle = '#6b4c05';
    ctx.fillText(foilSubtitle, width / 2, height / 2 + 28);
  }, [foilHeader, foilSubtitle]);

  useEffect(() => {
    initCanvas();
    window.addEventListener('resize', initCanvas);
    return () => window.removeEventListener('resize', initCanvas);
  }, [initCanvas]);

  // Trigger celebratory confetti on reveal
  const triggerCelebration = useCallback(() => {
    setIsRevealed(true);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#f48fb1', '#ffffff', '#e85d75', '#ffe082'],
    });
  }, []);

  // Calculate scratched surface percentage
  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparentPixels = 0;

      // Sample every 4th pixel for performance
      for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] < 128) {
          transparentPixels++;
        }
      }

      const totalSampled = pixels.length / 16;
      const percentage = (transparentPixels / totalSampled) * 100;
      setScratchPercent(Math.round(percentage));

      // Once 10% is scratched, automatically reveal with celebration
      if (percentage >= 10 && !isRevealed) {
        triggerCelebration();
      }
    } catch {
      // Fallback
    }
  }, [isRevealed, triggerCelebration]);

  // Emit gold sparkle dust particles while scratching
  const spawnParticles = (x: number, y: number) => {
    const colors = ['#ffe082', '#d4af37', '#ffffff', '#ffca28'];
    for (let i = 0; i < 4; i++) {
      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3 - 1,
        size: Math.random() * 3 + 2,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  };

  // Perform scratch brush operation
  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    // Brush with soft radial gradient edge
    ctx.globalCompositeOperation = 'destination-out';
    const brushRadius = 26;
    const brushGrad = ctx.createRadialGradient(x, y, 0, x, y, brushRadius);
    brushGrad.addColorStop(0, 'rgba(0,0,0,1)');
    brushGrad.addColorStop(0.7, 'rgba(0,0,0,0.9)');
    brushGrad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = brushGrad;
    ctx.beginPath();
    ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
    ctx.fill();

    spawnParticles(clientX - rect.left, clientY - rect.top);
    checkScratchPercentage();
  };

  // Particle animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateParticles = () => {
      if (particlesRef.current.length > 0) {
        particlesRef.current = particlesRef.current
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            alpha: p.alpha - 0.04,
          }))
          .filter((p) => p.alpha > 0);
      }
      animFrameRef.current = requestAnimationFrame(updateParticles);
    };

    animFrameRef.current = requestAnimationFrame(updateParticles);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* ── Main Scratch Card Container ── */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '350px',
          height: '195px',
          borderRadius: '22px',
          overflow: 'hidden',
          boxShadow: '0 14px 35px rgba(120, 30, 50, 0.18), 0 2px 6px rgba(212, 175, 55, 0.25)',
          border: '2px solid rgba(212, 175, 55, 0.75)',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          background: '#ffffff',
        }}
      >
        {/* ══ REVEALED CONTENT UNDERNEATH ══ */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #2b0610 0%, #170208 50%, #2f0814 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 20px',
            textAlign: 'center',
            color: '#fff',
            overflow: 'hidden',
          }}
        >
          {/* Subtle background mandala pattern */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.12,
              backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />

          {/* Top Pill Tag */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: 'linear-gradient(90deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.4) 50%, rgba(212,175,55,0.2) 100%)',
              border: '1px solid rgba(212,175,55,0.6)',
              borderRadius: '12px',
              padding: '2px 12px',
              marginBottom: '6px',
            }}
          >
            <span
              style={{
                fontSize: '9px',
                letterSpacing: '0.24em',
                color: '#f9e8a2',
                fontWeight: '700',
                textTransform: 'uppercase',
                fontFamily: "'Playfair Display', 'Noto Serif Devanagari', serif",
              }}
            >
              {revealedPillText}
            </span>
          </motion.div>

          {/* Couple Names Script */}
          <p
            style={{
              fontFamily: "'Rozha One', 'Noto Serif Devanagari', 'Great Vibes', cursive",
              fontSize: '24px',
              color: '#ffd54f',
              margin: '0 0 2px 0',
              lineHeight: '1.2',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            {coupleName}
          </p>

          {/* Big Date Text */}
          <p
            style={{
              fontFamily: "'Playfair Display', 'Noto Serif Devanagari', serif",
              fontSize: '20px',
              fontWeight: '700',
              letterSpacing: '0.05em',
              background: 'linear-gradient(180deg, #ffffff 0%, #ffe082 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '2px 0 4px 0',
            }}
          >
            {dateText}
          </p>

          {/* Venue & Note */}
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.05em',
              color: '#f8bbd0',
              margin: 0,
              fontWeight: '500',
              fontFamily: "'Noto Serif Devanagari', 'Plus Jakarta Sans', sans-serif",
            }}
          >
            📍 {venueText}
          </p>

          {/* Heart icon indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
            <span style={{ color: '#d4af37', fontSize: '10px' }}>✦</span>
            <span
              style={{
                fontSize: '10px',
                color: '#ffcdd2',
                fontStyle: 'italic',
                fontFamily: "'Noto Serif Devanagari', sans-serif",
              }}
            >
              {celebrateNote}
            </span>
            <span style={{ color: '#d4af37', fontSize: '10px' }}>✦</span>
          </div>
        </div>

        {/* ══ INTERACTIVE GOLD METALLIC FOIL CANVAS ══ */}
        <motion.canvas
          ref={canvasRef}
          animate={{
            opacity: isRevealed ? 0 : 1,
            scale: isRevealed ? 1.05 : 1,
          }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          onMouseDown={(e) => {
            setIsScratching(true);
            scratch(e.clientX, e.clientY);
          }}
          onMouseMove={(e) => {
            if (isScratching) scratch(e.clientX, e.clientY);
          }}
          onMouseUp={() => setIsScratching(false)}
          onMouseLeave={() => setIsScratching(false)}
          onTouchStart={(e) => {
            setIsScratching(true);
            if (e.touches[0]) scratch(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchMove={(e) => {
            if (isScratching && e.touches[0]) scratch(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchEnd={() => setIsScratching(false)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            cursor: isRevealed ? 'default' : 'grab',
            pointerEvents: isRevealed ? 'none' : 'auto',
            touchAction: 'none',
            zIndex: 10,
          }}
        />

        {/* Shimmer light sweep across gold foil when not yet revealed */}
        {!isRevealed && (
          <motion.div
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '50%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)',
              transform: 'skewX(-25deg)',
              pointerEvents: 'none',
              zIndex: 12,
            }}
          />
        )}
      </div>

      {/* ── Status & Quick Reveal Helper ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '350px',
          marginTop: '10px',
          padding: '0 4px',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            color: isRevealed ? '#2e7d32' : '#8c2d42',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: "'Noto Serif Devanagari', 'Plus Jakarta Sans', sans-serif",
          }}
        >
          {isRevealed ? (
            <>
              <CheckCircle2 size={13} color="#2e7d32" />
              <span>{revealedStatusText}</span>
            </>
          ) : (
            <>
              <Sparkles size={12} color="#d4af37" />
              <span>{scratchPercent > 0 ? `${scratchPercent}%` : swipeToScratchText}</span>
            </>
          )}
        </span>

        {!isRevealed && (
          <button
            onClick={triggerCelebration}
            style={{
              background: 'none',
              border: 'none',
              color: '#8c2d42',
              fontSize: '11px',
              fontWeight: '700',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: '2px 6px',
              fontFamily: "'Noto Serif Devanagari', 'Plus Jakarta Sans', sans-serif",
            }}
          >
            {autoRevealText}
          </button>
        )}
      </div>
    </div>
  );
}