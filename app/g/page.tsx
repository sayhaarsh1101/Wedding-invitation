'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Clock,
  Car,
  Building,
  Mail,
  Shirt,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Camera,
  CheckCircle2,
  MapPin,
  Calendar,
  Heart,
} from 'lucide-react';
import HeartScratchCard from '../components/HeartScratchCard';
import CountdownTimer from '../components/CountdownTimer';
import EnvelopeIntro from '../components/EnvelopeIntro';
import LanguageSwitch from '../components/LanguageSwitch';

// Google Apps Script Web App URL for RSVP Responses
const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxxpyCpncoO_JnM22kcPpVYdPNXVs6sOp4mIs69qlp7waSmKxtkemu7GsuvP9t0RLV8/exec';

/* ─── Floating Particles Component ─── */
function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: { x: number; y: number; size: number; speedY: number; speedX: number; opacity: number; hue: string; }[] = [];

    const hues = [
      'rgba(212, 175, 55, ',    // gold
      'rgba(140, 45, 66, ',     // maroon
      'rgba(248, 182, 194, ',   // pink
      'rgba(255, 215, 0, ',     // bright gold
      'rgba(220, 180, 140, ',   // champagne
    ];

    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        speedY: -(Math.random() * 0.4 + 0.1),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.15,
        hue: hues[Math.floor(Math.random() * hues.length)],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const p of particles) {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < -10) { p.y = window.innerHeight + 10; p.x = Math.random() * window.innerWidth; }
        if (p.x < -10) p.x = window.innerWidth + 10;
        if (p.x > window.innerWidth + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.hue + p.opacity + ')';
        ctx.fill();

        // subtle glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.hue + (p.opacity * 0.2) + ')';
        ctx.fill();
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }} />;
}

/* ─── Scroll Reveal Wrapper ─── */
function RevealOnScroll({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Gold Shimmer Effect ─── */
function GoldShimmer({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit', pointerEvents: 'none', ...style }}>
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(212, 175, 55, 0.08) 60deg, transparent 120deg, rgba(212, 175, 55, 0.05) 180deg, transparent 240deg, rgba(212, 175, 55, 0.08) 300deg, transparent 360deg)',
        animation: 'shimmerSpin 12s linear infinite',
      }} />
    </div>
  );
}

/* ─── Ornamental Divider ─── */
function OrnamentalDivider({ color = '#d4af37', width = '200px' }: { color?: string; width?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', margin: '8px auto 16px auto', maxWidth: width }}>
      <svg viewBox="0 0 60 12" style={{ width: '50px', height: '10px', opacity: 0.6 }}>
        <path d="M0 6 Q 15 0, 30 6 Q 45 12, 60 6" fill="none" stroke={color} strokeWidth="1" />
      </svg>
      <span style={{ color, fontSize: '10px', margin: '0 6px' }}>✦</span>
      <svg viewBox="0 0 60 12" style={{ width: '50px', height: '10px', opacity: 0.6, transform: 'scaleX(-1)' }}>
        <path d="M0 6 Q 15 0, 30 6 Q 45 12, 60 6" fill="none" stroke={color} strokeWidth="1" />
      </svg>
    </div>
  );
}

