'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle2, Sparkles, ChevronDown } from 'lucide-react';

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
  scrollCueText?: string;
  scrollButtonText?: string;
  onScrollRequest?: () => void;
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
  dateText = 'WEDNESDAY, DEC 09, 2026',
  venueText = 'Hotel Nalanda Regency, Rajgir',
  coupleName = 'Harsh & Rutbi',
  foilHeader = 'Mark Your Calendar, Ji! 📅',
  foilSubtitle = 'Tap or scratch to reveal',
  revealedPillText = '✦ Sacred Wedding Date ✦',
  celebrateNote = 'We eagerly await your presence!',
  revealedStatusText = 'Date Revealed! 🎉',
  swipeToScratchText = '✨ Tap or scratch to reveal',
  scrollCueText = 'Scroll down to explore celebrations',
  scrollButtonText = 'Scroll for Itinerary & Celebrations',
  onScrollRequest,
}: HeartScratchCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Spawn sparkling gold dust particles
  const spawnSparkles = useCallback((clientX?: number, clientY?: number) => {
    const canvas = canvasRef.current;
    let originX = 150;
    let originY = 80;

    if (canvas && clientX !== undefined && clientY !== undefined) {
      const rect = canvas.getBoundingClientRect();
      originX = clientX - rect.left;
      originY = clientY - rect.top;
    }

    const colors = ['#ffe082', '#ffd700', '#ffffff', '#f48fb1', '#ffecb3'];
    const newParticles: Particle[] = [];

    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i) / 18 + (Math.random() - 0.5);
      const speed = Math.random() * 3 + 1.5;
      newParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        size: Math.random() * 3 + 1.5,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];
  }, []);

  // Trigger celebration & reveal
  const handleReveal = useCallback((clientX?: number, clientY?: number) => {
    if (isRevealed) return;
    setIsRevealed(true);

    // Haptic feedback on supported mobile devices
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate(40);
      } catch {}
    }

    // Spawn local sparkle dust
    spawnSparkles(clientX, clientY);

    // Trigger royal wedding confetti
    confetti({
      particleCount: 55,
      spread: 75,
      origin: { y: 0.62 },
      colors: ['#d4af37', '#ffd700', '#f48fb1', '#ffffff', '#e85d75', '#fff1c2'],
      disableForReducedMotion: true,
    });
  }, [isRevealed, spawnSparkles]);

  // Particle animation loop
  useEffect(() => {
    const update = () => {
      if (particlesRef.current.length > 0) {
        particlesRef.current = particlesRef.current
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            alpha: p.alpha - 0.035,
          }))
          .filter((p) => p.alpha > 0);
        setParticles([...particlesRef.current]);
      }
      animFrameRef.current = requestAnimationFrame(update);
    };

    animFrameRef.current = requestAnimationFrame(update);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Draw ultra-luxurious gold metallic foil texture on canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const width = canvas.offsetWidth || 300;
    const height = canvas.offsetHeight || 190;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // 1. Radiant, warm champagne-gold metallic gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0.0, '#fff4d1'); // bright champagne shimmer
    grad.addColorStop(0.2, '#e6be64'); // royal gold
    grad.addColorStop(0.45, '#ca9837'); // rich amber gold
    grad.addColorStop(0.65, '#fae3a0'); // brilliant highlight band
    grad.addColorStop(0.85, '#bf8f2e'); // deep gold
    grad.addColorStop(1.0, '#ebd288'); // warm gold edge

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle metallic micro-sparkles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    for (let i = 0; i < 160; i++) {
      const px = Math.random() * width;
      const py = Math.random() * height;
      const pr = Math.random() * 1.2 + 0.3;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Double filigree gold borders
    ctx.strokeStyle = 'rgba(110, 75, 15, 0.45)';
    ctx.lineWidth = 1;
    // Outer hairline
    ctx.strokeRect(8, 8, width - 16, height - 16);
    // Inner hairline
    ctx.strokeRect(12, 12, width - 24, height - 24);

    // 4. Corner filigree brackets & diamonds
    const cSize = 14;
    const drawCorner = (x: number, y: number, dx: number, dy: number) => {
      ctx.strokeStyle = 'rgba(110, 75, 15, 0.65)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, y + dy * cSize);
      ctx.lineTo(x, y);
      ctx.lineTo(x + dx * cSize, y);
      ctx.stroke();

      // Corner dot
      ctx.fillStyle = '#7a4f08';
      ctx.beginPath();
      ctx.arc(x + dx * 4, y + dy * 4, 1.5, 0, Math.PI * 2);
      ctx.fill();
    };

    drawCorner(15, 15, 1, 1);
    drawCorner(width - 15, 15, -1, 1);
    drawCorner(15, height - 15, 1, -1);
    drawCorner(width - 15, height - 15, -1, -1);

    // 5. Center Royal Emblem & Calendar Icon
    const cx = width / 2;
    const cy = height / 2 - 14;

    // Medallion outer ring
    ctx.strokeStyle = 'rgba(120, 80, 15, 0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 23, 0, Math.PI * 2);
    ctx.stroke();

    // Center calendar icon
    ctx.strokeStyle = '#8c2d42';
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const calW = 20;
    const calH = 18;
    const calX = cx - calW / 2;
    const calY = cy - 9;

    // Calendar body
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') {
      (ctx as any).roundRect(calX, calY, calW, calH, 3.5);
    } else {
      ctx.strokeRect(calX, calY, calW, calH);
    }
    ctx.stroke();

    // Top rings
    ctx.beginPath();
    ctx.moveTo(calX + 4.5, calY - 3.5);
    ctx.lineTo(calX + 4.5, calY);
    ctx.moveTo(calX + calW - 4.5, calY - 3.5);
    ctx.lineTo(calX + calW - 4.5, calY);
    ctx.stroke();

    // Top header line
    ctx.beginPath();
    ctx.moveTo(calX, calY + 5.5);
    ctx.lineTo(calX + calW, calY + 5.5);
    ctx.stroke();

    // Center heart inside calendar
    ctx.fillStyle = '#8c2d42';
    ctx.font = '9px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('♥', cx, calY + 11.5);

    // Flourish horizontal lines
    ctx.strokeStyle = 'rgba(110, 75, 15, 0.55)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx - 75, cy);
    ctx.lineTo(cx - 34, cy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + 34, cy);
    ctx.lineTo(cx + 75, cy);
    ctx.stroke();

    // Small flourish diamonds
    const drawDiamond = (dx: number) => {
      ctx.fillStyle = '#7a4f08';
      ctx.beginPath();
      ctx.moveTo(dx, cy - 3.5);
      ctx.lineTo(dx + 3.5, cy);
      ctx.lineTo(dx, cy + 3.5);
      ctx.lineTo(dx - 3.5, cy);
      ctx.closePath();
      ctx.fill();
    };
    drawDiamond(cx - 55);
    drawDiamond(cx + 55);

    // 6. Foil Header Text (Refined Royal Serif)
    ctx.fillStyle = '#4c2202';
    ctx.font = '700 13px "Playfair Display", "Noto Serif Devanagari", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(foilHeader, cx, cy + 38);

    // 7. Foil Subtitle (Soft italic)
    ctx.font = '600 10.5px "Outfit", "Noto Serif Devanagari", sans-serif';
    ctx.fillStyle = '#6b430e';
    ctx.fillText(foilSubtitle, cx, cy + 54);
  }, [foilHeader, foilSubtitle]);

  useEffect(() => {
    initCanvas();
    const handleResize = () => initCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* ── Main Scratch Card Container ── */}
      <motion.div
        ref={containerRef}
        whileHover={!isRevealed ? { scale: 1.015 } : undefined}
        whileTap={!isRevealed ? { scale: 0.985 } : undefined}
        onClick={(e) => handleReveal(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          const t = e.touches[0];
          handleReveal(t ? t.clientX : undefined, t ? t.clientY : undefined);
        }}
        role="button"
        tabIndex={0}
        aria-label="Reveal wedding date"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleReveal();
          }
        }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '310px',
          aspectRatio: '16 / 9.8',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: isRevealed
            ? '0 16px 36px rgba(120, 25, 45, 0.18), 0 0 20px rgba(212, 175, 55, 0.25)'
            : '0 12px 28px rgba(138, 43, 66, 0.14), 0 4px 12px rgba(212, 175, 55, 0.22)',
          border: '1.5px solid rgba(212, 175, 55, 0.7)',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          cursor: isRevealed ? 'default' : 'pointer',
          outline: 'none',
          transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
        }}
      >
        {/* ══ REVEALED CONTENT UNDERNEATH (Luxurious Deep Wine & Gold) ══ */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(145deg, #460f1b 0%, #2f0813 55%, #4a121e 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 18px',
            textAlign: 'center',
            color: '#fff',
            overflow: 'hidden',
          }}
        >
          {/* Subtle gold floral mandala background watermark */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.08,
              backgroundImage: 'radial-gradient(#ffd700 0.8px, transparent 0.8px)',
              backgroundSize: '16px 16px',
              pointerEvents: 'none',
            }}
          />

          {/* Inner hairline gold frame with corner accents */}
          <div
            style={{
              position: 'absolute',
              inset: '7px',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '13px',
              pointerEvents: 'none',
            }}
          />

          {/* Top Pill Tag */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={isRevealed ? { scale: 1, opacity: 1 } : { scale: 0.85, opacity: 0.7 }}
            transition={{ delay: isRevealed ? 0.15 : 0, duration: 0.45 }}
            style={{
              background: 'linear-gradient(90deg, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.35) 50%, rgba(212,175,55,0.18) 100%)',
              border: '1px solid rgba(212,175,55,0.5)',
              borderRadius: '20px',
              padding: '2px 12px',
              marginBottom: '6px',
              backdropFilter: 'blur(4px)',
            }}
          >
            <span
              style={{
                fontSize: '8px',
                letterSpacing: '0.22em',
                color: '#ffe599',
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
            initial={{ y: 8, opacity: 0 }}
            animate={isRevealed ? { y: 0, opacity: 1 } : { y: 0, opacity: 0.8 }}
            transition={{ delay: isRevealed ? 0.25 : 0, duration: 0.5 }}
            style={{
              fontFamily: "'Great Vibes', 'Rozha One', 'Noto Serif Devanagari', cursive",
              fontSize: '24px',
              color: '#ffe082',
              margin: '0 0 2px 0',
              lineHeight: '1.2',
              textShadow: '0 2px 10px rgba(0,0,0,0.6)',
            }}
          >
            {coupleName}
          </motion.p>

          {/* Date Text — Majestic serif with bright gold gradient */}
          <motion.p
            initial={{ y: 8, opacity: 0 }}
            animate={isRevealed ? { y: 0, opacity: 1 } : { y: 0, opacity: 0.8 }}
            transition={{ delay: isRevealed ? 0.35 : 0, duration: 0.5 }}
            style={{
              fontFamily: "'Playfair Display', 'Noto Serif Devanagari', serif",
              fontSize: '17px',
              fontWeight: '700',
              letterSpacing: '0.04em',
              background: 'linear-gradient(180deg, #ffffff 0%, #ffeaa7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '2px 0 4px 0',
              textShadow: '0 2px 8px rgba(0,0,0,0.4)',
            }}
          >
            {dateText}
          </motion.p>

          {/* Venue & Location */}
          <motion.p
            initial={{ y: 8, opacity: 0 }}
            animate={isRevealed ? { y: 0, opacity: 1 } : { y: 0, opacity: 0.6 }}
            transition={{ delay: isRevealed ? 0.45 : 0, duration: 0.5 }}
            style={{
              fontSize: '10.5px',
              letterSpacing: '0.04em',
              color: '#f8bbd0',
              margin: 0,
              fontWeight: '600',
              fontFamily: "'Outfit', 'Noto Serif Devanagari', sans-serif",
            }}
          >
            📍 {venueText}
          </motion.p>

          {/* Celebration note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px' }}
          >
            <span style={{ color: '#d4af37', fontSize: '9px' }}>✦</span>
            <span
              style={{
                fontSize: '9px',
                color: '#fce4ec',
                fontStyle: 'italic',
                fontFamily: "'Noto Serif Devanagari', sans-serif",
              }}
            >
              {celebrateNote}
            </span>
            <span style={{ color: '#d4af37', fontSize: '9px' }}>✦</span>
          </motion.div>
        </div>

        {/* ══ INTERACTIVE GOLD METALLIC FOIL CANVAS ══ */}
        <motion.canvas
          ref={canvasRef}
          animate={{
            opacity: isRevealed ? 0 : 1,
            scale: isRevealed ? 1.08 : 1,
            filter: isRevealed ? 'blur(6px)' : 'blur(0px)',
          }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: isRevealed ? 'none' : 'auto',
            touchAction: 'none',
            zIndex: 10,
          }}
        />

        {/* Dynamic Light Gleam across metallic foil */}
        {!isRevealed && (
          <motion.div
            animate={{
              x: ['-120%', '240%'],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              repeatDelay: 2,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '45%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)',
              transform: 'skewX(-25deg)',
              pointerEvents: 'none',
              zIndex: 12,
            }}
          />
        )}

        {/* Floating Sparkle Particles (rendered during interaction) */}
        {particles.map((p, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: '50%',
              backgroundColor: p.color,
              opacity: p.alpha,
              pointerEvents: 'none',
              zIndex: 20,
              boxShadow: `0 0 6px ${p.color}`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </motion.div>

      {/* ── Status & Hint Indicator with Clear Scroll Cue ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '320px',
          marginTop: '10px',
          padding: '0 4px',
          gap: '6px',
        }}
      >
        {isRevealed ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                color: '#2e7d32',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontFamily: "'Outfit', 'Noto Serif Devanagari', sans-serif",
                background: 'rgba(232, 245, 233, 0.75)',
                padding: '3px 12px',
                borderRadius: '9999px',
                border: '1px solid rgba(46, 125, 50, 0.25)',
              }}
            >
              <CheckCircle2 size={13} color="#2e7d32" />
              <span>{revealedStatusText}</span>
            </div>

            {/* Glowing Scroll Call-to-Action Button */}
            <button
              type="button"
              onClick={() => {
                if (onScrollRequest) {
                  onScrollRequest();
                } else {
                  const target = document.getElementById('wedding-details-start');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.scrollBy({ top: 400, behavior: 'smooth' });
                  }
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 243, 205, 0.90) 100%)',
                border: '1.5px solid rgba(212, 175, 55, 0.75)',
                padding: '7px 18px',
                borderRadius: '9999px',
                boxShadow: '0 4px 16px rgba(212, 175, 55, 0.35), inset 0 1px 1px #fff',
                cursor: 'pointer',
                color: '#8c2d42',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.04em',
                fontFamily: "'Outfit', 'Noto Serif Devanagari', sans-serif",
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <span>{scrollButtonText}</span>
              <ChevronDown size={14} color="#8c2d42" className="animate-bounce" />
            </button>
          </motion.div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              width: '100%',
            }}
          >
            <span
              style={{
                fontSize: '10.5px',
                color: '#8c2d42',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: '600',
                fontFamily: "'Outfit', 'Noto Serif Devanagari', sans-serif",
              }}
            >
              <Sparkles size={12} color="#d4af37" className="animate-spin-slow" />
              {swipeToScratchText}
            </span>

            <span
              onClick={() => {
                if (onScrollRequest) {
                  onScrollRequest();
                } else {
                  const target = document.getElementById('wedding-details-start');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.scrollBy({ top: 400, behavior: 'smooth' });
                  }
                }
              }}
              style={{
                fontSize: '9.5px',
                color: '#9a3412',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                fontWeight: '600',
                letterSpacing: '0.03em',
                opacity: 0.9,
                fontFamily: "'Outfit', 'Noto Serif Devanagari', sans-serif",
              }}
            >
              <span>{scrollCueText}</span>
              <ChevronDown size={11} color="#9a3412" className="animate-bounce" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
