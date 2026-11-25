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
import HeartScratchCard from '../../components/HeartScratchCard';
import CountdownTimer from '../../components/CountdownTimer';
import EnvelopeIntro from '../../components/EnvelopeIntro';
import LanguageSwitch from '../../components/LanguageSwitch';

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
      'rgba(212, 175, 55, ',
      'rgba(140, 45, 66, ',
      'rgba(248, 182, 194, ',
      'rgba(255, 215, 0, ',
      'rgba(220, 180, 140, ',
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

export default function GroomWeddingInvitationHindi() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [volume, setVolume] = useState(0.30);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

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
  const gainNodeRef = useRef<GainNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceCreatedRef = useRef<boolean>(false);

  const weddingVenueName = 'होटल नालंदा रीजेंसी';
  const weddingVenueAddress = 'डांगी टोला, बस स्टैंड के पास, NH 82, राजगीर, बिहार - 803116';

  const googleMapsWeddingUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Hotel Nalanda Regency, Dangi Tola, Near Bus Stand, NH 82, Rajgir, Bihar - 803116'
  )}`;

  const googleMapsJhajhaUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Jhajha, Bihar, India'
  )}`;

  const galleryImages = [
    { src: '/images/gallery-4.jpg', title: 'जहाँ से शुरू हुआ सफ़र', desc: 'एक मुस्कान से शुरू हुई ये अनंत कहानी' },
    { src: '/images/gallery-3.jpg', title: 'हमारे खूबसूरत लम्हे', desc: 'दो दीवाने जो अपनी ही बातों पर हँसते हैं' },
    { src: '/images/gallery-2.jpg', title: 'जोड़ी नंबर वन', desc: 'चाय की चुस्कियों से लेकर ज़िंदगी भर का साथ' },
    { src: '/images/gallery-1.jpg', title: '9 दिसंबर का इंतज़ार', desc: 'आपके साथ हमारा सबसे ख़ुशी का दिन' },
  ];

  // Preload gallery images
  useEffect(() => {
    galleryImages.forEach((img) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = img.src;
      document.head.appendChild(link);
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isOpen, galleryImages.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  // Setup Web Audio API GainNode for mobile-compatible volume control
  const initAudioContext = useCallback(() => {
    if (audioCtxRef.current || !audioRef.current) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as Record<string, typeof AudioContext>).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const gainNode = ctx.createGain();
      gainNode.gain.value = volume;
      gainNodeRef.current = gainNode;
      if (!sourceCreatedRef.current) {
        const source = ctx.createMediaElementSource(audioRef.current);
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        sourceCreatedRef.current = true;
      }
    } catch { /* fallback: volume control won't work on this device */ }
  }, []);

  // Sync volume to GainNode whenever volume state changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
    if (audioRef.current) {
      try { audioRef.current.volume = volume; } catch { /* iOS ignores this */ }
    }
  }, [volume]);

  // Audio Lifecycle
  useEffect(() => {
    if (audioRef.current) {
      try { audioRef.current.volume = volume; } catch { /* iOS ignores */ }
    }

    const pauseMusic = () => {
      if (audioRef.current && !audioRef.current.paused) {
        wasPlayingBeforeHiddenRef.current = true;
        audioRef.current.pause();
      }
    };
    const resumeMusic = () => {
      if (!document.hidden && wasPlayingBeforeHiddenRef.current && audioRef.current) {
        if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume().catch(() => {});
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
      initAudioContext();
      if (audioCtxRef.current?.state === 'suspended') await audioCtxRef.current.resume().catch(() => {});
      try { await audioRef.current.play(); wasPlayingBeforeHiddenRef.current = true; }
      catch { wasPlayingBeforeHiddenRef.current = false; }
    }
  };
  const handleOpenComplete = () => setIsOpen(true);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    initAudioContext();
    if (!audioRef.current.paused) { audioRef.current.pause(); wasPlayingBeforeHiddenRef.current = false; }
    else {
      if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume().catch(() => {});
      audioRef.current.play().catch(() => {});
      wasPlayingBeforeHiddenRef.current = true;
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (gainNodeRef.current) gainNodeRef.current.gain.value = newVol;
    if (audioRef.current) { try { audioRef.current.volume = newVol; } catch { /* iOS */ } }
  };

  const handleGoogleSheetsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...rsvpForm, contact: null, side: 'groom-hindi' }),
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

  // ─── STYLES ─── //
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

  const hindiHeaderStyle: React.CSSProperties = {
    fontFamily: "'Noto Serif Devanagari', 'Playfair Display', serif",
    fontSize: '24px',
    color: '#8c2d42',
    margin: '0 0 4px 0',
    fontWeight: '700',
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
    letterSpacing: '0.12em',
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
        minHeight: '100dvh',
        background: 'linear-gradient(180deg, #fdf6f7 0%, #fceef1 20%, #fff8f0 45%, #fdf2f5 65%, #fef6e8 85%, #fcf0f2 100%)',
        color: '#3b111a',
        fontFamily: "'Noto Serif Devanagari', 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
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

      {/* Luxury Ambient Lighting Orbs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-8%', left: '-18%', width: '450px', height: '450px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(244, 182, 194, 0.45) 0%, rgba(248, 218, 224, 0.15) 50%, transparent 70%)', filter: 'blur(70px)', animation: 'float 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '20%', right: '-18%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(245, 230, 180, 0.1) 50%, transparent 70%)', filter: 'blur(70px)', animation: 'float 10s ease-in-out infinite 2s' }} />
        <div style={{ position: 'absolute', top: '50%', left: '-12%', width: '480px', height: '480px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(140, 45, 66, 0.2) 0%, rgba(226, 114, 137, 0.08) 50%, transparent 70%)', filter: 'blur(70px)', animation: 'float 9s ease-in-out infinite 4s' }} />
        <div style={{ position: 'absolute', top: '78%', right: '-12%', width: '480px', height: '480px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.22) 0%, rgba(254, 240, 199, 0.08) 50%, transparent 70%)', filter: 'blur(70px)', animation: 'float 11s ease-in-out infinite 1s' }} />
      </div>

      {isOpen && <FloatingParticles />}

      <audio ref={audioRef} loop preload="auto" src="/audio/wedding-music.mp3" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />

      <LanguageSwitch currentLang="hi" basePath="/g" />

      {/* Floating Audio Control with Volume Slider */}
      {(isOpen || isPlaying) && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
        >
          {/* Volume Slider (appears above button) */}
          <AnimatePresence>
            {showVolumeSlider && (
              <motion.div
                initial={{ opacity: 0, y: 10, scaleY: 0.8 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: 10, scaleY: 0.8 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 248, 240, 0.8) 100%)',
                  backdropFilter: 'blur(28px) saturate(200%)',
                  WebkitBackdropFilter: 'blur(28px) saturate(200%)',
                  borderRadius: '20px',
                  padding: '14px 12px',
                  border: '1.5px solid rgba(212, 175, 55, 0.3)',
                  boxShadow: '0 10px 28px -4px rgba(115, 35, 53, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.5), inset 0 2px 3px rgba(255, 255, 255, 1)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                  width: '48px',
                }}
              >
                <span style={{ fontSize: '8px', fontWeight: '800', letterSpacing: '0.08em', color: '#8c2d42', textTransform: 'uppercase' as const }}>{Math.round(volume * 100)}%</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  style={{
                    width: '100px',
                    height: '4px',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    background: `linear-gradient(to right, #8c2d42 0%, #d4af37 ${volume * 100}%, rgba(212, 175, 55, 0.2) ${volume * 100}%, rgba(212, 175, 55, 0.2) 100%)`,
                    borderRadius: '2px',
                    outline: 'none',
                    cursor: 'pointer',
                    transform: 'rotate(-90deg)',
                    transformOrigin: 'center center',
                  }}
                />
                <span style={{ fontSize: '10px', color: '#d4af37' }}>🔊</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Audio Toggle Button */}
          <button
            onClick={toggleAudio}
            onDoubleClick={(e) => { e.preventDefault(); setShowVolumeSlider(v => !v); }}
            onContextMenu={(e) => { e.preventDefault(); setShowVolumeSlider(v => !v); }}
            aria-label="संगीत चालू/बंद (वॉल्यूम के लिए लॉन्ग प्रेस)"
            onTouchStart={() => {
              const timer = setTimeout(() => setShowVolumeSlider(v => !v), 500);
              (window as unknown as Record<string, ReturnType<typeof setTimeout>>).__volTimer = timer;
            }}
            onTouchEnd={() => {
              const timer = (window as unknown as Record<string, ReturnType<typeof setTimeout>>).__volTimer;
              if (timer) clearTimeout(timer);
            }}
            style={{
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
              position: 'relative',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {isPlaying ? <Volume2 size={20} className="animate-pulse" /> : <VolumeX size={20} />}
          </button>
          {/* Hint dot */}
          {isPlaying && !showVolumeSlider && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
              onClick={() => setShowVolumeSlider(true)}
              style={{ fontSize: '7px', color: '#8c2d42', cursor: 'pointer', marginTop: '-6px', letterSpacing: '0.05em', fontWeight: '700' }}
            >
              ● ● ●
            </motion.span>
          )}
        </motion.div>
      )}

      {/* ═══ ENVELOPE INTRO ═══ */}
      {!isOpen && <EnvelopeIntro onStartOpen={handleStartOpen} onOpen={handleOpenComplete} lang="hi" />}

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
              padding: '18px 18px 16px 18px', marginBottom: '28px',
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
              style={{ width: '100%', height: '80px', backgroundImage: 'url(/images/floral-arch.jpg)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'top center', mixBlendMode: 'multiply', marginBottom: '0px', position: 'relative', zIndex: 2 }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px', position: 'relative', zIndex: 2 }}>
              {/* Monogram Medallion */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, duration: 0.8, type: 'spring', stiffness: 120 }}
                style={{
                  position: 'relative', width: '68px', height: '68px', borderRadius: '50%',
                  border: '2px solid rgba(212, 175, 55, 0.4)',
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(254, 245, 225, 0.5) 50%, rgba(255, 255, 255, 0.75) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 12px 28px -4px rgba(140, 45, 66, 0.2), 0 0 20px 2px rgba(212, 175, 55, 0.25), inset 0 2px 3px rgba(255, 255, 255, 1), inset 0 -1.5px 2px rgba(212, 175, 55, 0.3), 0 0 0 1px rgba(212, 175, 55, 0.35)',
                  marginBottom: '8px', overflow: 'hidden',
                  animation: 'goldPulse 4s ease-in-out infinite',
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: '8%', right: '8%', height: '48%', background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0) 100%)', borderRadius: '50px 50px 0 0', pointerEvents: 'none' }} />
                <span style={{ position: 'relative', zIndex: 2, fontFamily: "'Noto Serif Devanagari', serif", fontSize: '17px', fontWeight: '700', color: '#8c2d42', letterSpacing: '0.02em', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '6px', lineHeight: 1 }}>
                  ह <span style={{ fontSize: '10px', color: '#c49a2c', lineHeight: 1 }}>❖</span> रु
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
                <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '12px', letterSpacing: '0.08em', color: '#8c2d42', fontWeight: '700', margin: 0 }}>
                  ॥ श्री गणेशाय नमः ॥
                </p>
                <span style={{ fontSize: '11px', color: '#b45309' }}>✨</span>
              </motion.div>

              <OrnamentalDivider />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '13px', letterSpacing: '0.06em', color: '#632533', fontWeight: '600', margin: '0 0 8px 0', lineHeight: '1.7' }}
              >
                आप सादर आमंत्रित हैं इस शुभ विवाह में
              </motion.p>

              {/* Couple Names */}
              <motion.h1
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.8, type: 'spring', stiffness: 80 }}
                style={{ fontFamily: "'Great Vibes', cursive", fontSize: '48px', color: '#7a2335', margin: '2px 0 4px 0', fontWeight: 'normal', lineHeight: '1.1', textShadow: '0 3px 16px rgba(140, 45, 66, 0.12), 0 1px 4px rgba(212, 175, 55, 0.1)' }}
              >
                Harsh &amp; Rutbi
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '20px', color: '#8c2d42', margin: '0 0 12px 0', fontWeight: '700' }}
              >
                हर्ष <span style={{ color: '#c49a2c', fontSize: '16px' }}>❖</span> रुतबी
              </motion.p>

              {/* Scratch Card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                style={{ width: '82%', margin: '6px auto 8px auto', display: 'flex', justifyContent: 'center' }}
              >
                <HeartScratchCard
                  dateText="बुधवार, 09 दिसंबर 2026"
                  venueText="होटल नालंदा रीजेंसी, राजगीर"
                  foilHeader="तारीख़ याद रखियेगा, जी! 📅"
                  foilSubtitle="टैप करें या स्क्रैच करें"
                  revealedStatusText=""
                  swipeToScratchText="✨ टैप करें या स्क्रैच करें"
                  scrollButtonText="कार्यक्रम देखें"
                  onScrollRequest={scrollToCelebrations}
                />
              </motion.div>

              {/* Venue Info Pod */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                style={{ width: '100%', marginTop: '4px', marginBottom: '8px', padding: '14px 16px', borderRadius: '24px', background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.82) 0%, rgba(254, 243, 225, 0.45) 100%)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '1.5px solid rgba(212, 175, 55, 0.2)', boxShadow: '0 12px 32px -8px rgba(140, 45, 66, 0.12), inset 0 2px 3px rgba(255, 255, 255, 1), inset 0 -1px 2px rgba(212, 175, 55, 0.15)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
              >
                <GoldShimmer />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '10px', letterSpacing: '0.14em', color: '#8c2d42', fontWeight: '800', background: 'rgba(255, 243, 205, 0.75)', padding: '4px 12px', borderRadius: '9999px', marginBottom: '8px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                    <span>📍</span> <span>विवाह स्थल</span>
                  </div>
                  <h3 style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '18px', color: '#4a1525', margin: '0 0 4px 0', fontWeight: '700' }}>{weddingVenueName}</h3>
                  <p style={{ fontSize: '11.5px', color: '#7a4e58', margin: '0 0 10px 0', lineHeight: '1.5' }}>{weddingVenueAddress}</p>
                  <div style={{ width: '60%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent)', margin: '10px auto' }} />
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '10px', letterSpacing: '0.14em', color: '#856404', fontWeight: '800', background: 'rgba(255, 243, 205, 0.55)', padding: '4px 12px', borderRadius: '9999px', marginBottom: '6px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                    <span>🏠</span> <span>शादी से पहले और रिसेप्शन</span>
                  </div>
                  <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '13px', color: '#614603', margin: 0, fontWeight: '700' }}>झाझा, बिहार</p>
                </div>
              </motion.div>
            </div>

            {/* Scroll CTA */}
            <motion.div
              onClick={scrollToCelebrations}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              style={{ marginTop: '10px', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, rgba(140, 45, 66, 0.9) 0%, rgba(110, 28, 46, 0.95) 100%)', padding: '10px 24px', borderRadius: '9999px', boxShadow: '0 8px 22px -4px rgba(140, 45, 66, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <span style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '10px', letterSpacing: '0.12em', color: '#ffffff', fontWeight: '700' }}>कार्यक्रम देखें</span>
                <ChevronDown size={14} color="#ffd700" className="animate-bounce" />
              </div>
            </motion.div>
          </motion.section>

          {/* ══════════ INVITATION GREETING ══════════ */}
          <RevealOnScroll>
            <section id="wedding-details-start" style={{ ...sectionCardStyle, position: 'relative' }}>
              <GoldShimmer />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>💌</div>
                <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '15px', lineHeight: '1.85', color: '#5c2c38', margin: '0 0 12px 0', fontStyle: 'italic' }}>
                  &ldquo;बस हो गया फ़ैसला! अनगिनत मुलाकातों, हँसी-ठिठोली और पारिवारिक बहसों के बाद, आख़िरकार हम बंधन में बँधने वाले हैं। सच कहें तो हमारा ये ख़ास दिन बिना अपनों के अधूरा है।&rdquo;
                </p>
                <OrnamentalDivider />
                <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '13.5px', lineHeight: '1.7', color: '#8c2d42', margin: 0, fontWeight: '600' }}>
                  रस्मों के लिए आइए, मज़े के लिए रुकिए, खाने का लुत्फ़ उठाइए और हमारे अजीब डांस मूव्स का मज़ा लीजिए 💕
                </p>
              </div>
            </section>
          </RevealOnScroll>

          {/* ══════════ COUNTDOWN ══════════ */}
          <RevealOnScroll delay={0.1}>
            <section style={{ ...sectionCardStyle, background: 'linear-gradient(145deg, rgba(255, 253, 248, 0.92) 0%, rgba(254, 245, 238, 0.6) 50%, rgba(255, 250, 242, 0.4) 100%)', position: 'relative' }}>
              <GoldShimmer />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h2 style={hindiHeaderStyle}>उल्टी गिनती शुरू!</h2>
                <OrnamentalDivider />
                <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '12.5px', color: '#7a4e58', margin: '0 0 18px 0', fontStyle: 'italic' }}>
                  जब तक हर्ष ज़िंदगी भर के लिए TV का रिमोट सरेंडर करें! ⏳
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
                <h2 style={hindiHeaderStyle}>कुछ ख़ास लम्हे</h2>
                <OrnamentalDivider />
                <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '12px', color: '#7a4e58', margin: 0, fontStyle: 'italic' }}>
                  उस सफ़र की अनफ़िल्टर्ड यादें जो हमें यहाँ तक लाया
                </p>
              </div>

              <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 20px 44px rgba(138, 43, 66, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.4)', border: '2px solid rgba(255, 255, 255, 0.9)', backgroundColor: '#1f070e' }}>
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    style={{ position: 'absolute', inset: 0 }}
                  >
                    <img src={galleryImages[currentSlide].src} alt={galleryImages[currentSlide].title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, transparent 35%, rgba(15,2,6,0.88) 100%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '24px', left: '18px', right: '18px', textAlign: 'center', color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}>
                      <h3 style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '18px', fontWeight: '700', color: '#ffd54f', margin: '0 0 3px 0', textShadow: '0 2px 12px rgba(212, 175, 55, 0.4)' }}>{galleryImages[currentSlide].title}</h3>
                      <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '11.5px', color: '#f8bbd0', margin: 0, fontWeight: '400' }}>{galleryImages[currentSlide].desc}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {[{ dir: 'prev', fn: prevSlide, pos: { left: '10px' } }, { dir: 'next', fn: nextSlide, pos: { right: '10px' } }].map(({ dir, fn, pos }) => (
                  <button key={dir} onClick={(e) => { e.stopPropagation(); fn(); }} aria-label={dir === 'prev' ? 'पिछला' : 'अगला'} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.6) 100%)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1.5px solid rgba(255, 255, 255, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 6px 18px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 1)', zIndex: 10, transition: 'all 0.2s ease', ...pos }}>
                    {dir === 'prev' ? <ChevronLeft size={18} color="#8c2d42" /> : <ChevronRight size={18} color="#8c2d42" />}
                  </button>
                ))}

                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0, 0, 0, 0.55)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '9999px', padding: '5px 13px', color: '#fff', fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em', border: '1px solid rgba(255, 255, 255, 0.3)', zIndex: 10 }}>
                  {currentSlide + 1} / {galleryImages.length}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                {galleryImages.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentSlide(idx)} aria-label={`स्लाइड ${idx + 1}`} style={{ width: currentSlide === idx ? '28px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: currentSlide === idx ? '#8c2d42' : '#e0c0c8', border: 'none', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: currentSlide === idx ? '0 2px 8px rgba(140, 45, 66, 0.3)' : 'none' }} />
                ))}
              </div>
            </section>
          </RevealOnScroll>

          {/* ════════════════════════════════════════
              दिन 1 — हल्दी · 6 दिसंबर
          ════════════════════════════════════════ */}
          <RevealOnScroll>
            <section style={{ ...sectionCardStyle, padding: '32px 20px' }}>
              <GoldShimmer />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ ...dayBadgeBase, background: 'linear-gradient(135deg, rgba(255, 243, 205, 0.9) 0%, rgba(254, 240, 199, 0.55) 100%)', border: '1.5px solid rgba(212, 175, 55, 0.4)', color: '#856404' }}>
                  <Calendar size={12} /> दिन 1 · शनिवार, 6 दिसंबर
                </div>

                <h2 style={hindiHeaderStyle}>हल्दी रस्म</h2>
                <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '10.5px', color: '#8c2d42', letterSpacing: '0.1em', fontWeight: '800', margin: '2px 0 4px 0' }}>📍 झाझा, बिहार</p>
                <OrnamentalDivider color="#c49a2c" />

                <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '13.5px', color: '#683f49', fontStyle: 'italic', margin: '0 0 20px 0', lineHeight: '1.6', fontWeight: '500' }}>
                  &ldquo;रिश्ता पक्का हो गया, अब रंग जमाना तो बनता है!&rdquo; 😂
                </p>

                <GlowBorder color="#d4af37">
                  <div style={{ ...eventPodBase, background: 'linear-gradient(145deg, rgba(255, 253, 238, 0.9) 0%, rgba(254, 240, 199, 0.5) 100%)', boxShadow: '0 12px 32px -8px rgba(212, 175, 55, 0.22), inset 0 2px 3px rgba(255, 255, 255, 1)' }}>
                    <GoldShimmer />
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '20px' }}>💛</span>
                          <h3 style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '16px', color: '#614603', margin: 0, fontWeight: '700' }}>हल्दी की रस्म</h3>
                        </div>
                        <span style={{ ...timeBadgeBase, background: 'rgba(255, 243, 205, 0.8)', color: '#856404' }}>6 दिसंबर • सुबह 9 बजे से</span>
                      </div>
                      <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '11.5px', color: '#856404', fontWeight: '700', margin: '4px 0 8px 0' }}>सुबह 9 बजे — देसी ब्यूटी ट्रीटमेंट शुरू!</p>
                      <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '12.5px', color: '#573d03', margin: '0 0 8px 0', lineHeight: '1.7' }}>
                        दूल्हे की स्किन पे हल्दी, और रिश्तेदारों के पास अटैक करने का लाइसेंस! 😂 आज कोई स्किनकेयर रूटीन नहीं बचाएगा। पीला रंग ही रंग!
                      </p>
                      <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '11px', color: '#856404', margin: 0, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>📍 झाझा, बिहार</p>
                    </div>
                  </div>
                </GlowBorder>
              </div>
            </section>
          </RevealOnScroll>

          {/* ════════════════════════════════════════
              दिन 2 — मेहंदी और संगीत · 7 दिसंबर
          ════════════════════════════════════════ */}
          <RevealOnScroll>
            <section style={{ ...sectionCardStyle, padding: '32px 20px' }}>
              <GoldShimmer />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ ...dayBadgeBase, background: 'linear-gradient(135deg, rgba(243, 232, 255, 0.9) 0%, rgba(233, 213, 255, 0.55) 100%)', border: '1.5px solid rgba(168, 85, 247, 0.3)', color: '#6a1b9a' }}>
                  <Calendar size={12} /> दिन 2 · रविवार, 7 दिसंबर
                </div>

                <h2 style={hindiHeaderStyle}>मेहंदी और संगीत</h2>
                <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '10.5px', color: '#8c2d42', letterSpacing: '0.1em', fontWeight: '800', margin: '2px 0 4px 0' }}>📍 झाझा, बिहार</p>
                <OrnamentalDivider color="#9c27b0" />

                <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '13.5px', color: '#683f49', fontStyle: 'italic', margin: '0 0 20px 0', lineHeight: '1.6', fontWeight: '500' }}>
                  &ldquo;हाथों में मेहंदी और पैरों में डांस — आज दोनों अनिवार्य हैं!&rdquo; 💃
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Mehendi */}
                  <GlowBorder color="#22c55e">
                    <div style={{ ...eventPodBase, background: 'linear-gradient(145deg, rgba(240, 253, 244, 0.9) 0%, rgba(209, 250, 229, 0.5) 100%)', boxShadow: '0 12px 32px -8px rgba(34, 197, 94, 0.2), inset 0 2px 3px rgba(255, 255, 255, 1)' }}>
                      <div style={{ position: 'relative', zIndex: 2, textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '20px' }}>🌿</span>
                            <h3 style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '15px', color: '#14452f', margin: 0, fontWeight: '700' }}>मेहंदी की रस्म</h3>
                          </div>
                          <span style={{ ...timeBadgeBase, background: 'rgba(209, 250, 229, 0.8)', color: '#1b4332' }}>7 दिसंबर • दोपहर 1 बजे से</span>
                        </div>
                        <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '11.5px', color: '#1b4332', fontWeight: '700', margin: '4px 0 8px 0' }}>1 बजे — गॉसिप, लेकिन परमानेंट वाली!</p>
                        <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '12.5px', color: '#1b4332', margin: '0 0 8px 0', lineHeight: '1.7' }}>
                          हाथों में मेहंदी, दिमाग़ में गॉसिप, और सबकी नज़र दूल्हे के नाम पर। 👀 नाम ढूँढने वाले को मिलेगा क्या? ये तो कोई नहीं जानता!
                        </p>
                        <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '11px', color: '#2d6a4f', margin: 0, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>📍 झाझा, बिहार</p>
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
                            <h3 style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '15px', color: '#4a154b', margin: 0, fontWeight: '700' }}>संगीत की रात</h3>
                          </div>
                          <span style={{ ...timeBadgeBase, background: 'rgba(243, 232, 255, 0.8)', color: '#6a1b9a' }}>7 दिसंबर • शाम 7 बजे से</span>
                        </div>
                        <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '11.5px', color: '#6a1b9a', fontWeight: '700', margin: '4px 0 8px 0' }}>शाम 7 बजे — टैलेंट ऑप्शनल, कॉन्फ़िडेंस ज़रूरी!</p>
                        <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '12.5px', color: '#4a154b', margin: '0 0 8px 0', lineHeight: '1.7' }}>
                          जो घर पे कहते हैं &ldquo;मुझे डांस नहीं आता,&rdquo; वही स्टेज पे सबसे आगे मिलेंगे। 💃 और जो डांस नहीं करेंगे, उनकी अटेंडेंस सिर्फ़ डिनर के लिए मार्क होगी!
                        </p>
                        <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '11px', color: '#6a1b9a', margin: 0, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>📍 झाझा, बिहार</p>
                      </div>
                    </div>
                  </GlowBorder>
                </div>

                {/* Notice */}
                <div style={{ marginTop: '18px', padding: '16px 18px', borderRadius: '20px', background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.85) 0%, rgba(254, 243, 199, 0.42) 100%)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1.5px solid rgba(212, 175, 55, 0.4)', boxShadow: 'inset 0 2px 3px rgba(255, 255, 255, 0.98), 0 6px 18px rgba(212, 175, 55, 0.08)', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '16px' }}>⚠️</span>
                    <span style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '11px', fontWeight: '800', letterSpacing: '0.08em', color: '#8c2d42' }}>सार्वजनिक सूचना</span>
                  </div>
                  <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '12.5px', color: '#683f49', margin: 0, lineHeight: '1.7' }}>
                    शादी में शर्माना मना है। डांस न करना शक के घेरे में है। और खाना खाके चुपचाप निकल जाना? CCTV में सब दिख रहा है, जी! 😂
                  </p>
                </div>
              </div>
            </section>
          </RevealOnScroll>

          {/* ════════════════════════════════════════
              दिन 3 — देव पूजन · 8 दिसंबर
          ════════════════════════════════════════ */}
          <RevealOnScroll>
            <section style={{ ...sectionCardStyle, padding: '32px 20px' }}>
              <GoldShimmer />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ ...dayBadgeBase, background: 'linear-gradient(135deg, rgba(255, 237, 213, 0.9) 0%, rgba(254, 215, 170, 0.55) 100%)', border: '1.5px solid rgba(234, 88, 12, 0.3)', color: '#9a3412' }}>
                  <Calendar size={12} /> दिन 3 · सोमवार, 8 दिसंबर
                </div>

                <h2 style={hindiHeaderStyle}>देव पूजन</h2>
                <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '10.5px', color: '#8c2d42', letterSpacing: '0.1em', fontWeight: '800', margin: '2px 0 4px 0' }}>📍 झाझा, बिहार</p>
                <OrnamentalDivider color="#ea580c" />

                <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '13.5px', color: '#683f49', fontStyle: 'italic', margin: '0 0 20px 0', lineHeight: '1.6', fontWeight: '500' }}>
                  &ldquo;शादी से पहले देवताओं का आशीर्वाद — सबसे ज़रूरी रस्म!&rdquo; 🙏
                </p>

                <GlowBorder color="#ea580c">
                  <div style={{ ...eventPodBase, background: 'linear-gradient(145deg, rgba(255, 237, 213, 0.9) 0%, rgba(254, 215, 170, 0.48) 100%)', boxShadow: '0 12px 32px -8px rgba(234, 88, 12, 0.2), inset 0 2px 3px rgba(255, 255, 255, 1)' }}>
                    <GoldShimmer />
                    <div style={{ position: 'relative', zIndex: 2, textAlign: 'left' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '20px' }}>🪔</span>
                          <h3 style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '16px', color: '#9a3412', margin: 0, fontWeight: '700' }}>देव पूजन विधि</h3>
                        </div>
                        <span style={{ ...timeBadgeBase, background: 'rgba(255, 237, 213, 0.8)', color: '#9a3412' }}>8 दिसंबर • सुबह से</span>
                      </div>
                      <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '11.5px', color: '#9a3412', fontWeight: '700', margin: '4px 0 8px 0' }}>शुभ विवाह से पूर्व दैवीय आशीर्वाद</p>
                      <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '12.5px', color: '#7c2d12', margin: '0 0 8px 0', lineHeight: '1.7' }}>
                        कुल देवता का पवित्र पूजन — विवाह से पहले की सबसे महत्वपूर्ण विधि। पूजा, प्रसाद, और घर का पवित्र माहौल — सब मिलके देवताओं से आशीर्वाद लेंगे कि शादी में कोई ड्रामा न हो! 🙏✨
                      </p>
                      <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '11px', color: '#9a3412', margin: 0, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>📍 झाझा, बिहार</p>
                    </div>
                  </div>
                </GlowBorder>
              </div>
            </section>
          </RevealOnScroll>

          {/* ════════════════════════════════════════
              दिन 4 — विवाह · 9 दिसंबर
          ════════════════════════════════════════ */}
          <RevealOnScroll>
            <section style={{ ...sectionCardStyle, padding: '32px 20px', background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 242, 246, 0.65) 50%, rgba(254, 243, 199, 0.35) 100%)' }}>
              <GoldShimmer />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ ...dayBadgeBase, background: 'linear-gradient(135deg, rgba(252, 228, 236, 0.9) 0%, rgba(251, 207, 232, 0.55) 100%)', border: '1.5px solid rgba(140, 45, 66, 0.35)', color: '#8c2d42' }}>
                  <Calendar size={12} /> दिन 4 · मंगलवार, 9 दिसंबर
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Sparkles size={22} color="#d4af37" style={{ animation: 'float 3s ease-in-out infinite' }} />
                  <Heart size={18} color="#8c2d42" style={{ animation: 'float 3s ease-in-out infinite 0.5s' }} />
                </div>
                <h2 style={{ ...hindiHeaderStyle, fontSize: '28px' }}>शुभ विवाह</h2>
                <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '10.5px', color: '#8c2d42', letterSpacing: '0.08em', fontWeight: '800', margin: '2px 0 4px 0' }}>
                  बुधवार, 09 दिसंबर 2026 · होटल नालंदा रीजेंसी, राजगीर
                </p>
                <OrnamentalDivider />

                <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '13px', color: '#683f49', fontStyle: 'italic', margin: '0 0 20px 0', lineHeight: '1.6' }}>
                  आज शादी है, जनाब! इमोशंस भी होंगे और पेट-पूजा भी। 😂
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
                            <h3 style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '15px', color: '#614603', margin: 0, fontWeight: '700' }}>अतिथि आगमन एवं स्वागत</h3>
                          </div>
                          <span style={{ ...timeBadgeBase, background: 'rgba(255, 243, 205, 0.8)', color: '#856404' }}>सुबह 10 बजे</span>
                        </div>
                        <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '12.5px', color: '#573d03', margin: '0 0 8px 0', lineHeight: '1.7' }}>
                          आते ही चाय-समोसा पकड़िये, फ़ैमिली से गले मिलिये, और उन सवालों के लिए तैयार हो जाइए: &ldquo;पहचाना मुझे?&rdquo; और &ldquo;अब तुम्हारी बारी कब है?&rdquo; 😂
                        </p>
                        <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '11px', color: '#b45309', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>📍 होटल नालंदा रीजेंसी, राजगीर</p>
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
                            <h3 style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '15px', color: '#4a121e', margin: 0, fontWeight: '700' }}>विवाह संस्कार</h3>
                          </div>
                          <span style={{ ...timeBadgeBase, background: 'rgba(252, 228, 236, 0.8)', color: '#8c2d42' }}>11:30 बजे से</span>
                        </div>
                        <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '12.5px', color: '#4a121e', margin: '0 0 8px 0', lineHeight: '1.7' }}>
                          वरमाला होगी, फेरे होंगे, आँखें नम होंगी... और पीछे से कोई न कोई पूछेगा, &ldquo;खाना कब खुलेगा?&rdquo; 🥺🍲 आशीर्वाद तैयार रखिये, भूख भी!
                        </p>
                        <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '11px', color: '#9d174d', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>📍 होटल नालंदा रीजेंसी, राजगीर</p>
                      </div>
                    </div>
                  </GlowBorder>
                </div>

                {/* Zaroori Suchna */}
                <div style={{ marginTop: '18px', padding: '16px 18px', borderRadius: '20px', background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.85) 0%, rgba(254, 243, 199, 0.42) 100%)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1.5px solid rgba(212, 175, 55, 0.4)', boxShadow: 'inset 0 2px 3px rgba(255, 255, 255, 0.98), 0 6px 18px rgba(212, 175, 55, 0.08)', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '17px' }}>🍽️</span>
                    <span style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '11.5px', fontWeight: '800', letterSpacing: '0.06em', color: '#8c2d42' }}>ज़रूरी सूचना, जी!</span>
                  </div>
                  <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '12.5px', color: '#683f49', margin: 0, lineHeight: '1.7' }}>
                    डाइट कल से। आज तो शादी है! एक प्लेट प्यार के नाम, दूसरी स्वाद के नाम... और तीसरी बस, &ldquo;थोड़ा सा और ले लेते हैं।&rdquo; 😂
                  </p>
                </div>
              </div>
            </section>
          </RevealOnScroll>

          {/* ════════════════════════════════════════
              दिन 6 — रिसेप्शन · 11 दिसंबर
          ════════════════════════════════════════ */}
          <RevealOnScroll>
            <section style={{ ...sectionCardStyle, padding: '32px 20px' }}>
              <GoldShimmer />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ ...dayBadgeBase, background: 'linear-gradient(135deg, rgba(219, 234, 254, 0.9) 0%, rgba(191, 219, 254, 0.55) 100%)', border: '1.5px solid rgba(37, 99, 235, 0.25)', color: '#1e40af' }}>
                  <Calendar size={12} /> दिन 6 · गुरुवार, 11 दिसंबर
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Sparkles size={22} color="#d4af37" style={{ animation: 'float 3s ease-in-out infinite' }} />
                  <span style={{ fontSize: '22px' }}>🎉</span>
                </div>
                <h2 style={hindiHeaderStyle}>भव्य रिसेप्शन</h2>
                <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '10.5px', color: '#8c2d42', letterSpacing: '0.08em', fontWeight: '800', margin: '2px 0 4px 0' }}>
                  गुरुवार, 11 दिसंबर 2026 · झाझा, बिहार
                </p>
                <OrnamentalDivider color="#2563eb" />

                <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '13.5px', color: '#683f49', fontStyle: 'italic', margin: '0 0 20px 0', lineHeight: '1.6', fontWeight: '500' }}>
                  &ldquo;शादी तो हो गई, अब पार्टी भी तो बनती है!&rdquo; 🥂
                </p>

                <GlowBorder color="#2563eb">
                  <div style={{ ...eventPodBase, background: 'linear-gradient(145deg, rgba(219, 234, 254, 0.9) 0%, rgba(191, 219, 254, 0.48) 100%)', boxShadow: '0 12px 32px -8px rgba(37, 99, 235, 0.2), inset 0 2px 3px rgba(255, 255, 255, 1)' }}>
                    <div style={{ position: 'relative', zIndex: 2, textAlign: 'left' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '20px' }}>🥂</span>
                          <h3 style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '16px', color: '#1e3a5f', margin: 0, fontWeight: '700' }}>शादी का रिसेप्शन</h3>
                        </div>
                        <span style={{ ...timeBadgeBase, background: 'rgba(219, 234, 254, 0.8)', color: '#1e40af' }}>11 दिसंबर • शाम से</span>
                      </div>
                      <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '11.5px', color: '#1e40af', fontWeight: '700', margin: '4px 0 8px 0' }}>जश्न, दावत और सबका साथ — एक शाम ख़ास</p>
                      <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '12.5px', color: '#1e3a5f', margin: '0 0 8px 0', lineHeight: '1.7' }}>
                        नए जोड़े का स्वागत, दावत-ए-ख़ास, और फ़ोटो सेशन जिसमें सबको &ldquo;एक और एक और&rdquo; चाहिए! 📸 ड्रेस टू इम्प्रेस और भूख किंग-साइज़ लाना। परिवार, दोस्त, और प्यार — सब एक जगह! 🎊
                      </p>
                      <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '11px', color: '#1e40af', margin: 0, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>📍 झाझा, बिहार</p>
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
                <h2 style={hindiHeaderStyle}>विवाह स्थल</h2>
                <h3 style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '17px', color: '#614603', margin: '0 0 4px 0', fontWeight: '700' }}>{weddingVenueName}</h3>
                <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '12.5px', color: '#7a4e58', margin: '0 0 8px 0', lineHeight: '1.6' }}>{weddingVenueAddress}</p>
                <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '12px', color: '#683f49', margin: '0 0 18px 0', fontStyle: 'italic' }}>
                  राजगीर की मुख्य सड़क पर सुविधाजनक स्थान पर स्थित। कोई भी मदद चाहिए तो बेझिझक फ़ोन करें!
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                  <a href={googleMapsWeddingUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #8c2d42 0%, #6e1c2e 100%)', color: '#ffffff', padding: '13px 30px', borderRadius: '9999px', fontSize: '12.5px', fontWeight: '700', textDecoration: 'none', border: '1px solid rgba(255, 255, 255, 0.35)', boxShadow: '0 12px 28px -6px rgba(140, 45, 66, 0.45), inset 0 2px 3px rgba(255, 255, 255, 0.45)', transition: 'transform 0.25s ease', fontFamily: "'Noto Serif Devanagari', serif" }} onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.transform = 'scale(1)'; }}>
                    <MapPin size={15} /> विवाह स्थल · Google Maps
                  </a>
                  <a href={googleMapsJhajhaUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #856404 0%, #614603 100%)', color: '#ffffff', padding: '11px 26px', borderRadius: '9999px', fontSize: '11.5px', fontWeight: '700', textDecoration: 'none', border: '1px solid rgba(255, 255, 255, 0.35)', boxShadow: '0 10px 24px -6px rgba(133, 100, 4, 0.4), inset 0 2px 3px rgba(255, 255, 255, 0.4)', transition: 'transform 0.25s ease', fontFamily: "'Noto Serif Devanagari', serif" }} onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.transform = 'scale(1)'; }}>
                    <MapPin size={14} /> झाझा, बिहार · Google Maps
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
                <h2 style={hindiHeaderStyle}>क्या पहनें?</h2>
                <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '10.5px', color: '#8c2d42', letterSpacing: '0.1em', fontWeight: '800', margin: '2px 0 4px 0' }}>हर फ़ंक्शन के लिए सुझाव</p>
                <OrnamentalDivider />

                <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '12.5px', color: '#683f49', fontStyle: 'italic', margin: '0 0 20px 0', lineHeight: '1.6' }}>
                  &ldquo;सबसे ज़रूरी बात: वो पहनिए जिसमें आप ख़ुश, आरामदायक, और डांस के लिए तैयार हों!&rdquo; ✨
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
                  {[
                    { emoji: '💛', title: 'हल्दी · 6 दिसंबर', colors: ['#f59e0b', '#ec4899'], label: 'पीला या गुलाबी', bg: 'rgba(255, 253, 238, 0.9)', bgEnd: 'rgba(254, 240, 199, 0.5)', textColor: '#614603', bodyColor: '#573d03', shadow: 'rgba(212, 175, 55, 0.22)', desc: 'पीला या गुलाबी रंग! बस ऐसा कुछ पहनें जिस पर थोड़ी हल्दी लग जाए तो कोई ग़म न हो — हल्दी हर जगह पहुँचने का रास्ता खोज ही लेती है! 🌸' },
                    { emoji: '🌿', title: 'मेहंदी · 7 दिसंबर', colors: ['#2d6a4f'], label: 'हरे रंग के शेड्स', bg: 'rgba(240, 253, 244, 0.9)', bgEnd: 'rgba(209, 250, 229, 0.5)', textColor: '#14452f', bodyColor: '#1b4332', shadow: 'rgba(34, 197, 94, 0.18)', desc: 'हरे रंग का कोई भी शेड! आसानी से फोल्ड होने वाली आस्तीन वाले कपड़े स्मार्ट चॉइस हैं जब तक मेहंदी सूखे। 🌿' },
                    { emoji: '🪩', title: 'संगीत · 7 दिसंबर', colors: ['#9c27b0'], label: 'इंडो-वेस्टर्न', bg: 'rgba(253, 244, 255, 0.9)', bgEnd: 'rgba(243, 232, 255, 0.5)', textColor: '#4a154b', bodyColor: '#4a154b', shadow: 'rgba(168, 85, 247, 0.18)', desc: 'इंडो-वेस्टर्न, फ़ेस्टिव, या स्पार्कली! सबसे ज़रूरी — ऐसा कुछ चुनें जिसमें पूरी शाम डांस और मस्ती कर सकें। 💃' },
                    { emoji: '👑', title: 'विवाह · 9 दिसंबर', colors: ['#8c2d42'], label: 'ट्रेडिशनल और रॉयल', bg: 'rgba(255, 242, 245, 0.92)', bgEnd: 'rgba(252, 228, 236, 0.5)', textColor: '#4a121e', bodyColor: '#4a121e', shadow: 'rgba(140, 45, 66, 0.2)', desc: 'साड़ी, लहंगा, शेरवानी, या सूट! जितना चाहें सज-धज कर आइए — बस लाल रंग दुल्हन के लिए बचा कर रखें! 👑' },
                    { emoji: '🥂', title: 'रिसेप्शन · 11 दिसंबर', colors: ['#1e40af'], label: 'एलिगेंट और ग्लैमरस', bg: 'rgba(219, 234, 254, 0.9)', bgEnd: 'rgba(191, 219, 254, 0.5)', textColor: '#1e3a5f', bodyColor: '#1e3a5f', shadow: 'rgba(37, 99, 235, 0.18)', desc: 'अपनी बेस्ट इवनिंग वियर! सूट, गाउन, लहंगा — ऑल आउट जाइए। ये ग्रैंड फ़िनाले है आख़िरकार! ✨' },
                  ].map((item, idx) => (
                    <div key={idx} style={{ ...eventPodBase, background: `linear-gradient(145deg, ${item.bg} 0%, ${item.bgEnd} 100%)`, boxShadow: `0 10px 28px -6px ${item.shadow}, inset 0 2px 3px rgba(255, 255, 255, 1)` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '18px' }}>{item.emoji}</span>
                          <h3 style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '14.5px', color: item.textColor, margin: 0, fontWeight: '700' }}>{item.title}</h3>
                        </div>
                        <span style={{ ...timeBadgeBase, background: `${item.bg}`, color: item.textColor, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {item.colors.map((c, i) => <span key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: c }} />)}
                          {item.label}
                        </span>
                      </div>
                      <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '12.5px', color: item.bodyColor, margin: 0, lineHeight: '1.7' }}>{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '18px', padding: '14px 16px', borderRadius: '20px', background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(254, 243, 199, 0.38) 100%)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1.5px solid rgba(212, 175, 55, 0.4)', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>👟</span>
                  <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '12px', color: '#683f49', margin: 0, lineHeight: '1.6' }}>
                    <strong style={{ color: '#8c2d42' }}>काम की बात:</strong> बैग में एक जोड़ी आरामदायक फ़्लैट्स रख लेना हमेशा समझदारी का फ़ैसला है — ख़ासकर जब म्यूज़िक ज़ोरदार हो!
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
                <h2 style={hindiHeaderStyle}>यात्रा और आवागमन</h2>
                <OrnamentalDivider />
                <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '13px', color: '#683f49', margin: 0, lineHeight: '1.8' }}>
                  झाझा रेल (झाझा जंक्शन) और सड़क मार्ग से अच्छी तरह जुड़ा हुआ है। राजगीर, झाझा से लगभग 65 किमी की दूरी पर है, सड़क और रेल दोनों से पहुँचा जा सकता है। लोकल टैक्सी, कैब, और ऑटो-रिक्शा आसानी से उपलब्ध हैं। रास्ते में कोई भी दिक्कत हो तो बेझिझक फ़ोन करें। आपकी सुरक्षित यात्रा की कामना करते हैं — हम बेसब्री से आपका इंतज़ार कर रहे हैं! 🚗
                </p>
              </div>
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section style={sectionCardStyle}>
              <GoldShimmer />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <Building size={22} color="#8c2d42" style={{ margin: '0 auto 6px auto' }} />
                <h2 style={hindiHeaderStyle}>कहाँ ठहरेंगे?</h2>
                <OrnamentalDivider />
                <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '13px', color: '#683f49', margin: '0 0 10px 0', lineHeight: '1.8' }}>
                  हम चाहते हैं कि सब एक छत के नीचे हों — एक बड़े ख़ुशहाल परिवार की तरह! विवाह के दिन मेहमानों के लिए राजगीर में <strong style={{ color: '#4a1525' }}>होटल नालंदा रीजेंसी</strong> में कमरे रिज़र्व हैं। झाझा के फ़ंक्शन्स के लिए प्यार से स्थानीय इंतज़ाम किए गए हैं। चेक इन करें, बैग रखें, फ़्रेश हों, और पार्टी में शामिल हो जाएँ! 🏨
                </p>
                <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '11.5px', color: '#8c2d42', margin: 0, fontWeight: '600' }}>📍 होटल नालंदा रीजेंसी — डांगी टोला, बस स्टैंड के पास, NH 82, राजगीर, बिहार - 803116</p>
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
                  <h2 style={hindiHeaderStyle}>क्या आप आ रहे हैं?</h2>
                  <OrnamentalDivider />
                  <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '12px', color: '#7a4e58', margin: '6px 0 0 0', fontStyle: 'italic' }}>
                    कृपया 25 नवंबर तक बताइए ताकि हम आपके लिए आरामदायक जगह और गर्मागर्म मिठाई रख सकें 💕
                  </p>
                </div>

                {isSubmitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 120 }} style={{ textAlign: 'center', padding: '28px 14px' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(209, 250, 229, 0.9) 0%, rgba(187, 247, 208, 0.5) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', boxShadow: '0 8px 24px rgba(34, 197, 94, 0.2)' }}>
                      <CheckCircle2 size={32} color="#15803d" />
                    </div>
                    <h3 style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '20px', color: '#4a1525', margin: '0 0 6px 0' }}>वाह, शुक्रिया!</h3>
                    <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '13.5px', color: '#7a4e58', margin: 0, lineHeight: '1.6' }}>
                      आपका संदेश मिल गया! एक ऐसे जश्न में आपका स्वागत करने के लिए बेक़रार हैं जो हम सब को सालों तक याद रहेगा 💕
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleGoogleSheetsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <label style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '12.5px', color: '#683f49', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>जी, आपकी शुभ पहचान? 😄</label>
                      <input type="text" required placeholder="अपना शुभ नाम लिखें..." value={rsvpForm.name} onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })} style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(212,175,55,0.15), 0 4px 12px rgba(212,175,55,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)'; e.currentTarget.style.boxShadow = inputStyle.boxShadow as string; e.currentTarget.style.transform = 'translateY(0)'; }} />
                    </div>

                    <div>
                      <label style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '12.5px', color: '#683f49', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>तो जनाब, बारात में मिल रहे हैं ना? 💃</label>
                      <select required value={rsvpForm.attending} onChange={(e) => setRsvpForm({ ...rsvpForm, attending: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(212,175,55,0.15), 0 4px 12px rgba(212,175,55,0.08)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)'; e.currentTarget.style.boxShadow = inputStyle.boxShadow as string; }}>
                        <option value="">एक विकल्प चुनें...</option>
                        <option value="जी हाँ, ज़रूर आएंगे! ❤️">जी हाँ, ज़रूर आएंगे! ❤️</option>
                        <option value="बिल्कुल! डांस फ़्लोर हिला देंगे! 🕺">बिल्कुल! डांस फ़्लोर हिला देंगे! 🕺</option>
                        <option value="बहुत मन था पर नहीं आ पाएंगे 🥺">बहुत मन था पर नहीं आ पाएंगे 🥺</option>
                        <option value="अभी घर पे परमिशन लेनी है 😂">अभी घर पे परमिशन लेनी है 😂</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '12.5px', color: '#683f49', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>कुछ आशीर्वाद, कुछ राज़, कुछ डांस रिक्वेस्ट? 💌</label>
                      <textarea rows={3} placeholder="आशीर्वाद, शुभकामनाएँ या कोई ख़ास फ़रमाइश..." value={rsvpForm.message} onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })} style={{ ...inputStyle, borderRadius: '22px', resize: 'none' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(212,175,55,0.15), 0 4px 12px rgba(212,175,55,0.08)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)'; e.currentTarget.style.boxShadow = inputStyle.boxShadow as string; }} />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ background: isSubmitting ? '#9c6270' : 'linear-gradient(135deg, #8c2d42 0%, #681829 100%)', color: '#ffffff', padding: '15px 28px', borderRadius: '9999px', border: '1.5px solid rgba(255, 255, 255, 0.4)', fontSize: '14px', fontWeight: '700', cursor: isSubmitting ? 'not-allowed' : 'pointer', textAlign: 'center', marginTop: '4px', boxShadow: '0 12px 28px -6px rgba(140, 45, 66, 0.5), inset 0 2px 3px rgba(255, 255, 255, 0.5)', letterSpacing: '0.03em', transition: 'background 0.3s ease', fontFamily: "'Noto Serif Devanagari', serif" }}
                    >
                      {isSubmitting ? 'भेज रहे हैं...' : 'RSVP भेजें 💌'}
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
                  <span style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '10px', fontWeight: '800', letterSpacing: '0.1em', color: '#856404' }}>अंतिम सूचना • कोई बहाना नहीं चलेगा</span>
                </div>

                <OrnamentalDivider width="240px" />

                <h2 style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '22px', color: '#4a121e', margin: '0 0 4px 0', fontWeight: '700' }}>
                  डांस, दावत और जश्न के लिए तैयार?
                </h2>

                <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: '34px', color: '#8c2d42', margin: '4px 0 14px 0', lineHeight: '1.2', textShadow: '0 2px 10px rgba(140, 45, 66, 0.1)' }}>
                  हम बेसब्री से आपका इंतज़ार कर रहे हैं!
                </p>

                <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '13px', color: '#683f49', lineHeight: '1.8', margin: '0 auto 20px auto', maxWidth: '380px' }}>
                  अपनी बेस्ट एनर्जी और सबसे आरामदायक डांसिंग कपड़े पैक कीजिए! ख़राब डांसिंग न सिर्फ़ स्वीकार्य है, बल्कि सख़्ती से अनिवार्य है। अगर कोई पूछे कि चौथी प्लेट मिठाई क्यों ले रहे हो, तो बस कह दीजिए दूल्हा-दुल्हन ने ख़ुद कहा था! 🍨
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '22px' }}>
                  {[
                    { emoji: '🍨', text: 'अनलिमिटेड मिठाई', bg: 'rgba(255, 243, 205, 0.8)', color: '#573d03' },
                    { emoji: '🥁', text: 'ज़ोरदार ढोल', bg: 'rgba(209, 250, 229, 0.8)', color: '#14452f' },
                    { emoji: '💃', text: 'कोई जजमेंट नहीं', bg: 'rgba(243, 232, 255, 0.8)', color: '#4a154b' },
                  ].map((tag, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '11px', fontWeight: '700', color: tag.color, background: tag.bg, border: '1px solid rgba(255, 255, 255, 0.95)', padding: '6px 14px', borderRadius: '9999px', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', boxShadow: '0 3px 8px rgba(0, 0, 0, 0.04), inset 0 1px 1.5px #fff' }}
                    >
                      {tag.emoji} {tag.text}
                    </motion.span>
                  ))}
                </div>

                <OrnamentalDivider width="200px" />

                <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: '12px', color: '#7a4e58', margin: '0 0 4px 0', fontStyle: 'italic' }}>
                  ढेर सारे प्यार, ज़ीरो चिल, और पहले से ही दुखते पैरों के साथ,
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