/* ─── Animated Border Glow for Event Cards ─── */
function GlowBorder({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', borderRadius: '24px', padding: '1.5px' }}>
      <div style={{ position: 'absolute', inset: '-1px', borderRadius: '25px', background: `linear-gradient(135deg, ${color}40 0%, transparent 50%, ${color}25 100%)`, opacity: 0.7, animation: 'borderPulse 4s ease-in-out infinite' }} />
      <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

export default function GroomWeddingInvitation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Form State & Feedback
  const [rsvpForm, setRsvpForm] = useState<{
    name: string;
    contact: string | null;
    attending: string;
    message: string;
  }>({
    name: '',
    contact: null,
    attending: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const scrollToCelebrations = () => {
    const target = document.getElementById('wedding-details-start');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: 400, behavior: 'smooth' });
    }
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wasPlayingBeforeHiddenRef = useRef<boolean>(false);

  const weddingVenueName = 'Hotel Nalanda Regency';
  const weddingVenueAddress = 'Dangi Tola, Near Bus Stand, NH 82, Rajgir, Bihar - 803116';

  const googleMapsWeddingUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${weddingVenueName}, ${weddingVenueAddress}`
  )}`;

  const googleMapsJhajhaUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Jhajha, Bihar, India'
  )}`;

  const galleryImages = [
    { src: '/images/gallery-4.jpg', title: 'When It All Began', desc: 'A stolen smile that turned into forever' },
    { src: '/images/gallery-3.jpg', title: 'Our Favorite Days', desc: 'Just two goofy souls laughing at our own jokes' },
    { src: '/images/gallery-2.jpg', title: 'Partners in Crime', desc: 'From quick chai dates to lifelong adventures' },
    { src: '/images/gallery-1.jpg', title: 'Ready for Dec 9', desc: 'Counting down to our happiest day with you' },
  ];

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isOpen, galleryImages.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  // Preload gallery images when envelope opens
  useEffect(() => {
    if (!isOpen) return;
    galleryImages.forEach((img) => {
      const preload = new Image();
      preload.src = img.src;
    });
  }, [isOpen]);

  // Audio Lifecycle
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = 0.3;

    const pauseMusic = () => {
      if (audioRef.current && !audioRef.current.paused) {
        wasPlayingBeforeHiddenRef.current = true;
        audioRef.current.pause();
      }
    };
    const resumeMusic = () => {
      if (!document.hidden && wasPlayingBeforeHiddenRef.current && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    };
    const handleVisibilityChange = () => { if (document.hidden) pauseMusic(); else resumeMusic(); };
    const handleWindowBlur = () => pauseMusic();
    const handleWindowFocus = () => resumeMusic();
    const handlePageHide = () => { if (audioRef.current) audioRef.current.pause(); };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handlePageHide);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handlePageHide);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const handleStartOpen = async () => {
    if (audioRef.current) {
      try { audioRef.current.volume = 0.3; await audioRef.current.play(); wasPlayingBeforeHiddenRef.current = true; }
      catch { wasPlayingBeforeHiddenRef.current = false; }
    }
  };
  const handleOpenComplete = () => setIsOpen(true);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (!audioRef.current.paused) { audioRef.current.pause(); wasPlayingBeforeHiddenRef.current = false; }
    else { audioRef.current.volume = 0.3; audioRef.current.play().catch(() => {}); wasPlayingBeforeHiddenRef.current = true; }
  };

  const handleGoogleSheetsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...rsvpForm, contact: null, side: 'groom' }),
      });
      setIsSubmitted(true);
      setRsvpForm({ name: '', contact: null, attending: '', message: '' });
    } catch {
      setIsSubmitted(true);
      setRsvpForm({ name: '', contact: null, attending: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── UPGRADED LUXURY STYLES ─── //
  const sectionCardStyle: React.CSSProperties = {
    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 250, 252, 0.58) 50%, rgba(255, 248, 240, 0.4) 100%)',
    backdropFilter: 'blur(28px) saturate(200%)',
    WebkitBackdropFilter: 'blur(28px) saturate(200%)',
    borderRadius: '32px',
    padding: '36px 24px',
    marginBottom: '28px',
    boxShadow: '0 24px 56px -14px rgba(115, 35, 53, 0.12), 0 8px 16px -8px rgba(212, 175, 55, 0.08), inset 0 2px 3px 0 rgba(255, 255, 255, 0.98), inset 0 -2px 3px 0 rgba(212, 175, 55, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.88)',
    textAlign: 'center',
    color: '#4a232b',
    position: 'relative',
    overflow: 'hidden',
  };

  const cursiveHeaderStyle: React.CSSProperties = {
    fontFamily: "'Great Vibes', cursive",
    fontSize: '36px',
    color: '#8c2d42',
    margin: '0 0 4px 0',
    fontWeight: 'normal',
    textShadow: '0 2px 12px rgba(140, 45, 66, 0.1)',
  };

  const eventPodBase: React.CSSProperties = {
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.95)',
    borderRadius: '24px',
    padding: '20px 18px',
    position: 'relative',
    overflow: 'hidden',
  };

  const dayBadgeBase: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    borderRadius: '9999px',
    padding: '6px 18px',
    marginBottom: '12px',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06), inset 0 1px 2px rgba(255, 255, 255, 1)',
    fontSize: '9.5px',
    fontWeight: '700',
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
  };

  const timeBadgeBase: React.CSSProperties = {
    fontSize: '9px',
    fontWeight: '700',
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    padding: '5px 13px',
    borderRadius: '9999px',
    border: '1px solid rgba(255, 255, 255, 0.95)',
    boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 1), 0 3px 10px rgba(0, 0, 0, 0.06)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '14px 20px',
    borderRadius: '9999px',
    border: '1.5px solid rgba(212, 175, 55, 0.2)',
    fontSize: '13px',
    outline: 'none',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 250, 245, 0.6) 100%)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: 'inset 0 2px 3px rgba(255, 255, 255, 0.98), 0 3px 10px rgba(115, 35, 53, 0.04)',
    color: '#4a232b',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #fdf6f7 0%, #fceef1 20%, #fff8f0 45%, #fdf2f5 65%, #fef6e8 85%, #fcf0f2 100%)',
        color: '#3b111a',
        fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
        fontWeight: '500',
        position: 'relative',
        paddingBottom: '80px',
        overflowX: 'hidden',
      }}
    >
      {/* Global Keyframes */}
      <style>{`
        @keyframes shimmerSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes borderPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes goldPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.15), inset 0 1.5px 2px rgba(255, 255, 255, 1); }
          50% { box-shadow: 0 0 32px rgba(212, 175, 55, 0.3), inset 0 1.5px 2px rgba(255, 255, 255, 1); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Luxury Ambient Lighting Orbs — enhanced */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-8%', left: '-18%', width: '450px', height: '450px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(244, 182, 194, 0.45) 0%, rgba(248, 218, 224, 0.15) 50%, transparent 70%)', filter: 'blur(70px)', animation: 'float 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '20%', right: '-18%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(245, 230, 180, 0.1) 50%, transparent 70%)', filter: 'blur(70px)', animation: 'float 10s ease-in-out infinite 2s' }} />
        <div style={{ position: 'absolute', top: '50%', left: '-12%', width: '480px', height: '480px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(140, 45, 66, 0.2) 0%, rgba(226, 114, 137, 0.08) 50%, transparent 70%)', filter: 'blur(70px)', animation: 'float 9s ease-in-out infinite 4s' }} />
        <div style={{ position: 'absolute', top: '78%', right: '-12%', width: '480px', height: '480px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.22) 0%, rgba(254, 240, 199, 0.08) 50%, transparent 70%)', filter: 'blur(70px)', animation: 'float 11s ease-in-out infinite 1s' }} />
      </div>

      {/* Floating Gold Particles */}
      {isOpen && <FloatingParticles />}

      <audio ref={audioRef} loop preload="auto" src="/audio/wedding-music.mp3" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />

      <LanguageSwitch currentLang="en" />

      {/* Floating Audio Control */}
      {(isOpen || isPlaying) && (
        <motion.button
          onClick={toggleAudio}
          aria-label="Toggle Audio"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          style={{
            position: 'fixed', bottom: '24px', right: '24px', zIndex: 60,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 248, 240, 0.65) 100%)',
            padding: '14px', borderRadius: '50%',
            border: '1.5px solid rgba(212, 175, 55, 0.3)',
            color: '#8c2d42', cursor: 'pointer',
            backdropFilter: 'blur(24px) saturate(200%)',
            WebkitBackdropFilter: 'blur(24px) saturate(200%)',
            boxShadow: '0 10px 28px -4px rgba(115, 35, 53, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.5), inset 0 2px 3px rgba(255, 255, 255, 1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            animation: isPlaying ? 'goldPulse 3s ease-in-out infinite' : 'none',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {isPlaying ? <Volume2 size={20} className="animate-pulse" /> : <VolumeX size={20} />}
        </motion.button>
      )}

      {/* ═══ ENVELOPE INTRO ═══ */}
      {!isOpen && <EnvelopeIntro onStartOpen={handleStartOpen} onOpen={handleOpenComplete} />}

      {/* ═══ MAIN INVITATION ═══ */}
      {isOpen && (
        <main style={{ maxWidth: '460px', margin: '0 auto', padding: '20px 18px 40px 18px' }}>

          {/* ══════════ HERO CARD ══════════ */}
          <motion.section
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative', borderRadius: '36px',
              border: '1px solid rgba(255, 255, 255, 0.92)',
              boxShadow: '0 28px 60px -14px rgba(138, 43, 66, 0.14), 0 12px 24px -8px rgba(212, 175, 55, 0.08), inset 0 2px 4px 0 rgba(255, 255, 255, 1), inset 0 -2px 3px 0 rgba(212, 175, 55, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.5)',
              padding: '24px 20px 24px 20px', marginBottom: '28px',
              textAlign: 'center', overflow: 'hidden',
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 250, 0.62) 50%, rgba(255, 250, 240, 0.45) 100%)',
              backdropFilter: 'blur(32px) saturate(200%)',
              WebkitBackdropFilter: 'blur(32px) saturate(200%)',
            }}
          >
            <GoldShimmer />

            {/* Background Palace Wash */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '240px', opacity: 0.15, pointerEvents: 'none', maskImage: 'linear-gradient(180deg, black 30%, transparent 100%)', WebkitMaskImage: 'linear-gradient(180deg, black 30%, transparent 100%)' }}>
              <img src="/images/palace-garden.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Floral Arch */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{ width: '100%', height: '110px', backgroundImage: 'url(/images/floral-arch.jpg)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'top center', mixBlendMode: 'multiply', marginBottom: '4px', position: 'relative', zIndex: 2 }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px', position: 'relative', zIndex: 2 }}>
              {/* Monogram Medallion — enhanced with glow */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, duration: 0.8, type: 'spring', stiffness: 120 }}
                style={{
                  position: 'relative', width: '80px', height: '80px', borderRadius: '50%',
                  border: '2px solid rgba(212, 175, 55, 0.4)',
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(254, 245, 225, 0.5) 50%, rgba(255, 255, 255, 0.75) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 12px 28px -4px rgba(140, 45, 66, 0.2), 0 0 20px 2px rgba(212, 175, 55, 0.25), inset 0 2px 3px rgba(255, 255, 255, 1), inset 0 -1.5px 2px rgba(212, 175, 55, 0.3), 0 0 0 1px rgba(212, 175, 55, 0.35)',
                  marginBottom: '12px', overflow: 'hidden',
                  animation: 'goldPulse 4s ease-in-out infinite',
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: '8%', right: '8%', height: '48%', background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0) 100%)', borderRadius: '50px 50px 0 0', pointerEvents: 'none' }} />
                <span style={{ position: 'relative', zIndex: 2, fontFamily: "'Playfair Display', serif", fontSize: '19px', fontWeight: '700', color: '#8c2d42', letterSpacing: '0.04em', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '5px', lineHeight: 1 }}>
                  H <span style={{ fontStyle: 'italic', fontFamily: "'Great Vibes', cursive", fontSize: '22px', color: '#c49a2c' }}>&amp;</span> R
                </span>
              </motion.div>

              {/* Invocation Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.82) 0%, rgba(254, 243, 199, 0.4) 100%)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '9999px', padding: '6px 18px', boxShadow: '0 4px 14px rgba(212, 175, 55, 0.1), inset 0 1px 2px rgba(255, 255, 255, 1)', margin: '0 auto' }}
              >
                <span style={{ fontSize: '11px', color: '#b45309' }}>✨</span>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: '11px', letterSpacing: '0.14em', color: '#8c2d42', fontWeight: '700', margin: 0 }}>
                  ॥ Shree Ganeshaya Namah ॥
                </p>
                <span style={{ fontSize: '11px', color: '#b45309' }}>✨</span>
              </motion.div>

              <OrnamentalDivider />

              {/* Groom Side Label */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(254, 243, 199, 0.4) 100%)', border: '1.5px solid rgba(212, 175, 55, 0.4)', borderRadius: '9999px', padding: '4px 16px', marginBottom: '10px', boxShadow: '0 3px 10px rgba(212, 175, 55, 0.12), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)', animation: 'goldPulse 5s ease-in-out infinite' }}
              >
                <span style={{ fontSize: '10px', letterSpacing: '0.18em', color: '#856404', fontWeight: '800', textTransform: 'uppercase' }}>✦ Groom&apos;s Side ✦</span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                style={{ fontSize: '11.5px', letterSpacing: '0.13em', color: '#632533', textTransform: 'uppercase', fontWeight: '500', margin: '0 0 8px 0' }}
              >
                We request the pleasure of your company<br />to celebrate the wedding of
              </motion.p>

              {/* Couple Names — grand entrance */}
              <motion.h1
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.8, type: 'spring', stiffness: 80 }}
                style={{ fontFamily: "'Great Vibes', cursive", fontSize: '54px', color: '#7a2335', margin: '2px 0 12px 0', fontWeight: 'normal', lineHeight: '1.1', textShadow: '0 3px 16px rgba(140, 45, 66, 0.12), 0 1px 4px rgba(212, 175, 55, 0.1)' }}
              >
                Harsh &amp; Rutbi
              </motion.h1>

              {/* Scratch Card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                style={{ width: '100%', margin: '10px 0 14px 0', display: 'flex', justifyContent: 'center' }}
              >
                <HeartScratchCard
                  dateText="WEDNESDAY, DEC 09, 2026"
                  venueText="Hotel Nalanda Regency, Rajgir"
                  foilHeader="Mark Your Calendar, Ji! 📅"
                  foilSubtitle="Tap or scratch to reveal"
                  swipeToScratchText="✨ Tap or scratch to reveal"
                  scrollButtonText="View Events & Itinerary"
                  onScrollRequest={scrollToCelebrations}
                />
              </motion.div>

              {/* Venue Info Pod — enhanced */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                style={{ width: '100%', marginTop: '8px', marginBottom: '12px', padding: '18px 20px', borderRadius: '24px', background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.82) 0%, rgba(254, 243, 225, 0.45) 100%)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '1.5px solid rgba(212, 175, 55, 0.2)', boxShadow: '0 12px 32px -8px rgba(140, 45, 66, 0.12), inset 0 2px 3px rgba(255, 255, 255, 1), inset 0 -1px 2px rgba(212, 175, 55, 0.15)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
              >
                <GoldShimmer />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#8c2d42', fontWeight: '800', background: 'rgba(255, 243, 205, 0.75)', padding: '4px 12px', borderRadius: '9999px', marginBottom: '8px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                    <span>📍</span> <span>Wedding Venue</span>
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#4a1525', margin: '0 0 4px 0', fontWeight: '700' }}>{weddingVenueName}</h3>
                  <p style={{ fontSize: '11.5px', color: '#7a4e58', margin: '0 0 10px 0', lineHeight: '1.45' }}>{weddingVenueAddress}</p>
                  <div style={{ width: '60%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent)', margin: '10px auto' }} />
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#856404', fontWeight: '800', background: 'rgba(255, 243, 205, 0.55)', padding: '4px 12px', borderRadius: '9999px', marginBottom: '6px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                    <span>🏠</span> <span>Pre-Wedding &amp; Reception</span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#614603', margin: 0, fontWeight: '700' }}>Jhajha, Bihar</p>
                </div>
              </motion.div>
            </div>

            {/* Architecture SVG */}
            <div style={{ width: '100%', opacity: 0.4, marginTop: '8px' }}>
              <svg viewBox="0 0 240 50" fill="none" stroke="#8c2d42" strokeWidth="0.8" style={{ width: '100%', height: '40px' }}>
                <path d="M10 45 V 25 L 35 12 L 60 25 V 45 M 50 45 V 32 H 70 V 45 M 85 45 V 18 L 120 5 L 155 18 V 45 M 105 45 V 28 H 135 V 45 M 180 45 V 25 L 205 12 L 230 25 V 45" />
                <circle cx="120" cy="5" r="3" fill="#d4af37" />
              </svg>
            </div>

            {/* Scroll CTA */}
            <motion.div
              onClick={scrollToCelebrations}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              style={{ marginTop: '14px', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer' }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.78) 0%, rgba(254, 243, 199, 0.4) 100%)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(212, 175, 55, 0.25)', padding: '6px 16px', borderRadius: '9999px', boxShadow: '0 3px 10px rgba(140, 45, 66, 0.08), inset 0 1px 1.5px #fff' }}>
                <span style={{ fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.22em', color: '#8c2d42', fontWeight: '800' }}>Scroll for Itinerary</span>
                <ChevronDown size={13} color="#8c2d42" className="animate-bounce" />
              </div>
            </motion.div>
          </motion.section>

          {/* ══════════ INVITATION GREETING ══════════ */}
          <RevealOnScroll>
            <section id="wedding-details-start" style={{ ...sectionCardStyle, position: 'relative' }}>
              <GoldShimmer />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>💌</div>
                <p style={{ fontSize: '15px', lineHeight: '1.75', color: '#5c2c38', margin: '0 0 12px 0', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
                  &ldquo;We&apos;re making it official! After countless dates, shared laughs, and family debates, we&apos;re finally tying the knot. Honestly, our big day wouldn&apos;t mean half as much without our favorite people in the room.&rdquo;
                </p>
                <OrnamentalDivider />
                <p style={{ fontSize: '13.5px', lineHeight: '1.6', color: '#8c2d42', margin: 0, fontWeight: '600' }}>
                  Come for the vows, stay for the banter, the endless food, and our questionable dance moves 💕
                </p>
              </div>
            </section>
          </RevealOnScroll>

          {/* ══════════ COUNTDOWN ══════════ */}
          <RevealOnScroll delay={0.1}>
            <section style={{ ...sectionCardStyle, background: 'linear-gradient(145deg, rgba(255, 253, 248, 0.92) 0%, rgba(254, 245, 238, 0.6) 50%, rgba(255, 250, 242, 0.4) 100%)', position: 'relative' }}>
              <GoldShimmer />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h2 style={cursiveHeaderStyle}>Counting Down the Days</h2>
                <OrnamentalDivider />
                <p style={{ fontSize: '12.5px', color: '#7a4e58', margin: '0 0 18px 0', fontStyle: 'italic' }}>
                  Until Harsh officially surrenders the TV remote for life! ⏳
                </p>
                <CountdownTimer targetDate="2026-12-09T10:00:00" />
              </div>
            </section>
          </RevealOnScroll>

          {/* ══════════ PHOTO CAROUSEL ══════════ */}
          <RevealOnScroll delay={0.1}>
            <section style={{ ...sectionCardStyle, padding: '28px 20px' }}>
              <div style={{ textAlign: 'center', marginBottom: '18px', position: 'relative', zIndex: 2 }}>
                <Camera size={22} color="#8c2d42" style={{ margin: '0 auto 6px auto' }} />
                <h2 style={cursiveHeaderStyle}>A Few Favorite Moments</h2>
                <OrnamentalDivider />
                <p style={{ fontSize: '12px', color: '#7a4e58', margin: 0, fontStyle: 'italic' }}>
                  Unfiltered memories from the road that brought us here
                </p>
              </div>

              <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 20px 44px rgba(138, 43, 66, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.4)', border: '2px solid rgba(255, 255, 255, 0.9)', backgroundColor: '#1f070e' }}>
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ position: 'absolute', inset: 0 }}
                  >
                    <img src={galleryImages[currentSlide].src} alt={galleryImages[currentSlide].title} loading="eager" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, transparent 35%, rgba(15,2,6,0.88) 100%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '24px', left: '18px', right: '18px', textAlign: 'center', color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '19px', fontWeight: '600', color: '#ffd54f', margin: '0 0 3px 0', textShadow: '0 2px 12px rgba(212, 175, 55, 0.4)' }}>{galleryImages[currentSlide].title}</h3>
                      <p style={{ fontSize: '11.5px', color: '#f8bbd0', margin: 0, fontWeight: '400', letterSpacing: '0.05em' }}>{galleryImages[currentSlide].desc}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Nav Arrows */}
                {[{ dir: 'prev', fn: prevSlide, pos: { left: '10px' } }, { dir: 'next', fn: nextSlide, pos: { right: '10px' } }].map(({ dir, fn, pos }) => (
                  <button key={dir} onClick={(e) => { e.stopPropagation(); fn(); }} aria-label={dir === 'prev' ? 'Previous' : 'Next'} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.6) 100%)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1.5px solid rgba(255, 255, 255, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 6px 18px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 1)', zIndex: 10, transition: 'all 0.2s ease', ...pos }}>
                    {dir === 'prev' ? <ChevronLeft size={18} color="#8c2d42" /> : <ChevronRight size={18} color="#8c2d42" />}
                  </button>
                ))}

                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0, 0, 0, 0.55)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '9999px', padding: '5px 13px', color: '#fff', fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em', border: '1px solid rgba(255, 255, 255, 0.3)', zIndex: 10 }}>
                  {currentSlide + 1} / {galleryImages.length}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                {galleryImages.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentSlide(idx)} aria-label={`Slide ${idx + 1}`} style={{ width: currentSlide === idx ? '28px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: currentSlide === idx ? '#8c2d42' : '#e0c0c8', border: 'none', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: currentSlide === idx ? '0 2px 8px rgba(140, 45, 66, 0.3)' : 'none' }} />
                ))}
              </div>
            </section>
          </RevealOnScroll>

          {/* ════════════════════════════════════════
              DAY 1 — HALDI · DECEMBER 6
          ════════════════════════════════════════ */}
          <RevealOnScroll>
            <section style={{ ...sectionCardStyle, padding: '32px 20px' }}>
              <GoldShimmer />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ ...dayBadgeBase, background: 'linear-gradient(135deg, rgba(255, 243, 205, 0.9) 0%, rgba(254, 240, 199, 0.55) 100%)', border: '1.5px solid rgba(212, 175, 55, 0.4)', color: '#856404' }}>
                  <Calendar size={12} /> Day 1 · Saturday, December 6
                </div>

                <h2 style={cursiveHeaderStyle}>Haldi Ceremony</h2>
                <p style={{ fontSize: '10.5px', color: '#8c2d42', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '800', margin: '2px 0 4px 0' }}>Jhajha, Bihar</p>
                <OrnamentalDivider color="#c49a2c" />

                <p style={{ fontSize: '13.5px', color: '#683f49', fontStyle: 'italic', margin: '0 0 20px 0', lineHeight: '1.5', fontWeight: '500' }}>
                  &ldquo;Rishta pakka ho gaya, ab rang jamana toh banta hai!&rdquo; 😂
                </p>

                <GlowBorder color="#d4af37">
                  <div style={{ ...eventPodBase, background: 'linear-gradient(145deg, rgba(255, 253, 238, 0.9) 0%, rgba(254, 240, 199, 0.5) 100%)', boxShadow: '0 12px 32px -8px rgba(212, 175, 55, 0.22), inset 0 2px 3px rgba(255, 255, 255, 1)' }}>
                    <GoldShimmer />
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '20px' }}>💛</span>
                          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', color: '#614603', margin: 0, fontWeight: '700' }}>Haldi Ceremony</h3>
                        </div>
                        <span style={{ ...timeBadgeBase, background: 'rgba(255, 243, 205, 0.8)', color: '#856404' }}>Dec 6 • 9:00 AM Onwards</span>
                      </div>
                      <p style={{ fontSize: '11.5px', color: '#856404', fontWeight: '700', margin: '4px 0 8px 0' }}>9 AM — Beauty treatment, desi edition.</p>
                      <p style={{ fontSize: '12.5px', color: '#573d03', margin: '0 0 8px 0', lineHeight: '1.6' }}>
                        Dulhe ki skin pe haldi, aur rishtedaaron ke paas permission to attack! 😂 Aaj koi skincare routine nahi bachayega. Yellow vibes only!
                      </p>
                      <p style={{ fontSize: '11px', color: '#856404', margin: 0, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>📍 Jhajha, Bihar</p>
                    </div>
                  </div>
                </GlowBorder>
              </div>
            </section>
          </RevealOnScroll>

          {/* ════════════════════════════════════════
              DAY 2 — MEHENDI & SANGEET · DECEMBER 7
          ════════════════════════════════════════ */}
          <RevealOnScroll>
            <section style={{ ...sectionCardStyle, padding: '32px 20px' }}>
              <GoldShimmer />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ ...dayBadgeBase, background: 'linear-gradient(135deg, rgba(243, 232, 255, 0.9) 0%, rgba(233, 213, 255, 0.55) 100%)', border: '1.5px solid rgba(168, 85, 247, 0.3)', color: '#6a1b9a' }}>
                  <Calendar size={12} /> Day 2 · Sunday, December 7
                </div>

                <h2 style={cursiveHeaderStyle}>Mehendi &amp; Sangeet</h2>
                <p style={{ fontSize: '10.5px', color: '#8c2d42', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '800', margin: '2px 0 4px 0' }}>Jhajha, Bihar</p>
                <OrnamentalDivider color="#9c27b0" />

                <p style={{ fontSize: '13.5px', color: '#683f49', fontStyle: 'italic', margin: '0 0 20px 0', lineHeight: '1.5', fontWeight: '500' }}>
                  &ldquo;Haathon mein mehendi aur paon mein dance — aaj dono compulsory hai!&rdquo; 💃
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Mehendi */}
                  <GlowBorder color="#22c55e">
                    <div style={{ ...eventPodBase, background: 'linear-gradient(145deg, rgba(240, 253, 244, 0.9) 0%, rgba(209, 250, 229, 0.5) 100%)', boxShadow: '0 12px 32px -8px rgba(34, 197, 94, 0.2), inset 0 2px 3px rgba(255, 255, 255, 1)' }}>
                      <div style={{ position: 'relative', zIndex: 2, textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '20px' }}>🌿</span>
                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: '#14452f', margin: 0, fontWeight: '700' }}>Mehendi Celebrations</h3>
                          </div>
                          <span style={{ ...timeBadgeBase, background: 'rgba(209, 250, 229, 0.8)', color: '#1b4332' }}>Dec 7 • 1:00 PM Onwards</span>
                        </div>
                        <p style={{ fontSize: '11.5px', color: '#1b4332', fontWeight: '700', margin: '4px 0 8px 0' }}>1 PM — Gossip, but make it permanent.</p>
                        <p style={{ fontSize: '12.5px', color: '#1b4332', margin: '0 0 8px 0', lineHeight: '1.6' }}>
                          Haathon mein mehendi, dimaag mein gossip, aur sabki nazar dulhe ke naam par. 👀 Naam dhoondhne waale ko milega kya? Yeh toh koi nahi jaanta!
                        </p>
                        <p style={{ fontSize: '11px', color: '#2d6a4f', margin: 0, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>📍 Jhajha, Bihar</p>
                      </div>
                    </div>
                  </GlowBorder>

                  {/* Sangeet */}
                  <GlowBorder color="#a855f7">
                    <div style={{ ...eventPodBase, background: 'linear-gradient(145deg, rgba(253, 244, 255, 0.9) 0%, rgba(243, 232, 255, 0.5) 100%)', boxShadow: '0 12px 32px -8px rgba(168, 85, 247, 0.2), inset 0 2px 3px rgba(255, 255, 255, 1)' }}>
                      <div style={{ position: 'relative', zIndex: 2, textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '20px' }}>🪩</span>
                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: '#4a154b', margin: 0, fontWeight: '700' }}>Sangeet Night</h3>
                          </div>
                          <span style={{ ...timeBadgeBase, background: 'rgba(243, 232, 255, 0.8)', color: '#6a1b9a' }}>Dec 7 • 7:00 PM Onwards</span>
                        </div>
                        <p style={{ fontSize: '11.5px', color: '#6a1b9a', fontWeight: '700', margin: '4px 0 8px 0' }}>7 PM — Talent optional, confidence compulsory.</p>
                        <p style={{ fontSize: '12.5px', color: '#4a154b', margin: '0 0 8px 0', lineHeight: '1.6' }}>
                          Jo ghar pe kehte hain &ldquo;mujhe dance nahi aata,&rdquo; wahi stage pe sabse aage milenge. 💃 Aur jo dance nahi karenge, unki attendance sirf dinner ke liye mark hogi!
                        </p>
                        <p style={{ fontSize: '11px', color: '#6a1b9a', margin: 0, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>📍 Jhajha, Bihar</p>
                      </div>
                    </div>
                  </GlowBorder>
                </div>

                {/* Notice */}
                <div style={{ marginTop: '18px', padding: '16px 18px', borderRadius: '20px', background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.85) 0%, rgba(254, 243, 199, 0.42) 100%)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1.5px solid rgba(212, 175, 55, 0.4)', boxShadow: 'inset 0 2px 3px rgba(255, 255, 255, 0.98), 0 6px 18px rgba(212, 175, 55, 0.08)', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '16px' }}>⚠️</span>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8c2d42' }}>Public Notice</span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#683f49', margin: 0, lineHeight: '1.6' }}>
                    Shaadi mein sharmaana mana hai. Dance na karna shak ke ghere mein hai. Aur khaana khaake chupchaap nikal jaana? CCTV mein sab dikh raha hai, Ji! 😂
                  </p>
                </div>
              </div>
            </section>
          </RevealOnScroll>

          {/* ════════════════════════════════════════
              DAY 3 — DEV POOJAN · DECEMBER 8
          ════════════════════════════════════════ */}
          <RevealOnScroll>
            <section style={{ ...sectionCardStyle, padding: '32px 20px' }}>
              <GoldShimmer />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ ...dayBadgeBase, background: 'linear-gradient(135deg, rgba(255, 237, 213, 0.9) 0%, rgba(254, 215, 170, 0.55) 100%)', border: '1.5px solid rgba(234, 88, 12, 0.3)', color: '#9a3412' }}>
                  <Calendar size={12} /> Day 3 · Monday, December 8
                </div>

                <h2 style={cursiveHeaderStyle}>Dev Poojan</h2>
                <p style={{ fontSize: '10.5px', color: '#8c2d42', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '800', margin: '2px 0 4px 0' }}>Jhajha, Bihar</p>
                <OrnamentalDivider color="#ea580c" />

                <p style={{ fontSize: '13.5px', color: '#683f49', fontStyle: 'italic', margin: '0 0 20px 0', lineHeight: '1.5', fontWeight: '500' }}>
                  &ldquo;Shaadi se pehle devtaon ka aashirvaad — sabse zaruri rasam!&rdquo; 🙏
                </p>

                <GlowBorder color="#ea580c">
                  <div style={{ ...eventPodBase, background: 'linear-gradient(145deg, rgba(255, 237, 213, 0.9) 0%, rgba(254, 215, 170, 0.48) 100%)', boxShadow: '0 12px 32px -8px rgba(234, 88, 12, 0.2), inset 0 2px 3px rgba(255, 255, 255, 1)' }}>
                    <GoldShimmer />
                    <div style={{ position: 'relative', zIndex: 2, textAlign: 'left' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '20px' }}>🪔</span>
                          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', color: '#9a3412', margin: 0, fontWeight: '700' }}>Dev Poojan Ceremony</h3>
                        </div>
                        <span style={{ ...timeBadgeBase, background: 'rgba(255, 237, 213, 0.8)', color: '#9a3412' }}>Dec 8 • Morning Onwards</span>
                      </div>
                      <p style={{ fontSize: '11.5px', color: '#9a3412', fontWeight: '700', margin: '4px 0 8px 0' }}>Seeking divine blessings before the big day</p>
                      <p style={{ fontSize: '12.5px', color: '#7c2d12', margin: '0 0 8px 0', lineHeight: '1.6' }}>
                        The sacred ritual of invoking the blessings of Kul Devta before the wedding. Pooja, prasad, aur ghar ka pavitra mahaul — sab milke devtaon se aashirvaad lenge ki shaadi mein koi drama na ho! 🙏✨
                      </p>
                      <p style={{ fontSize: '11px', color: '#9a3412', margin: 0, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>📍 Jhajha, Bihar</p>
                    </div>
                  </div>
                </GlowBorder>
              </div>
            </section>
          </RevealOnScroll>

          {/* ════════════════════════════════════════
              DAY 4 — WEDDING · DECEMBER 9
          ════════════════════════════════════════ */}
          <RevealOnScroll>
            <section style={{ ...sectionCardStyle, padding: '32px 20px', background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 242, 246, 0.65) 50%, rgba(254, 243, 199, 0.35) 100%)' }}>
              <GoldShimmer />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ ...dayBadgeBase, background: 'linear-gradient(135deg, rgba(252, 228, 236, 0.9) 0%, rgba(251, 207, 232, 0.55) 100%)', border: '1.5px solid rgba(140, 45, 66, 0.35)', color: '#8c2d42' }}>
                  <Calendar size={12} /> Day 4 · Tuesday, December 9
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Sparkles size={22} color="#d4af37" style={{ animation: 'float 3s ease-in-out infinite' }} />
                  <Heart size={18} color="#8c2d42" style={{ animation: 'float 3s ease-in-out infinite 0.5s' }} />
                </div>
                <h2 style={{ ...cursiveHeaderStyle, fontSize: '40px' }}>The Wedding Day</h2>
                <p style={{ fontSize: '10.5px', color: '#8c2d42', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '800', margin: '2px 0 4px 0' }}>
                  Wednesday, December 09, 2026 · Hotel Nalanda Regency, Rajgir
                </p>
                <OrnamentalDivider />

                <p style={{ fontSize: '13px', color: '#683f49', fontStyle: 'italic', margin: '0 0 20px 0', lineHeight: '1.5' }}>
                  Aaj shaadi hai, Janab! Emotions bhi honge aur pet-pooja bhi. 😂
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Guest Arrival */}
                  <GlowBorder color="#d4af37">
                    <div style={{ ...eventPodBase, background: 'linear-gradient(145deg, rgba(255, 253, 242, 0.9) 0%, rgba(254, 243, 199, 0.48) 100%)', boxShadow: '0 12px 32px -8px rgba(212, 175, 55, 0.22), inset 0 2px 3px rgba(255, 255, 255, 1)' }}>
                      <GoldShimmer />
                      <div style={{ position: 'relative', zIndex: 2, textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '20px' }}>💼</span>
                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: '#614603', margin: 0, fontWeight: '700' }}>Guest Arrival &amp; Welcome</h3>
                          </div>
                          <span style={{ ...timeBadgeBase, background: 'rgba(255, 243, 205, 0.8)', color: '#856404' }}>10:00 AM</span>
                        </div>
                        <p style={{ fontSize: '12.5px', color: '#573d03', margin: '0 0 8px 0', lineHeight: '1.6' }}>
                          Aate hi chai-samosa pakdiye, family se gale miliye, aur un sawaalon ke liye ready ho jaiye: &ldquo;Pehchana mujhe?&rdquo; aur &ldquo;Ab tumhari baari kab hai?&rdquo; 😂
                        </p>
                        <p style={{ fontSize: '11px', color: '#b45309', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>📍 Hotel Nalanda Regency, Rajgir</p>
                      </div>
                    </div>
                  </GlowBorder>

                  {/* Wedding Ceremony */}
                  <GlowBorder color="#8c2d42">
                    <div style={{ ...eventPodBase, background: 'linear-gradient(145deg, rgba(255, 242, 245, 0.92) 0%, rgba(252, 228, 236, 0.5) 100%)', boxShadow: '0 12px 32px -8px rgba(140, 45, 66, 0.22), inset 0 2px 3px rgba(255, 255, 255, 1)' }}>
                      <GoldShimmer />
                      <div style={{ position: 'relative', zIndex: 2, textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '20px' }}>💍</span>
                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: '#4a121e', margin: 0, fontWeight: '700' }}>The Wedding Ceremony</h3>
                          </div>
                          <span style={{ ...timeBadgeBase, background: 'rgba(252, 228, 236, 0.8)', color: '#8c2d42' }}>11:30 AM onwards</span>
                        </div>
                        <p style={{ fontSize: '12.5px', color: '#4a121e', margin: '0 0 8px 0', lineHeight: '1.6' }}>
                          Varmala hogi, phere honge, aankhein nam hongi... aur peeche se koi na koi poochega, &ldquo;Khaana kab khulega?&rdquo; 🥺🍲 Blessings ready rakhiye, appetite bhi!
                        </p>
                        <p style={{ fontSize: '11px', color: '#9d174d', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>📍 Hotel Nalanda Regency, Rajgir</p>
                      </div>
                    </div>
                  </GlowBorder>
                </div>

                {/* Zaroori Suchna */}
                <div style={{ marginTop: '18px', padding: '16px 18px', borderRadius: '20px', background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.85) 0%, rgba(254, 243, 199, 0.42) 100%)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1.5px solid rgba(212, 175, 55, 0.4)', boxShadow: 'inset 0 2px 3px rgba(255, 255, 255, 0.98), 0 6px 18px rgba(212, 175, 55, 0.08)', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '17px' }}>🍽️</span>
                    <span style={{ fontSize: '11.5px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8c2d42' }}>Zaroori Suchna, Ji!</span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#683f49', margin: 0, lineHeight: '1.6' }}>
                    Diet kal se. Aaj toh shaadi hai! Ek plate pyaar ke naam, doosri taste ke naam... aur teesri bas, &ldquo;thoda sa aur le lete hain.&rdquo; 😂
                  </p>
                </div>
              </div>
            </section>
          </RevealOnScroll>

          {/* ════════════════════════════════════════
              DAY 6 — RECEPTION · DECEMBER 11
          ════════════════════════════════════════ */}
          <RevealOnScroll>
            <section style={{ ...sectionCardStyle, padding: '32px 20px' }}>
              <GoldShimmer />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ ...dayBadgeBase, background: 'linear-gradient(135deg, rgba(219, 234, 254, 0.9) 0%, rgba(191, 219, 254, 0.55) 100%)', border: '1.5px solid rgba(37, 99, 235, 0.25)', color: '#1e40af' }}>
                  <Calendar size={12} /> Day 6 · Thursday, December 11
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Sparkles size={22} color="#d4af37" style={{ animation: 'float 3s ease-in-out infinite' }} />
                  <span style={{ fontSize: '22px' }}>🎉</span>
                </div>
                <h2 style={cursiveHeaderStyle}>Grand Reception</h2>
                <p style={{ fontSize: '10.5px', color: '#8c2d42', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '800', margin: '2px 0 4px 0' }}>
                  Thursday, December 11, 2026 · Jhajha, Bihar
                </p>
                <OrnamentalDivider color="#2563eb" />

                <p style={{ fontSize: '13.5px', color: '#683f49', fontStyle: 'italic', margin: '0 0 20px 0', lineHeight: '1.5', fontWeight: '500' }}>
                  &ldquo;Shaadi toh ho gayi, ab party bhi toh banta hai!&rdquo; 🥂
                </p>

                <GlowBorder color="#2563eb">
                  <div style={{ ...eventPodBase, background: 'linear-gradient(145deg, rgba(219, 234, 254, 0.9) 0%, rgba(191, 219, 254, 0.48) 100%)', boxShadow: '0 12px 32px -8px rgba(37, 99, 235, 0.2), inset 0 2px 3px rgba(255, 255, 255, 1)' }}>
                    <div style={{ position: 'relative', zIndex: 2, textAlign: 'left' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '20px' }}>🥂</span>
                          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', color: '#1e3a5f', margin: 0, fontWeight: '700' }}>Wedding Reception</h3>
                        </div>
                        <span style={{ ...timeBadgeBase, background: 'rgba(219, 234, 254, 0.8)', color: '#1e40af' }}>Dec 11 • Evening Onwards</span>
                      </div>
                      <p style={{ fontSize: '11.5px', color: '#1e40af', fontWeight: '700', margin: '4px 0 8px 0' }}>An evening of celebration, food &amp; togetherness</p>
                      <p style={{ fontSize: '12.5px', color: '#1e3a5f', margin: '0 0 8px 0', lineHeight: '1.6' }}>
                        Naye jode ka swagat, daawat-e-khaas, aur photo session jismein sabko &ldquo;ek aur ek aur&rdquo; chahiye! 📸 Dress to impress aur appetite king-size laana. Family, friends, aur pyaar — sab ek jagah! 🎊
                      </p>
                      <p style={{ fontSize: '11px', color: '#1e40af', margin: 0, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>📍 Jhajha, Bihar</p>
                    </div>
                  </div>
                </GlowBorder>
              </div>
            </section>
          </RevealOnScroll>

          {/* ══════════ VENUE & MAP ══════════ */}
          <RevealOnScroll>
            <section style={sectionCardStyle}>
              <GoldShimmer />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <MapPin size={22} color="#8c2d42" style={{ margin: '0 auto 6px auto' }} />
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '23px', color: '#4a1525', margin: '0 0 6px 0', fontWeight: '700' }}>Wedding Venue</h2>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#614603', margin: '0 0 4px 0', fontWeight: '700' }}>{weddingVenueName}</h3>
                <p style={{ fontSize: '12.5px', color: '#7a4e58', margin: '0 0 8px 0', lineHeight: '1.5' }}>{weddingVenueAddress}</p>
                <p style={{ fontSize: '12px', color: '#683f49', margin: '0 0 18px 0', fontStyle: 'italic' }}>
                  Conveniently located along the main road in Rajgir. If you need a hand, don&apos;t hesitate to give us a quick ring!
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                  <a href={googleMapsWeddingUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #8c2d42 0%, #6e1c2e 100%)', color: '#ffffff', padding: '13px 30px', borderRadius: '9999px', fontSize: '12.5px', fontWeight: '700', textDecoration: 'none', border: '1px solid rgba(255, 255, 255, 0.35)', boxShadow: '0 12px 28px -6px rgba(140, 45, 66, 0.45), inset 0 2px 3px rgba(255, 255, 255, 0.45)', transition: 'transform 0.25s ease, box-shadow 0.25s ease', letterSpacing: '0.03em' }} onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.transform = 'scale(1)'; }}>
                    <MapPin size={15} /> Wedding Venue · Google Maps
                  </a>
                  <a href={googleMapsJhajhaUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #856404 0%, #614603 100%)', color: '#ffffff', padding: '11px 26px', borderRadius: '9999px', fontSize: '11.5px', fontWeight: '700', textDecoration: 'none', border: '1px solid rgba(255, 255, 255, 0.35)', boxShadow: '0 10px 24px -6px rgba(133, 100, 4, 0.4), inset 0 2px 3px rgba(255, 255, 255, 0.4)', transition: 'transform 0.25s ease', letterSpacing: '0.03em' }} onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.transform = 'scale(1)'; }}>
                    <MapPin size={14} /> Jhajha, Bihar · Google Maps
                  </a>
                </div>
              </div>
            </section>
          </RevealOnScroll>

          {/* ══════════ DRESS CODE ══════════ */}
          <RevealOnScroll>
            <section style={{ ...sectionCardStyle, padding: '32px 20px' }}>
              <GoldShimmer />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Shirt size={22} color="#8c2d42" />
                  <Sparkles size={16} color="#d4af37" />
                </div>
                <h2 style={cursiveHeaderStyle}>What to Wear</h2>
                <p style={{ fontSize: '10.5px', color: '#8c2d42', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '800', margin: '2px 0 4px 0' }}>Suggestions for Each Function</p>
                <OrnamentalDivider />

                <p style={{ fontSize: '12.5px', color: '#683f49', fontStyle: 'italic', margin: '0 0 20px 0', lineHeight: '1.5' }}>
                  &ldquo;Most importantly: wear whatever makes you feel happy, comfortable, and ready to dance!&rdquo; ✨
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
                  {[
                    { emoji: '💛', title: 'Haldi · Dec 6', colors: ['#f59e0b', '#ec4899'], label: 'Pinks or Yellows', bg: 'rgba(255, 253, 238, 0.9)', bgEnd: 'rgba(254, 240, 199, 0.5)', textColor: '#614603', bodyColor: '#573d03', shadow: 'rgba(212, 175, 55, 0.22)', desc: "Yellows or shades of pink! Just pick something you wouldn't mind getting a tiny bit of haldi on — turmeric is notorious for finding its way everywhere! 🌸" },
                    { emoji: '🌿', title: 'Mehendi · Dec 7', colors: ['#2d6a4f'], label: 'Shades of Green', bg: 'rgba(240, 253, 244, 0.9)', bgEnd: 'rgba(209, 250, 229, 0.5)', textColor: '#14452f', bodyColor: '#1b4332', shadow: 'rgba(34, 197, 94, 0.18)', desc: 'Any shade of green you love! Outfits with easy-to-roll sleeves are always a smart choice while henna sets. 🌿' },
                    { emoji: '🪩', title: 'Sangeet · Dec 7', colors: ['#9c27b0'], label: 'Indo-Western & Festive', bg: 'rgba(253, 244, 255, 0.9)', bgEnd: 'rgba(243, 232, 255, 0.5)', textColor: '#4a154b', bodyColor: '#4a154b', shadow: 'rgba(168, 85, 247, 0.18)', desc: 'Indo-Western, festive, or sparkly! Most importantly, pick something you can dance and move around in all evening. 💃' },
                    { emoji: '👑', title: 'Wedding · Dec 9', colors: ['#8c2d42'], label: 'Traditional & Royal', bg: 'rgba(255, 242, 245, 0.92)', bgEnd: 'rgba(252, 228, 236, 0.5)', textColor: '#4a121e', bodyColor: '#4a121e', shadow: 'rgba(140, 45, 66, 0.2)', desc: "Saris, lehengas, sherwanis, or suits! Dress up as much as you'd like — just please save red for the bride! 👑" },
                    { emoji: '🥂', title: 'Reception · Dec 11', colors: ['#1e40af'], label: 'Elegant & Glamorous', bg: 'rgba(219, 234, 254, 0.9)', bgEnd: 'rgba(191, 219, 254, 0.5)', textColor: '#1e3a5f', bodyColor: '#1e3a5f', shadow: 'rgba(37, 99, 235, 0.18)', desc: "Your finest evening wear! Suits, gowns, lehengas — go all out. This is the grand finale, after all! ✨" },
                  ].map((item, idx) => (
                    <div key={idx} style={{ ...eventPodBase, background: `linear-gradient(145deg, ${item.bg} 0%, ${item.bgEnd} 100%)`, boxShadow: `0 10px 28px -6px ${item.shadow}, inset 0 2px 3px rgba(255, 255, 255, 1)` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '18px' }}>{item.emoji}</span>
                          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15.5px', color: item.textColor, margin: 0, fontWeight: '700' }}>{item.title}</h3>
                        </div>
                        <span style={{ ...timeBadgeBase, background: `${item.bg}`, color: item.textColor, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {item.colors.map((c, i) => <span key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: c }} />)}
                          {item.label}
                        </span>
                      </div>
                      <p style={{ fontSize: '12.5px', color: item.bodyColor, margin: 0, lineHeight: '1.6' }}>{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '18px', padding: '14px 16px', borderRadius: '20px', background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(254, 243, 199, 0.38) 100%)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1.5px solid rgba(212, 175, 55, 0.4)', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>👟</span>
                  <p style={{ fontSize: '12px', color: '#683f49', margin: 0, lineHeight: '1.5' }}>
                    <strong style={{ color: '#8c2d42' }}>Helpful Tip:</strong> Stashing a pair of comfortable flats in your bag is always a great decision for when the music kicks into high gear!
                  </p>
                </div>
              </div>
            </section>
          </RevealOnScroll>

          {/* ══════════ TRAVEL ══════════ */}
          <RevealOnScroll>
            <section style={sectionCardStyle}>
              <GoldShimmer />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <Car size={22} color="#8c2d42" style={{ margin: '0 auto 6px auto' }} />
                <h2 style={cursiveHeaderStyle}>Travel &amp; Getting Here</h2>
                <OrnamentalDivider />
                <p style={{ fontSize: '13px', color: '#683f49', margin: 0, lineHeight: '1.7' }}>
                  Jhajha is well connected by rail (Jhajha Junction) and road. Rajgir is approximately 65 km from Jhajha, well connected by road and rail. Local taxis, cabs, and auto-rickshaws are readily available. If you need any assistance with directions, please don&apos;t hesitate to reach out. Wishing you a very safe journey — we can&apos;t wait to welcome you! 🚗
                </p>
              </div>
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section style={sectionCardStyle}>
              <GoldShimmer />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <Building size={22} color="#8c2d42" style={{ margin: '0 auto 6px auto' }} />
                <h2 style={cursiveHeaderStyle}>Where You&apos;ll Be Staying</h2>
                <OrnamentalDivider />
                <p style={{ fontSize: '13px', color: '#683f49', margin: '0 0 10px 0', lineHeight: '1.7' }}>
                  We want all of us under one roof like one big happy family! Rooms are reserved for our guests at <strong style={{ color: '#4a1525' }}>Hotel Nalanda Regency</strong> in Rajgir for the wedding day. For the Jhajha functions, local arrangements have been made with love. Check in, drop your bags, freshen up, and come join the party! 🏨
                </p>
                <p style={{ fontSize: '11.5px', color: '#8c2d42', margin: 0, fontWeight: '600' }}>📍 Hotel Nalanda Regency — Dangi Tola, Near Bus Stand, NH 82, Rajgir, Bihar - 803116</p>
              </div>
            </section>
          </RevealOnScroll>

          {/* ══════════ RSVP ══════════ */}
          <RevealOnScroll>
            <section style={{ ...sectionCardStyle, textAlign: 'left' }}>
              <GoldShimmer />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <Mail size={22} color="#8c2d42" style={{ margin: '0 auto 6px auto' }} />
                  <h2 style={cursiveHeaderStyle}>Will You Be Joining Us?</h2>
                  <OrnamentalDivider />
                  <p style={{ fontSize: '12px', color: '#7a4e58', margin: '6px 0 0 0', fontStyle: 'italic' }}>
                    Please let us know by November 25th so we can save you a cozy spot and a plate of hot sweets 💕
                  </p>
                </div>

                {isSubmitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 120 }} style={{ textAlign: 'center', padding: '28px 14px' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(209, 250, 229, 0.9) 0%, rgba(187, 247, 208, 0.5) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', boxShadow: '0 8px 24px rgba(34, 197, 94, 0.2)' }}>
                      <CheckCircle2 size={32} color="#15803d" />
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '21px', color: '#4a1525', margin: '0 0 6px 0' }}>Yay, Thank You!</h3>
                    <p style={{ fontSize: '13.5px', color: '#7a4e58', margin: 0, lineHeight: '1.55' }}>
                      We got your note! Can&apos;t wait to welcome you for a celebration we&apos;ll all remember for years to come 💕
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleGoogleSheetsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <label style={{ fontSize: '12.5px', color: '#683f49', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>Ji, Aapki Shubh Pehchaan? 😄</label>
                      <input type="text" required placeholder="Apna shubh naam likhein..." value={rsvpForm.name} onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })} style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(212,175,55,0.15), 0 4px 12px rgba(212,175,55,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)'; e.currentTarget.style.boxShadow = inputStyle.boxShadow as string; e.currentTarget.style.transform = 'translateY(0)'; }} />
                    </div>

                    <div>
                      <label style={{ fontSize: '12.5px', color: '#683f49', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>Toh Janab, Baraat Mein Mil Rahe Hain Na? 💃</label>
                      <select required value={rsvpForm.attending} onChange={(e) => setRsvpForm({ ...rsvpForm, attending: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(212,175,55,0.15), 0 4px 12px rgba(212,175,55,0.08)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)'; e.currentTarget.style.boxShadow = inputStyle.boxShadow as string; }}>
                        <option value="">Ek option select karein...</option>
                        <option value="Ji haan, zaroor aayenge! ❤️">Ji haan, zaroor aayenge! ❤️</option>
                        <option value="Bilkul! Dance floor hila denge! 🕺">Bilkul! Dance floor hila denge! 🕺</option>
                        <option value="Bhot mann tha par nhi aa paenge 🥺">Bhot mann tha par nhi aa paenge 🥺</option>
                        <option value="Abhi ghar pe permission leni hai 😂">Abhi ghar pe permission leni hai 😂</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '12.5px', color: '#683f49', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>Kuch Aashirwad, Kuch Raaz, Kuch Dance Requests? 💌</label>
                      <textarea rows={3} placeholder="Advice, blessings, wishes ya koi special farmaish..." value={rsvpForm.message} onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })} style={{ ...inputStyle, borderRadius: '22px', resize: 'none' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(212,175,55,0.15), 0 4px 12px rgba(212,175,55,0.08)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)'; e.currentTarget.style.boxShadow = inputStyle.boxShadow as string; }} />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ background: isSubmitting ? '#9c6270' : 'linear-gradient(135deg, #8c2d42 0%, #681829 100%)', color: '#ffffff', padding: '15px 28px', borderRadius: '9999px', border: '1.5px solid rgba(255, 255, 255, 0.4)', fontSize: '14px', fontWeight: '700', cursor: isSubmitting ? 'not-allowed' : 'pointer', textAlign: 'center', marginTop: '4px', boxShadow: '0 12px 28px -6px rgba(140, 45, 66, 0.5), inset 0 2px 3px rgba(255, 255, 255, 0.5)', letterSpacing: '0.04em', transition: 'background 0.3s ease' }}
                    >
                      {isSubmitting ? 'Sending...' : 'Send My RSVP 💌'}
                    </motion.button>
                  </form>
                )}
              </div>
            </section>
          </RevealOnScroll>

          {/* ══════════ CLOSING CARD ══════════ */}
          <RevealOnScroll>
            <section style={{ ...sectionCardStyle, padding: '40px 24px', background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 242, 246, 0.68) 50%, rgba(254, 248, 230, 0.4) 100%)', boxShadow: '0 24px 56px -12px rgba(140, 45, 66, 0.2), inset 0 2px 4px rgba(255, 255, 255, 1), inset 0 -2px 3px rgba(212, 175, 55, 0.18)' }}>
              <GoldShimmer />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.9) 0%, rgba(255, 237, 213, 0.5) 100%)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1.5px solid rgba(212, 175, 55, 0.5)', borderRadius: '9999px', padding: '5px 16px', marginBottom: '18px', boxShadow: '0 3px 10px rgba(212, 175, 55, 0.18), inset 0 1px 2px #fff', animation: 'goldPulse 4s ease-in-out infinite' }}>
                  <span style={{ fontSize: '12px' }}>🎉</span>
                  <span style={{ fontSize: '9.5px', fontWeight: '800', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#856404' }}>Final Notice • Zero Excuses Allowed</span>
                </div>

                <OrnamentalDivider width="240px" />

                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '23px', color: '#4a121e', margin: '0 0 4px 0', fontWeight: '700' }}>
                  Ready to Dance, Feast &amp; Celebrate?
                </h2>

                <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: '34px', color: '#8c2d42', margin: '0 0 14px 0', lineHeight: '1.2', textShadow: '0 2px 10px rgba(140, 45, 66, 0.1)' }}>
                  We can&apos;t wait to see you!
                </p>

                <p style={{ fontSize: '13px', color: '#683f49', lineHeight: '1.7', margin: '0 auto 20px auto', maxWidth: '380px' }}>
                  Pack your best energy and your roomiest dancing clothes! Bad dancing is not only welcomed, it is strictly mandatory. If anyone asks why you&apos;re taking a 4th plate of sweets, just tell them the bride &amp; groom personally insisted! 🍨
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '22px' }}>
                  {[
                    { emoji: '🍨', text: 'Unlimited Sweets', bg: 'rgba(255, 243, 205, 0.8)', color: '#573d03' },
                    { emoji: '🥁', text: 'High-Decibel Dhol', bg: 'rgba(209, 250, 229, 0.8)', color: '#14452f' },
                    { emoji: '💃', text: 'Zero Judgement Zone', bg: 'rgba(243, 232, 255, 0.8)', color: '#4a154b' },
                  ].map((tag, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      style={{ fontSize: '11px', fontWeight: '700', color: tag.color, background: tag.bg, border: '1px solid rgba(255, 255, 255, 0.95)', padding: '6px 14px', borderRadius: '9999px', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', boxShadow: '0 3px 8px rgba(0, 0, 0, 0.04), inset 0 1px 1.5px #fff' }}
                    >
                      {tag.emoji} {tag.text}
                    </motion.span>
                  ))}
                </div>

                <OrnamentalDivider width="200px" />

                <p style={{ fontSize: '12px', color: '#7a4e58', margin: '0 0 4px 0', fontStyle: 'italic' }}>
                  With lots of love, zero chill, &amp; sore dancing feet in advance,
                </p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#4a121e', margin: 0, fontWeight: '700' }}>
                  Harsh &amp; Rutbi 💕
                </p>
              </div>
            </section>
          </RevealOnScroll>

        </main>
      )}
    </div>
  );
}
