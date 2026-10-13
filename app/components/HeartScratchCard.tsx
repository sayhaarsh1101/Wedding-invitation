'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle2 } from 'lucide-react';

interface HeartScratchCardProps {
  dateText?: string;
  venueText?: string;
  coupleName?: string;
  foilHeader?: string;
  foilSubtitle?: string;
  revealedPillText?: string;
  celebrateNote?: string;
  revealedStatusText?: string;
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
  foilHeader = 'Scratch to Reveal Date',
  foilSubtitle = '\u2726 use your finger or mouse \u2726',
  revealedPillText = '✦ Sacred Date Revealed ✦',
  celebrateNote = 'We cannot wait to celebrate with you!',
  revealedStatusText = 'Date Revealed! 🎉',
    swipeToScratchText = '\u2728 Swipe to scratch',
}: HeartScratchCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isScratching, setIsScratching] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const canvasDataRef = useRef<ImageData | null>(null);
  const lastPosRef = useRef<{x: number; y: number} | null>(null);

  // Show animated finger hint after 1.5s if user hasn't interacted
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted && !isRevealed) {
        setShowHint(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [hasInteracted, isRevealed]);

  // Helper: draw rounded rect using arcTo (Safari-safe, no ctx.roundRect)
  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  // Initialize canvas with elegant gold foil texture (HiDPI aware)
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // If canvas already has scratch data, restore it instead of reinitializing
    if (canvasDataRef.current && scratchPercent > 0) {
      canvas.width = canvasDataRef.current.width;
      canvas.height = canvasDataRef.current.height;
      ctx.putImageData(canvasDataRef.current, 0, 0);
      return;
    }

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

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

    // Subtle luxury sparkle / noise texture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    for (let i = 0; i < 200; i++) {
      const px = Math.random() * width;
      const py = Math.random() * height;
      const pr = Math.random() * 1.2;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Decorative corner brackets
    ctx.strokeStyle = 'rgba(90, 60, 5, 0.5)';
    ctx.lineWidth = 1.5;
    const m = 10; const cLen = 22;
    // Top-left
    ctx.beginPath(); ctx.moveTo(m, m + cLen); ctx.lineTo(m, m); ctx.lineTo(m + cLen, m); ctx.stroke();
    // Top-right
    ctx.beginPath(); ctx.moveTo(width - m - cLen, m); ctx.lineTo(width - m, m); ctx.lineTo(width - m, m + cLen); ctx.stroke();
    // Bottom-left
    ctx.beginPath(); ctx.moveTo(m, height - m - cLen); ctx.lineTo(m, height - m); ctx.lineTo(m + cLen, height - m); ctx.stroke();
    // Bottom-right
    ctx.beginPath(); ctx.moveTo(width - m - cLen, height - m); ctx.lineTo(width - m, height - m); ctx.lineTo(width - m, height - m - cLen); ctx.stroke();

    // Center diamond ornament with flourish lines
    const cx = width / 2;
    const cy = height / 2 - 10;

    // Horizontal flourish lines
    ctx.strokeStyle = '#5c3d05';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx - 60, cy);
    ctx.lineTo(cx - 14, cy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 14, cy);
    ctx.lineTo(cx + 60, cy);
    ctx.stroke();

    // Diamond shape
    ctx.fillStyle = '#5c3d05';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 7);
    ctx.lineTo(cx + 7, cy);
    ctx.lineTo(cx, cy + 7);
    ctx.lineTo(cx - 7, cy);
    ctx.closePath();
    ctx.fill();

    // Inner diamond highlight
    ctx.fillStyle = '#f9e8a2';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 3);
    ctx.lineTo(cx + 3, cy);
    ctx.lineTo(cx, cy + 3);
    ctx.lineTo(cx - 3, cy);
    ctx.closePath();
    ctx.fill();

    // Foil Header — elegant italic
    ctx.fillStyle = '#4a3002';
    ctx.font = '600 11px "Playfair Display", "Noto Serif Devanagari", Georgia, serif';
    ctx.letterSpacing = '0.15em';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(foilHeader, cx, cy + 24);

    // Foil Subtitle — refined
    ctx.font = '400 10px "Plus Jakarta Sans", "Noto Serif Devanagari", sans-serif';
    ctx.fillStyle = '#6b4c05';
    ctx.fillText(foilSubtitle, cx, cy + 42);

    // Bottom swipe hint
    ctx.font = '400 9px "Plus Jakarta Sans", "Noto Serif Devanagari", sans-serif';
    ctx.fillStyle = 'rgba(90, 60, 5, 0.5)';
    ctx.fillText('↔', cx, height - 16);
  }, [foilHeader, foilSubtitle, scratchPercent]);

  useEffect(() => {
    initCanvas();
    const handleResize = () => {
      // Save canvas data before resize
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx && canvas.width > 0 && canvas.height > 0) {
          try {
            canvasDataRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
          } catch {}
        }
      }
      initCanvas();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas]);

  // Trigger celebratory confetti on reveal
  const triggerCelebration = useCallback(() => {
    setIsRevealed(true);
    setShowHint(false);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#f48fb1', '#ffffff', '#e85d75', '#ffe082'],
    });
    // Stop particle loop
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
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

      // Reveal at ~45% — requires real scratching effort
      if (percentage >= 45 && !isRevealed) {
        triggerCelebration();
      }
    } catch {
      // Fallback
    }
  }, [isRevealed, triggerCelebration]);

  // Emit gold sparkle dust particles while scratching
  const spawnParticles = (x: number, y: number) => {
    const colors = ['#ffe082', '#d4af37', '#ffffff', '#ffca28'];
    for (let i = 0; i < 3; i++) {
      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5 - 0.8,
        size: Math.random() * 2.5 + 1.5,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  };

  // Perform scratch brush operation — tiny precise stroke that follows finger path
  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width / dpr;
    const y = ((clientY - rect.top) / rect.height) * canvas.height / dpr;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(0,0,0,1)';

    const last = lastPosRef.current;
    if (last) {
      // Draw a stroke from last position to current — follows finger exactly
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      // First touch: dot
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    lastPosRef.current = { x, y };
    ctx.restore();

    spawnParticles(clientX - rect.left, clientY - rect.top);
    checkScratchPercentage();
  };

  // Particle animation loop (stops after reveal)
  useEffect(() => {
    if (isRevealed) return;

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
  }, [isRevealed]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* ── Main Scratch Card Container ── */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '300px',
          aspectRatio: '16 / 10',
          borderRadius: '18px',
          overflow: 'hidden',
          boxShadow: '0 12px 30px rgba(120, 30, 50, 0.15), 0 2px 6px rgba(212, 175, 55, 0.2)',
          border: '1.5px solid rgba(212, 175, 55, 0.6)',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          background: '#ffffff',
        }}
      >
        {/* ══ REVEALED CONTENT UNDERNEATH ══ */}
        <AnimatePresence>
          <motion.div
            initial={false}
            animate={{
              opacity: isRevealed ? 1 : 1,
              y: isRevealed ? 0 : 4,
            }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #2b0610 0%, #170208 50%, #2f0814 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '14px 18px',
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
                opacity: 0.1,
                backgroundImage: 'radial-gradient(#d4af37 0.5px, transparent 0.5px)',
                backgroundSize: '14px 14px',
              }}
            />

            {/* Top Pill Tag */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isRevealed ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0.6 }}
              transition={{ delay: isRevealed ? 0.2 : 0, duration: 0.5 }}
              style={{
                background: 'linear-gradient(90deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.4) 50%, rgba(212,175,55,0.2) 100%)',
                border: '1px solid rgba(212,175,55,0.5)',
                borderRadius: '12px',
                padding: '2px 10px',
                marginBottom: '5px',
              }}
            >
              <span
                style={{
                  fontSize: '8px',
                  letterSpacing: '0.2em',
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
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={isRevealed ? { y: 0, opacity: 1 } : { y: 0, opacity: 0.7 }}
              transition={{ delay: isRevealed ? 0.3 : 0, duration: 0.6 }}
              style={{
                fontFamily: "'Great Vibes', 'Rozha One', 'Noto Serif Devanagari', cursive",
                fontSize: '22px',
                color: '#ffd54f',
                margin: '0 0 2px 0',
                lineHeight: '1.2',
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              {coupleName}
            </motion.p>

            {/* Big Date Text */}
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={isRevealed ? { y: 0, opacity: 1 } : { y: 0, opacity: 0.7 }}
              transition={{ delay: isRevealed ? 0.4 : 0, duration: 0.6 }}
              style={{
                fontFamily: "'Playfair Display', 'Noto Serif Devanagari', serif",
                fontSize: '18px',
                fontWeight: '700',
                letterSpacing: '0.04em',
                background: 'linear-gradient(180deg, #ffffff 0%, #ffe082 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: '2px 0 3px 0',
              }}
            >
              {dateText}
            </motion.p>

            {/* Venue & Note */}
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={isRevealed ? { y: 0, opacity: 1 } : { y: 0, opacity: 0.5 }}
              transition={{ delay: isRevealed ? 0.5 : 0, duration: 0.6 }}
              style={{
                fontSize: '10px',
                letterSpacing: '0.04em',
                color: '#f8bbd0',
                margin: 0,
                fontWeight: '500',
                fontFamily: "'Noto Serif Devanagari', 'Plus Jakarta Sans', sans-serif",
              }}
            >
              📍 {venueText}
            </motion.p>

            {/* Celebrate note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}
            >
              <span style={{ color: '#d4af37', fontSize: '9px' }}>✦</span>
              <span
                style={{
                  fontSize: '9px',
                  color: '#ffcdd2',
                  fontStyle: 'italic',
                  fontFamily: "'Noto Serif Devanagari', sans-serif",
                }}
              >
                {celebrateNote}
              </span>
              <span style={{ color: '#d4af37', fontSize: '9px' }}>✦</span>
            </motion.div>
          </motion.div>
        </AnimatePresence>

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
            setHasInteracted(true);
            setShowHint(false);
            scratch(e.clientX, e.clientY);
          }}
          onMouseMove={(e) => {
            if (isScratching) scratch(e.clientX, e.clientY);
          }}
          onMouseUp={() => { setIsScratching(false); lastPosRef.current = null; }}
          onMouseLeave={() => { setIsScratching(false); lastPosRef.current = null; }}
          onTouchStart={(e) => {
            setIsScratching(true);
            setHasInteracted(true);
            setShowHint(false);
            if (e.touches[0]) scratch(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchMove={(e) => {
            if (isScratching && e.touches[0]) scratch(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchEnd={() => { setIsScratching(false); lastPosRef.current = null; }}
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

        {/* Shimmer light sweep across gold foil */}
        {!isRevealed && (
          <motion.div
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2.5,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '40%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)',
              transform: 'skewX(-25deg)',
              pointerEvents: 'none',
              zIndex: 12,
            }}
          />
        )}

        {/* ══ ANIMATED FINGER HINT ══ */}
        <AnimatePresence>
          {showHint && !isRevealed && !hasInteracted && (
            <motion.div
              key="finger-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 15,
                pointerEvents: 'none',
              }}
            >
              <motion.span
                animate={{ x: [-18, 18, -18] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{ fontSize: '28px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
              >
                👆
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Status & Quick Reveal Helper ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '300px',
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
            <span style={{ fontSize: '10px', color: '#9a6a75' }}>
              {scratchPercent > 0 ? `${scratchPercent}%` : swipeToScratchText}
            </span>
          )}
        </span>

      </div>
    </div>
  );
}
