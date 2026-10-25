'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';
import HeartScratchCard from '../components/HeartScratchCard';
import CountdownTimer from '../components/CountdownTimer';
import EnvelopeIntro from '../components/EnvelopeIntro';
import LanguageSwitch from '../components/LanguageSwitch';

// Google Apps Script Web App URL for RSVP Responses
const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxxpyCpncoO_JnM22kcPpVYdPNXVs6sOp4mIs69qlp7waSmKxtkemu7GsuvP9t0RLV8/exec';

export default function HindiWeddingInvitation() {
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
  const [showScrollPrompt, setShowScrollPrompt] = useState(true);

  // Auto-dismiss floating scroll prompt once user scrolls past hero section
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setShowScrollPrompt(false);
      } else {
        setShowScrollPrompt(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const venueName = 'होटल नालंदा रीजेंसी';
  const venueAddress = 'डांगी टोला, बस स्टैंड के समीप, एन.एच. 82, राजगीर, बिहार - 803116';

  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Hotel Nalanda Regency, Dangi Tola, Near Bus Stand, NH 82, Rajgir, Bihar - 803116'
  )}`;

  const galleryImages = [
    {
      src: '/images/gallery-4.png',
      title: 'पहली मुस्कान',
      desc: 'जहां से हमारी प्यारी सी कहानी शुरू हुई',
    },
    {
      src: '/images/gallery-3.jpg',
      title: 'हमारी पसंदीदा बातें',
      desc: 'खुद के ही चुटकुलों पर हंसते हम दोनों',
    },
    {
      src: '/images/gallery-2.jpg',
      title: 'हर कदम साथ-साथ',
      desc: 'चाय की चुस्कियों से लेकर ज़िंदगी के हर सफर तक',
    },
    {
      src: '/images/gallery-1.jpg',
      title: '09 दिसम्बर का इंतज़ार',
      desc: 'आप सभी के आशीर्वाद के साथ नई शुरुआत',
    },
  ];

  // Auto-advance photo carousel every 4.5s
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isOpen, galleryImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Audio Lifecycle: Auto-pause when switching tabs/apps, auto-resume on return
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }

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

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseMusic();
      } else {
        resumeMusic();
      }
    };

    const handleWindowBlur = () => {
      pauseMusic();
    };

    const handleWindowFocus = () => {
      resumeMusic();
    };

    const handlePageHide = () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };

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
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleStartOpen = async () => {
    if (audioRef.current) {
      try {
        audioRef.current.volume = 0.3;
        await audioRef.current.play();
        wasPlayingBeforeHiddenRef.current = true;
      } catch {
        wasPlayingBeforeHiddenRef.current = false;
      }
    }
  };

  const handleOpenComplete = () => {
    setIsOpen(true);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (!audioRef.current.paused) {
      audioRef.current.pause();
      wasPlayingBeforeHiddenRef.current = false;
    } else {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
      wasPlayingBeforeHiddenRef.current = true;
    }
  };

  const handleGoogleSheetsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...rsvpForm,
          contact: null,
          submittedAt: new Date().toISOString(),
          language: 'hi',
        }),
      });

      setIsSubmitted(true);
      setRsvpForm({ name: '', contact: null, attending: '', message: '' });
    } catch {
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Liquid Glass Luxury Card Styles
  const sectionCardStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 250, 252, 0.52) 100%)',
    backdropFilter: 'blur(24px) saturate(190%)',
    WebkitBackdropFilter: 'blur(24px) saturate(190%)',
    borderRadius: '28px',
    padding: '32px 22px',
    marginBottom: '24px',
    boxShadow: '0 20px 48px -12px rgba(115, 35, 53, 0.10), inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.95), inset 0 -1.5px 2px 0 rgba(212, 175, 55, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.45)',
    border: '1px solid rgba(255, 255, 255, 0.85)',
    textAlign: 'center' as const,
    color: '#4a232b',
    position: 'relative' as const,
  };

  const headerStyle = {
    fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif",
    fontSize: '24px',
    color: '#8c2d42',
    margin: '0 0 6px 0',
    fontWeight: '400',
    letterSpacing: '0.02em',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #fdf6f7 0%, #faedf0 35%, #fff5ea 70%, #fcf0f2 100%)',
        color: '#381119',
        fontFamily: "'Noto Serif Devanagari', 'Outfit', sans-serif",
        fontWeight: '500',
        position: 'relative',
        paddingBottom: '80px',
        overflowX: 'hidden',
      }}
    >
      {/* Liquid Glass Ambient Lighting Orbs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-6%', left: '-15%', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(244, 182, 194, 0.4) 0%, rgba(248, 218, 224, 0.15) 50%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', top: '25%', right: '-15%', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.22) 0%, rgba(245, 230, 180, 0.1) 50%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', top: '55%', left: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(140, 45, 66, 0.18) 0%, rgba(226, 114, 137, 0.1) 50%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', top: '80%', right: '-10%', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, rgba(254, 240, 199, 0.1) 50%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="/audio/wedding-music.mp3"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Floating Language Switcher */}
      <LanguageSwitch currentLang="hi" />

      {/* Floating Audio Control Button */}
      {(isOpen || isPlaying) && (
        <button
          onClick={toggleAudio}
          aria-label="Toggle Audio"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 60,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 255, 255, 0.55) 100%)',
            padding: '12px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            color: '#8c2d42',
            cursor: 'pointer',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            boxShadow: '0 8px 24px -4px rgba(115, 35, 53, 0.2), inset 0 1.5px 2px rgba(255, 255, 255, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {isPlaying ? <Volume2 size={20} className="animate-pulse" /> : <VolumeX size={20} />}
        </button>
      )}

      {/* Floating Bottom Scroll Cue (Hindi) */}
      <AnimatePresence>
        {isOpen && showScrollPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToCelebrations}
            style={{
              position: 'fixed',
              bottom: '22px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 55,
              cursor: 'pointer',
              maxWidth: 'calc(100vw - 110px)',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 243, 205, 0.9) 100%)',
                backdropFilter: 'blur(20px) saturate(190%)',
                WebkitBackdropFilter: 'blur(20px) saturate(190%)',
                border: '1.5px solid rgba(212, 175, 55, 0.8)',
                borderRadius: '9999px',
                padding: '8px 18px',
                boxShadow: '0 8px 24px -4px rgba(140, 45, 66, 0.28), 0 0 16px rgba(212, 175, 55, 0.25), inset 0 1.5px 2px #fff',
                color: '#8c2d42',
                fontSize: '11px',
                fontWeight: '700',
                fontFamily: "'Noto Serif Devanagari', serif",
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: '13px' }}>👇</span>
              <span>कार्यक्रम व विवरण देखने के लिए नीचे स्क्रॉल करें</span>
              <ChevronDown size={14} color="#8c2d42" className="animate-bounce" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. LUXURY ENVELOPE INTRO SCENE (Hindi) */}
      {!isOpen && (
        <EnvelopeIntro
          onStartOpen={handleStartOpen}
          onOpen={handleOpenComplete}
          lang="hi"
        />
      )}

      {/* 2. MAIN INVITATION CONTENT (Hindi) */}
      {isOpen && (
        <main style={{ maxWidth: '440px', margin: '0 auto', padding: '16px 16px 40px 16px' }}>

          {/* Luxury Main Arched Invitation Card with Liquid Glass Finish */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              position: 'relative',
              borderRadius: '32px',
              border: '1px solid rgba(255, 255, 255, 0.92)',
              boxShadow: '0 24px 50px -12px rgba(138, 43, 66, 0.12), inset 0 2px 3px 0 rgba(255, 255, 255, 1), inset 0 -1.5px 2px 0 rgba(212, 175, 55, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.45)',
              padding: '20px 18px 20px 18px',
              marginBottom: '20px',
              textAlign: 'center',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.86) 0%, rgba(255, 248, 250, 0.58) 100%)',
              backdropFilter: 'blur(28px) saturate(190%)',
              WebkitBackdropFilter: 'blur(28px) saturate(190%)',
            }}
          >
            {/* Background Palace Garden Wash */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '220px',
                opacity: 0.18,
                pointerEvents: 'none',
                maskImage: 'linear-gradient(180deg, black 40%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(180deg, black 40%, transparent 100%)',
              }}
            >
              <img
                src="/images/palace-garden.jpg"
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Top Floral Arch Header */}
            <div
              style={{
                width: '100%',
                height: '110px',
                backgroundImage: 'url(/images/floral-arch.jpg)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'top center',
                marginBottom: '10px',
                borderRadius: '16px 16px 0 0',
              }}
            />

            {/* Monogram Crest with Liquid Glass Finish */}
            <div
              style={{
                position: 'relative',
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.95)',
                margin: '0 auto 10px auto',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(254, 245, 225, 0.45) 50%, rgba(255, 255, 255, 0.70) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 24px -4px rgba(140, 45, 66, 0.18), 0 0 16px 1px rgba(212, 175, 55, 0.22), inset 0 1.5px 2.5px rgba(255, 255, 255, 1), inset 0 -1px 2px rgba(212, 175, 55, 0.25), 0 0 0 1px rgba(212, 175, 55, 0.3)',
                overflow: 'hidden',
              }}
            >
              {/* Top specular reflection arc */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '10%',
                  right: '10%',
                  height: '46%',
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 100%)',
                  borderRadius: '50px 50px 0 0',
                  pointerEvents: 'none',
                }}
              />
              <span
                style={{
                  position: 'relative',
                  zIndex: 2,
                  fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif",
                  fontSize: '18px',
                  color: '#8c2d42',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                }}
              >
                ह &amp; रु
              </span>
            </div>

            {/* Ganesh Shloka */}
            <p
              style={{
                fontSize: '12px',
                color: '#8c2d42',
                fontWeight: '700',
                margin: '0 0 6px 0',
                letterSpacing: '0.08em',
              }}
            >
              ॥ श्री गणेशाय नमः ॥
            </p>

            {/* Sub-header */}
            <h1
              style={{
                fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif",
                fontSize: '24px',
                color: '#732335',
                margin: '0 0 8px 0',
                fontWeight: '400',
              }}
            >
              शुभ विवाह आमंत्रण
            </h1>

            {/* Decorative Gold Separator */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '8px 0 16px 0' }}>
              <div style={{ width: '40px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '12px', margin: '0 8px' }}>♥</span>
              <div style={{ width: '40px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>

            {/* Invitation Text */}
            <p
              style={{
                fontSize: '12px',
                lineHeight: '1.7',
                color: '#6e3c48',
                maxWidth: '320px',
                margin: '0 auto 18px auto',
              }}
            >
              परमपिता परमेश्वर के असीम अनुग्रह एवं पूज्य बुजुर्गों के शुभाशीर्वाद से हमारे इस पावन प्रसंग में आप सपरिवार सादर आमंत्रित हैं।
            </p>

            {/* Couple Names */}
            <div style={{ margin: '14px 0 20px 0' }}>
              <h2
                style={{
                  fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif",
                  fontSize: '32px',
                  color: '#8c2d42',
                  margin: '0 0 4px 0',
                  lineHeight: '1.2',
                  letterSpacing: '0.02em',
                }}
              >
                हर्ष
              </h2>
              <p
                style={{
                  fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif",
                  fontSize: '18px',
                  color: '#d4af37',
                  margin: '2px 0',
                  fontWeight: '600',
                }}
              >
                संग
              </p>
              <h2
                style={{
                  fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif",
                  fontSize: '32px',
                  color: '#8c2d42',
                  margin: '4px 0 0 0',
                  lineHeight: '1.2',
                  letterSpacing: '0.02em',
                }}
              >
                रुतबी
              </h2>
            </div>

            {/* ══ THE REAL SCRATCH CARD (Directly below couple names) ══ */}
            <div style={{ width: '100%', margin: '10px 0 10px 0', display: 'flex', justifyContent: 'center' }}>
              <HeartScratchCard
                dateText="बुधवार, 09 दिसम्बर 2026"
                venueText="होटल नालंदा रीजेंसी, राजगीर"
                coupleName="हर्ष संग रुतबी"
                foilHeader="कैलेंडर में तारीख नोट कर लें, जी! 📅"
                foilSubtitle="तारीख देखने के लिए टैप या स्क्रैच करें"
                revealedPillText="✦ पावन विवाह तिथि ✦"
                celebrateNote="आपकी गरिमामयी उपस्थिति प्रार्थनीय है 💕"
                revealedStatusText="शुभ तिथि प्रकट! 🎉"
                swipeToScratchText="✨ टैप या स्क्रैच करें"
                scrollCueText="कार्यक्रम व विवरण देखने के लिए नीचे स्क्रॉल करें"
                scrollButtonText="कार्यक्रम व अन्य विवरण देखें"
                onScrollRequest={scrollToCelebrations}
              />
            </div>

            {/* Subtle Scroll Cue Pill below scratch card */}
            <div
              onClick={scrollToCelebrations}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                margin: '2px auto 8px auto',
                padding: '4px 14px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.72)',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(140, 45, 66, 0.06)',
              }}
            >
              <span style={{ fontSize: '9.5px', color: '#8c2d42', fontWeight: '700', fontFamily: "'Noto Serif Devanagari', serif" }}>
                स्थल व अन्य कार्यक्रम देखने के लिए नीचे स्क्रॉल करें
              </span>
              <ChevronDown size={12} color="#8c2d42" className="animate-bounce" />
            </div>

            {/* Venue Location Liquid Glass Pod */}
            <div
              style={{
                width: '100%',
                marginTop: '16px',
                marginBottom: '12px',
                padding: '16px 18px',
                borderRadius: '22px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.78) 0%, rgba(254, 243, 225, 0.42) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.95)',
                boxShadow: '0 10px 28px -6px rgba(140, 45, 66, 0.12), inset 0 1.5px 2px rgba(255, 255, 255, 1), inset 0 -1px 2px rgba(212, 175, 55, 0.16)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '9.5px',
                  letterSpacing: '0.12em',
                  color: '#8c2d42',
                  fontWeight: '700',
                  background: 'rgba(255, 243, 205, 0.7)',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  marginBottom: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                  fontFamily: "'Noto Serif Devanagari', serif",
                }}
              >
                <span>📍</span>
                <span>विवाह स्थल</span>
              </div>
              <p
                style={{
                  fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif",
                  fontSize: '17px',
                  color: '#4a1525',
                  margin: '0 0 4px 0',
                  fontWeight: '500',
                }}
              >
                {venueName}
              </p>
              <p style={{ fontSize: '11.5px', color: '#7a4e58', margin: '0 0 12px 0', lineHeight: '1.5', fontFamily: "'Noto Serif Devanagari', serif" }}>
                {venueAddress}
              </p>
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #8c2d42 0%, #681829 100%)',
                  color: '#ffffff',
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(115, 35, 53, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  fontFamily: "'Noto Serif Devanagari', serif",
                }}
              >
                गूगल मैप्स पर देखें ➔
              </a>
            </div>

            <div
              onClick={scrollToCelebrations}
              style={{ display: 'flex', justifyContent: 'center', marginTop: '14px', cursor: 'pointer' }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 255, 255, 0.72)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  boxShadow: '0 2px 8px rgba(140, 45, 66, 0.08), inset 0 1px 1px #fff',
                }}
              >
                <ChevronDown size={18} color="#8c2d42" className="animate-bounce" />
              </div>
            </div>
          </motion.section>

          {/* 3. Shloka & Mangal Card */}
          <section id="wedding-details-start" style={sectionCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '0 0 8px 0' }}>
              <Sparkles size={20} color="#8c2d42" />
            </div>
            <p
              style={{
                fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif",
                fontSize: '17px',
                color: '#732335',
                margin: '0 0 8px 0',
                lineHeight: '1.6',
              }}
            >
              “मंगलम् भगवान विष्णुः मंगलम् गरुड़ध्वजः।<br />मंगलम् पुण्डरीकाक्षः मंगलाय तनो हरिः॥”
            </p>
            <p style={{ fontSize: '13px', color: '#683f49', margin: '0 0 8px 0', lineHeight: '1.65', fontFamily: "'Noto Serif Devanagari', serif" }}>
              “हम दोनों शादी के बंधन में बंधने जा रहे हैं! अनगिनत बातें, हंसी और परिवार की सहमति के बाद आखिरकार वो शुभ घड़ी आ ही गई। सच कहें तो, अपने सबसे प्यारे लोगों की मौजूदगी के बिना हमारे इस खास दिन का जश्न अधूरा होगा।”
            </p>
            <p style={{ fontSize: '12.5px', color: '#8c2d42', margin: 0, fontWeight: '600', fontFamily: "'Noto Serif Devanagari', serif" }}>
              आशीर्वाद देने जरूर आएं, ढेर सारा खाना खाएं और डांस फ्लोर पर खूब रंग जमाएं 💕
            </p>
          </section>

          {/* 4. Wedding Date Highlights Card */}
          <section style={sectionCardStyle}>
            <Calendar size={20} color="#8c2d42" style={{ margin: '0 auto 6px auto' }} />
            <h2 style={headerStyle}>शुभ लग्न मुहूर्त</h2>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 14px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>

            <p
              style={{
                fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif",
                fontSize: '22px',
                color: '#8c2d42',
                margin: '0 0 4px 0',
              }}
            >
              09 दिसम्बर 2026
            </p>
            <p style={{ fontSize: '13px', color: '#7a4e58', margin: '0 0 4px 0', fontWeight: '600' }}>
              बुधवार • प्रातः 11:30 बजे से
            </p>
            <p style={{ fontSize: '12px', color: '#683f49', margin: 0 }}>
              होटल नालंदा रीजेंसी, राजगीर
            </p>
          </section>

          {/* 5. Countdown to Forever */}
          <section style={sectionCardStyle}>
            <Clock size={20} color="#8c2d42" style={{ margin: '0 auto 4px auto' }} />
            <h2 style={headerStyle}>शुभ घड़ी की प्रतीक्षा</h2>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 16px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>
            <p style={{ fontSize: '12px', color: '#7a4e58', margin: '0 0 16px 0', fontStyle: 'italic', fontFamily: "'Noto Serif Devanagari', serif" }}>
              जब तक हर्ष आधिकारिक तौर पर टीवी का रिमोट हमेशा के लिए नहीं सौंप देते! ⏳
            </p>
            <CountdownTimer targetDate="2026-12-09T11:30:00" />
          </section>

          {/* 6. Photo Carousel Gallery */}
          <section style={{ ...sectionCardStyle, padding: '24px 18px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Camera size={20} color="#8c2d42" style={{ margin: '0 auto 4px auto' }} />
              <h2 style={headerStyle}>हमारी कुछ पसंदीदा यादें</h2>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 10px 0' }}>
                <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
                <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
                <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              </div>
              <p style={{ fontSize: '11.5px', color: '#7a4e58', margin: 0, fontFamily: "'Noto Serif Devanagari', serif" }}>
                उस खूबसूरत सफर की कुछ अनमोल झलकियां जो हमें यहां तक लाईं
              </p>
            </div>

            {/* Main Carousel Frame */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '380px',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 12px 30px rgba(138, 43, 66, 0.15)',
                border: '1.5px solid #e8cdd4',
                backgroundColor: '#1f070e',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  style={{ position: 'absolute', inset: 0 }}
                >
                  <img
                    src={galleryImages[currentSlide].src}
                    alt={galleryImages[currentSlide].title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                    }}
                  />

                  {/* Gradient Shadow Overlay for Text Readability */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 40%, rgba(15,2,6,0.85) 100%)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Bottom Slide Info & Caption */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '22px',
                      left: '16px',
                      right: '16px',
                      textAlign: 'center',
                      color: '#ffffff',
                      textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif",
                        fontSize: '19px',
                        fontWeight: '500',
                        color: '#ffd54f',
                        margin: '0 0 2px 0',
                      }}
                    >
                      {galleryImages[currentSlide].title}
                    </h3>
                    <p
                      style={{
                        fontSize: '11px',
                        color: '#f8bbd0',
                        margin: 0,
                        fontWeight: '400',
                      }}
                    >
                      {galleryImages[currentSlide].desc}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrow Buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                aria-label="Previous Photo"
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 255, 255, 0.55) 100%)',
                  backdropFilter: 'blur(16px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.95)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(140, 45, 66, 0.2), inset 0 1px 1.5px rgba(255, 255, 255, 1)',
                  zIndex: 10,
                  transition: 'all 0.2s ease',
                }}
              >
                <ChevronLeft size={18} color="#8c2d42" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                aria-label="Next Photo"
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 255, 255, 0.55) 100%)',
                  backdropFilter: 'blur(16px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.95)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(140, 45, 66, 0.2), inset 0 1px 1.5px rgba(255, 255, 255, 1)',
                  zIndex: 10,
                  transition: 'all 0.2s ease',
                }}
              >
                <ChevronRight size={18} color="#8c2d42" />
              </button>

              {/* Liquid Glass Slide Counter Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(0, 0, 0, 0.52)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderRadius: '9999px',
                  padding: '4px 12px',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: '600',
                  letterSpacing: '0.1em',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.4)',
                  zIndex: 10,
                }}
              >
                {currentSlide + 1} / {galleryImages.length}
              </div>
            </div>

            {/* Thumbnail Navigation Indicators */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                marginTop: '14px',
              }}
            >
              {galleryImages.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  style={{
                    width: currentSlide === idx ? '26px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: currentSlide === idx ? '#8c2d42' : '#e0c0c8',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              ))}
            </div>
          </section>

          {/* 7. Pre-Wedding Events (वैवाहिक पूर्व कार्यक्रम) */}
          <section style={{ ...sectionCardStyle, padding: '28px 18px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <Sparkles size={20} color="#8c2d42" />
              <span style={{ fontSize: '18px' }}>🎉</span>
            </div>
            <h2 style={headerStyle}>वैवाहिक पूर्व उत्सव</h2>
            <p style={{ fontSize: '11px', color: '#8c2d42', letterSpacing: '0.1em', fontWeight: '700', margin: '2px 0 6px 0', fontFamily: "'Noto Serif Devanagari', serif" }}>
              मंगलवार, 08 दिसम्बर 2026 • प्रातः 9:00 बजे से
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 14px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>

            <p style={{ fontSize: '12px', color: '#683f49', fontStyle: 'italic', marginBottom: '18px', lineHeight: '1.5', margin: '0 0 18px 0', fontFamily: "'Noto Serif Devanagari', serif" }}>
              “विवाह से पूर्व के सभी प्यारे उत्सव एक ही यादगार दिन में!” ✨
            </p>

            {/* Event-by-Event Liquid Glass Cards (Hindi) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
              {/* Haldi Liquid Glass Pod */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 253, 238, 0.85) 0%, rgba(254, 240, 199, 0.45) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.95)',
                  borderRadius: '22px',
                  padding: '16px 16px',
                  boxShadow: '0 10px 28px -6px rgba(212, 175, 55, 0.22), inset 0 1.5px 2px 0 rgba(255, 255, 255, 1), inset 0 -1px 2px 0 rgba(212, 175, 55, 0.15)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>💛</span>
                    <h3 style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '16.5px', color: '#614603', margin: 0, fontWeight: '500' }}>
                      हल्दी उत्सव
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      background: 'rgba(255, 243, 205, 0.75)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      color: '#856404',
                      padding: '4px 11px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255, 255, 255, 0.95)',
                      boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 1), 0 2px 8px rgba(180, 130, 20, 0.1)',
                      fontFamily: "'Noto Serif Devanagari', serif",
                    }}
                  >
                    08 दिसम्बर • प्रातः 9:00 बजे से
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#573d03', margin: '0 0 4px 0', lineHeight: '1.55', fontFamily: "'Noto Serif Devanagari', serif" }}>
                  हल्दी का उबटन, बड़ों का आशीर्वाद और हंसी-खुशी से दिन की शुरुआत। 🍋
                </p>
                <p style={{ fontSize: '10.5px', color: '#856404', margin: 0, fontWeight: '600', fontFamily: "'Noto Serif Devanagari', serif" }}>
                  📍 होटल नालंदा रीजेंसी, राजगीर
                </p>
              </div>

              {/* Mehendi Liquid Glass Pod */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(240, 253, 244, 0.85) 0%, rgba(209, 250, 229, 0.45) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.95)',
                  borderRadius: '22px',
                  padding: '16px 16px',
                  boxShadow: '0 10px 28px -6px rgba(34, 197, 94, 0.18), inset 0 1.5px 2px 0 rgba(255, 255, 255, 1), inset 0 -1px 2px 0 rgba(34, 197, 94, 0.12)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>🌿</span>
                    <h3 style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '16.5px', color: '#14452f', margin: 0, fontWeight: '500' }}>
                      मेहंदी की रस्म
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      background: 'rgba(209, 250, 229, 0.75)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      color: '#1b4332',
                      padding: '4px 11px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255, 255, 255, 0.95)',
                      boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 1), 0 2px 8px rgba(34, 197, 94, 0.1)',
                      fontFamily: "'Noto Serif Devanagari', serif",
                    }}
                  >
                    08 दिसम्बर • दोपहर 1:00 बजे से
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#1b4332', margin: '0 0 4px 0', lineHeight: '1.55', fontFamily: "'Noto Serif Devanagari', serif" }}>
                  हाथों में रचेगी खूबसूरत हिना, साथ में मनपसंद संगीत और दोपहर का भोजन। 🍃
                </p>
                <p style={{ fontSize: '10.5px', color: '#2d6a4f', margin: 0, fontWeight: '600', fontFamily: "'Noto Serif Devanagari', serif" }}>
                  📍 होटल नालंदा रीजेंसी, राजगीर
                </p>
              </div>

              {/* Sangeet Liquid Glass Pod */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(253, 244, 255, 0.85) 0%, rgba(243, 232, 255, 0.45) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.95)',
                  borderRadius: '22px',
                  padding: '16px 16px',
                  boxShadow: '0 10px 28px -6px rgba(168, 85, 247, 0.18), inset 0 1.5px 2px 0 rgba(255, 255, 255, 1), inset 0 -1px 2px 0 rgba(168, 85, 247, 0.12)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>🪩</span>
                    <h3 style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '16.5px', color: '#4a154b', margin: 0, fontWeight: '500' }}>
                      संगीत संध्या
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      background: 'rgba(243, 232, 255, 0.75)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      color: '#6a1b9a',
                      padding: '4px 11px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255, 255, 255, 0.95)',
                      boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 1), 0 2px 8px rgba(168, 85, 247, 0.1)',
                      fontFamily: "'Noto Serif Devanagari', serif",
                    }}
                  >
                    08 दिसम्बर • सायं 7:00 बजे से
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#4a154b', margin: '0 0 4px 0', lineHeight: '1.55', fontFamily: "'Noto Serif Devanagari', serif" }}>
                  शाम का खाना, प्रस्तुतियां और पूरे परिवार के साथ डांस फ्लोर पर जमकर जश्न! 💃
                </p>
                <p style={{ fontSize: '10.5px', color: '#6a1b9a', margin: 0, fontWeight: '600', fontFamily: "'Noto Serif Devanagari', serif" }}>
                  📍 होटल नालंदा रीजेंसी, राजगीर
                </p>
              </div>
            </div>

            {/* Note Pod */}
            <div
              style={{
                marginTop: '16px',
                padding: '12px 16px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(254, 243, 199, 0.35) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                boxShadow: 'inset 0 1.5px 2px rgba(255, 255, 255, 0.95), 0 4px 14px rgba(212, 175, 55, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '18px', flexShrink: 0 }}>🎉</span>
              <p style={{ fontSize: '11.5px', color: '#683f49', margin: 0, lineHeight: '1.45', fontFamily: "'Noto Serif Devanagari', serif" }}>
                उत्सव से भरा पूरा दिन — स्वादिष्ट भोजन और संगीत का आनंद लेने के लिए तैयार रहें!
              </p>
            </div>
          </section>

          {/* 8. Program Timeline (मांगलिक कार्यक्रम) */}
          <section style={{ ...sectionCardStyle, padding: '28px 18px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <Clock size={20} color="#8c2d42" />
              <Sparkles size={16} color="#d4af37" />
            </div>
            <h2 style={headerStyle}>मांगलिक कार्यक्रम</h2>
            <p style={{ fontSize: '11px', color: '#8c2d42', letterSpacing: '0.1em', fontWeight: '700', margin: '2px 0 6px 0', fontFamily: "'Noto Serif Devanagari', serif" }}>
              बुधवार, 09 दिसम्बर 2026
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 14px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>

            <p style={{ fontSize: '12px', color: '#683f49', fontStyle: 'italic', marginBottom: '18px', lineHeight: '1.5', margin: '0 0 18px 0', fontFamily: "'Noto Serif Devanagari', serif" }}>
              “शुभ घड़ी आ गई! आपकी उपस्थिति और प्यार भरा आशीर्वाद ही हमारे लिए सबसे अनमोल उपहार है।” ✨
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
              {/* Guest Arrival Liquid Glass Pod */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 253, 242, 0.85) 0%, rgba(254, 243, 199, 0.42) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.95)',
                  borderRadius: '22px',
                  padding: '16px 16px',
                  boxShadow: '0 10px 28px -6px rgba(212, 175, 55, 0.20), inset 0 1.5px 2px 0 rgba(255, 255, 255, 1), inset 0 -1px 2px 0 rgba(212, 175, 55, 0.15)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>🧳</span>
                    <h3 style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '16.5px', color: '#614603', margin: 0, fontWeight: '500' }}>
                      अतिथि आगमन एवं स्वागत
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      background: 'rgba(255, 243, 205, 0.75)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      color: '#856404',
                      padding: '4px 11px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255, 255, 255, 0.95)',
                      boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 1), 0 2px 8px rgba(180, 130, 20, 0.1)',
                      fontFamily: "'Noto Serif Devanagari', serif",
                    }}
                  >
                    09 दिसम्बर • प्रातः 10:00 बजे
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#573d03', margin: 0, lineHeight: '1.55', fontFamily: "'Noto Serif Devanagari', serif" }}>
                  होटल में आराम से चेक-इन करें, गरमा-गरम मसाला चाय या वेलकम ड्रिंक का आनंद लें और तरोताजा हो जाएं। हमारा पूरा परिवार लॉबी में आपका स्वागत करने के लिए इंतज़ार कर रहा होगा! ☕
                </p>
              </div>

              {/* Wedding Ceremony Liquid Glass Pod */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 242, 245, 0.88) 0%, rgba(252, 228, 236, 0.45) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.95)',
                  borderRadius: '22px',
                  padding: '16px 16px',
                  boxShadow: '0 10px 28px -6px rgba(140, 45, 66, 0.20), inset 0 1.5px 2px 0 rgba(255, 255, 255, 1), inset 0 -1px 2px 0 rgba(212, 175, 55, 0.18)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>💍</span>
                    <h3 style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '16.5px', color: '#4a121e', margin: 0, fontWeight: '500' }}>
                      शुभ विवाह संस्कार (वरमाला व फेरे)
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      background: 'rgba(252, 228, 236, 0.75)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      color: '#8c2d42',
                      padding: '4px 11px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255, 255, 255, 0.95)',
                      boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 1), 0 2px 6px rgba(140, 45, 66, 0.1)',
                      fontFamily: "'Noto Serif Devanagari', serif",
                    }}
                  >
                    09 दिसम्बर • प्रातः 11:30 बजे से
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#4a121e', margin: 0, lineHeight: '1.55', fontFamily: "'Noto Serif Devanagari', serif" }}>
                  वरमाला, पावन मंत्रोच्चार और सात जन्मों के पावन फेरे! अपने ढेर सारे आशीर्वाद के साथ पधारें — और हां, फेरों के तुरंत बाद स्वादिष्ट शाही दोपहर के भोजन का आनंद लें 🌸
                </p>
              </div>
            </div>

            {/* Celebrations Pro-Tip Pod */}
            <div
              style={{
                marginTop: '16px',
                padding: '12px 16px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(254, 243, 199, 0.35) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                boxShadow: 'inset 0 1.5px 2px rgba(255, 255, 255, 0.95), 0 4px 14px rgba(212, 175, 55, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '16px', flexShrink: 0 }}>🍽️</span>
              <p style={{ fontSize: '11px', color: '#683f49', margin: 0, lineHeight: '1.4', fontFamily: "'Noto Serif Devanagari', serif" }}>
                <strong style={{ color: '#8c2d42' }}>एक दोस्ताना सलाह:</strong> डाइट और कैलोरी की चिंता घर पर छोड़कर आएं — शादी का भोज बहुत प्यार और स्वाद से तैयार किया गया है!
              </p>
            </div>
          </section>

          {/* 8. Venue & Map */}
          <section style={sectionCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '0 0 8px 0' }}>
              <MapPin size={20} color="#8c2d42" />
            </div>

            <h2 style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '22px', color: '#4a1525', margin: '0 0 6px 0', fontWeight: '500' }}>
              {venueName}
            </h2>
            <p style={{ fontSize: '12px', color: '#7a4e58', margin: '0 0 8px 0', lineHeight: '1.5' }}>
              {venueAddress}
            </p>
            <p style={{ fontSize: '11.5px', color: '#683f49', margin: '0 0 16px 0', fontStyle: 'italic', fontFamily: "'Noto Serif Devanagari', serif" }}>
              राजगीर में मुख्य सड़क के पास स्थित है। रास्ते में किसी भी प्रकार की सहायता के लिए आप हमें या होटल के रिसेप्शन पर कभी भी फोन कर सकते हैं!
            </p>

            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #8c2d42 0%, #6e1c2e 100%)',
                color: '#ffffff',
                padding: '12px 28px',
                borderRadius: '9999px',
                fontSize: '12.5px',
                fontWeight: '600',
                textDecoration: 'none',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                boxShadow: '0 10px 24px -6px rgba(140, 45, 66, 0.4), inset 0 1.5px 2px rgba(255, 255, 255, 0.45)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                fontFamily: "'Noto Serif Devanagari', serif",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 14px 28px -4px rgba(115, 35, 53, 0.45)'; }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 10px 24px -6px rgba(140, 45, 66, 0.4)'; }}
            >
              गूगल मैप्स पर रास्ता देखें ➔
            </a>
          </section>

          {/* 9. Dress Code */}
          <section style={{ ...sectionCardStyle, padding: '28px 18px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <Shirt size={20} color="#8c2d42" />
              <Sparkles size={16} color="#d4af37" />
            </div>
            <h2 style={headerStyle}>परिधान सुझाव</h2>
            <p style={{ fontSize: '11px', color: '#8c2d42', letterSpacing: '0.1em', fontWeight: '700', margin: '2px 0 6px 0', fontFamily: "'Noto Serif Devanagari', serif" }}>
              प्रत्येक कार्यक्रम के लिए कुछ सुझाव
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 14px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>

            <p style={{ fontSize: '12px', color: '#683f49', fontStyle: 'italic', marginBottom: '18px', lineHeight: '1.5', margin: '0 0 18px 0', fontFamily: "'Noto Serif Devanagari', serif" }}>
              “सबसे ज़रूरी बात: वही पहनें जिसमें आप खुश, सहज और नाचने के लिए तैयार महसूस करें!” ✨
            </p>

            {/* Event-by-Event Liquid Glass Cards (Hindi) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
              {/* Haldi Liquid Glass Pod */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 253, 238, 0.85) 0%, rgba(254, 240, 199, 0.45) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.95)',
                  borderRadius: '22px',
                  padding: '16px 16px',
                  boxShadow: '0 10px 28px -6px rgba(212, 175, 55, 0.22), inset 0 1.5px 2px 0 rgba(255, 255, 255, 1), inset 0 -1px 2px 0 rgba(212, 175, 55, 0.15)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>💛</span>
                    <h3 style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '16px', color: '#614603', margin: 0, fontWeight: '500' }}>
                      हल्दी उत्सव
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      background: 'rgba(255, 243, 205, 0.75)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      color: '#856404',
                      padding: '4px 11px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255, 255, 255, 0.95)',
                      boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 1), 0 2px 8px rgba(180, 130, 20, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontFamily: "'Noto Serif Devanagari', serif",
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ec4899' }} />
                    पीला या गुलाबी
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#573d03', margin: 0, lineHeight: '1.55', fontFamily: "'Noto Serif Devanagari', serif" }}>
                  पीले या गुलाबी रंग के खूबसूरत शेड्स! बस ऐसे कपड़े चुनें जिन पर थोड़ी हल्दी लग भी जाए तो कोई फ़िक्र न हो — हल्दी तो कहीं भी पहुंच जाने के लिए मशहूर है! 🌸
                </p>
              </div>

              {/* Mehendi Liquid Glass Pod */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(240, 253, 244, 0.85) 0%, rgba(209, 250, 229, 0.45) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.95)',
                  borderRadius: '22px',
                  padding: '16px 16px',
                  boxShadow: '0 10px 28px -6px rgba(34, 197, 94, 0.18), inset 0 1.5px 2px 0 rgba(255, 255, 255, 1), inset 0 -1px 2px 0 rgba(34, 197, 94, 0.12)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>🌿</span>
                    <h3 style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '16px', color: '#14452f', margin: 0, fontWeight: '500' }}>
                      मेहंदी
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      background: 'rgba(209, 250, 229, 0.75)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      color: '#1b4332',
                      padding: '4px 11px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255, 255, 255, 0.95)',
                      boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 1), 0 2px 8px rgba(34, 197, 94, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontFamily: "'Noto Serif Devanagari', serif",
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2d6a4f' }} />
                    हरे रंग के शेड्स
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#1b4332', margin: 0, lineHeight: '1.55', fontFamily: "'Noto Serif Devanagari', serif" }}>
                  हरे रंग का कोई भी प्यारा शेड! ऐसे कपड़े जिनकी आस्तीनें आसानी से ऊपर की जा सकें, मेहंदी के समय सबसे बेहतर रहते हैं। 🍃
                </p>
              </div>

              {/* Sangeet Liquid Glass Pod */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(253, 244, 255, 0.85) 0%, rgba(243, 232, 255, 0.45) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.95)',
                  borderRadius: '22px',
                  padding: '16px 16px',
                  boxShadow: '0 10px 28px -6px rgba(168, 85, 247, 0.18), inset 0 1.5px 2px 0 rgba(255, 255, 255, 1), inset 0 -1px 2px 0 rgba(168, 85, 247, 0.12)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>🪩</span>
                    <h3 style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '16px', color: '#4a154b', margin: 0, fontWeight: '500' }}>
                      संगीत संध्या
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      background: 'rgba(243, 232, 255, 0.75)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      color: '#6a1b9a',
                      padding: '4px 11px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255, 255, 255, 0.95)',
                      boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 1), 0 2px 8px rgba(168, 85, 247, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontFamily: "'Noto Serif Devanagari', serif",
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#9c27b0' }} />
                    इंडो-वेस्टर्न व उत्सव परिधान
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#4a154b', margin: 0, lineHeight: '1.55', fontFamily: "'Noto Serif Devanagari', serif" }}>
                  इंडो-वेस्टर्न या उत्सव का कोई भी सुंदर परिधान! सबसे ज़रूरी यह है कि जूते और कपड़े ऐसे हों जिनमें आप देर तक आराम से डांस कर सकें। 💃
                </p>
              </div>

              {/* The Wedding Liquid Glass Pod */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 242, 245, 0.88) 0%, rgba(252, 228, 236, 0.45) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.95)',
                  borderRadius: '22px',
                  padding: '16px 16px',
                  boxShadow: '0 10px 28px -6px rgba(140, 45, 66, 0.20), inset 0 1.5px 2px 0 rgba(255, 255, 255, 1), inset 0 -1px 2px 0 rgba(212, 175, 55, 0.18)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>👑</span>
                    <h3 style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '16px', color: '#4a121e', margin: 0, fontWeight: '500' }}>
                      शुभ विवाह (वेडिंग)
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      background: 'rgba(252, 228, 236, 0.75)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      color: '#8c2d42',
                      padding: '4px 11px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255, 255, 255, 0.95)',
                      boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 1), 0 2px 6px rgba(140, 45, 66, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontFamily: "'Noto Serif Devanagari', serif",
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#8c2d42' }} />
                    पारंपरिक व औपचारिक
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#4a121e', margin: 0, lineHeight: '1.55', fontFamily: "'Noto Serif Devanagari', serif" }}>
                  साड़ी, लहंगा, शेरवानी या सूट! जितना चाहें सजकर आएं — बस लाल रंग दुल्हन के लिए रहने दें! 👑
                </p>
              </div>
            </div>

            {/* Helpful Footwear Tip Pod */}
            <div
              style={{
                marginTop: '16px',
                padding: '12px 16px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(254, 243, 199, 0.35) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                boxShadow: 'inset 0 1.5px 2px rgba(255, 255, 255, 0.95), 0 4px 14px rgba(212, 175, 55, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '16px', flexShrink: 0 }}>👟</span>
              <p style={{ fontSize: '11px', color: '#683f49', margin: 0, lineHeight: '1.4', fontFamily: "'Noto Serif Devanagari', serif" }}>
                <strong style={{ color: '#8c2d42' }}>एक छोटा सुझाव:</strong> देर रात संगीत में डांस के लिए अपने बैग में एक जोड़ी आरामदायक फ्लैट जूते रखना हमेशा बढ़िया निर्णय होता है!
              </p>
            </div>
          </section>
          {/* 11. Transportation & Accommodation */}
          <section style={sectionCardStyle}>
            <Car size={20} color="#8c2d42" style={{ margin: '0 auto 4px auto' }} />
            <h2 style={headerStyle}>यात्रा व आवागमन</h2>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 12px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>
            <p style={{ fontSize: '12.5px', color: '#683f49', margin: 0, lineHeight: '1.65', fontFamily: "'Noto Serif Devanagari', serif" }}>
              राजगीर सड़क एवं रेल मार्ग से भली-भांति जुड़ा हुआ है। नजदीकी रेलवे स्टेशनों एवं एयरपोर्ट से होटल तक आने के लिए स्थानीय टैक्सी, कैब और ऑटो आसानी से उपलब्ध रहते हैं। रास्ते में मार्ग से जुड़ी किसी भी सहायता के लिए आप कभी भी हमें संपर्क कर सकते हैं। आपकी सुखद एवं सुरक्षित यात्रा की मंगलकामना — हम आपके स्वागत के लिए उत्सुक हैं! 🚗
            </p>
          </section>

          <section style={sectionCardStyle}>
            <Building size={20} color="#8c2d42" style={{ margin: '0 auto 4px auto' }} />
            <h2 style={headerStyle}>आवास व्यवस्था</h2>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 12px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>
            <p style={{ fontSize: '12.5px', color: '#683f49', margin: '0 0 8px 0', lineHeight: '1.65', fontFamily: "'Noto Serif Devanagari', serif" }}>
              हम चाहते हैं कि पूरा परिवार एक साथ रहे! आप सभी प्रियजनों के लिए <strong>होटल नालंदा रीजेंसी</strong> में कमरे बुक हैं। चेक-इन करें, बैग रखें और उत्सव में शामिल हो जाएं! 🏨
            </p>
            <p style={{ fontSize: '11.5px', color: '#8c2d42', margin: 0, fontFamily: "'Noto Serif Devanagari', serif" }}>
              📍 डांगी टोला, बस स्टैंड के समीप, एन.एच. 82, राजगीर, बिहार - 803116
            </p>
          </section>

          {/* 12. RSVP Form (Direct to Google Sheets) */}
          <section style={{ ...sectionCardStyle, textAlign: 'left' }}>
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <Mail size={20} color="#8c2d42" style={{ margin: '0 auto 4px auto' }} />
              <h2 style={headerStyle}>क्या आप हमारे साथ शामिल होंगे?</h2>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
                <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
                <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
                <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              </div>
              <p style={{ fontSize: '11.5px', color: '#7a4e58', margin: '6px 0 0 0', fontStyle: 'italic', fontFamily: "'Noto Serif Devanagari', serif" }}>
                कृपया 25 नवम्बर तक बता दें ताकि आपके लिए सबसे आरामदायक कमरा और गरमा-गरम गुलाब जामुन सुरक्षित रखे जा सकें 💕
              </p>
            </div>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '24px 12px' }}
              >
                <CheckCircle2 size={42} color="#8c2d42" style={{ margin: '0 auto 10px auto' }} />
                <h3 style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '20px', color: '#4a1525', margin: '0 0 6px 0' }}>
                  हार्दिक धन्यवाद!
                </h3>
                <p style={{ fontSize: '13px', color: '#7a4e58', margin: 0, lineHeight: '1.5', fontFamily: "'Noto Serif Devanagari', serif" }}>
                  आपका संदेश हमें मिल गया है। हम राजगीर में आपका स्वागत करने और इस पावन उत्सव को साथ मनाने के लिए बेसब्री से इंतज़ार कर रहे हैं 💕
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleGoogleSheetsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* 1. Name */}
                <div>
                  <label style={{ fontSize: '12px', color: '#683f49', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontFamily: "'Noto Serif Devanagari', serif" }}>
                    <span>जी, आपकी शुभ पहचान? 😄</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="अपना शुभ नाम लिखें..."
                    value={rsvpForm.name}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '12px 18px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255, 255, 255, 0.95)',
                      fontSize: '12.5px',
                      outline: 'none',
                      background: 'rgba(255, 255, 255, 0.75)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      boxShadow: 'inset 0 1.5px 2px rgba(255, 255, 255, 0.95), 0 2px 8px rgba(115, 35, 53, 0.04)',
                      color: '#4a232b',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                      fontFamily: "'Noto Serif Devanagari', serif",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.2)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.95)'; e.currentTarget.style.boxShadow = 'inset 0 1.5px 2px rgba(255, 255, 255, 0.95), 0 2px 8px rgba(115, 35, 53, 0.04)'; }}
                  />
                </div>

                {/* 2. Attendance Selection */}
                <div>
                  <label style={{ fontSize: '12px', color: '#683f49', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontFamily: "'Noto Serif Devanagari', serif" }}>
                    <span>तो जनाब, बारात में मिल रहे हैं ना? 💃</span>
                  </label>
                  <select
                    name="attending"
                    required
                    value={rsvpForm.attending}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, attending: e.target.value })}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '12px 18px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255, 255, 255, 0.95)',
                      fontSize: '12.5px',
                      outline: 'none',
                      background: 'rgba(255, 255, 255, 0.75)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      boxShadow: 'inset 0 1.5px 2px rgba(255, 255, 255, 0.95), 0 2px 8px rgba(115, 35, 53, 0.04)',
                      color: '#4a232b',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                      fontFamily: "'Noto Serif Devanagari', serif",
                      cursor: 'pointer',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.2)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.95)'; e.currentTarget.style.boxShadow = 'inset 0 1.5px 2px rgba(255, 255, 255, 0.95), 0 2px 8px rgba(115, 35, 53, 0.04)'; }}
                  >
                    <option value="">एक विकल्प चुनें...</option>
                    <option value="जी हाँ, ज़रूर आएंगे! ❤️">जी हाँ, ज़रूर आएंगे! ❤️</option>
                    <option value="बिल्कुल! डांस फ्लोर हिला देंगे! 🕺">बिल्कुल! डांस फ्लोर हिला देंगे! 🕺</option>
                    <option value="बहुत मन था पर नहीं आ पाएंगे 🥺">बहुत मन था पर नहीं आ पाएंगे 🥺</option>
                    <option value="अभी घर पर परमिशन लेनी है 😂">अभी घर पर परमिशन लेनी है 😂</option>
                  </select>
                </div>

                {/* 3. A Note for the Couple */}
                <div>
                  <label style={{ fontSize: '12px', color: '#683f49', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontFamily: "'Noto Serif Devanagari', serif" }}>
                    <span>कुछ आशीर्वाद, कुछ राज़ या कोई फरमाइश? 💌</span>
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="अपनी शुभकामनाएं, सलाह या कोई खास फरमाइश लिखें..."
                    value={rsvpForm.message}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '12px 16px',
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.95)',
                      fontSize: '12.5px',
                      outline: 'none',
                      background: 'rgba(255, 255, 255, 0.75)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      boxShadow: 'inset 0 1.5px 2px rgba(255, 255, 255, 0.95), 0 2px 8px rgba(115, 35, 53, 0.04)',
                      resize: 'none',
                      color: '#4a232b',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                      fontFamily: "'Noto Serif Devanagari', serif",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.2)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.95)'; e.currentTarget.style.boxShadow = 'inset 0 1.5px 2px rgba(255, 255, 255, 0.95), 0 2px 8px rgba(115, 35, 53, 0.04)'; }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: isSubmitting
                      ? '#9c6270'
                      : 'linear-gradient(135deg, #8c2d42 0%, #681829 100%)',
                    color: '#ffffff',
                    padding: '13px 26px',
                    borderRadius: '9999px',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    textAlign: 'center',
                    marginTop: '6px',
                    boxShadow: '0 10px 26px -6px rgba(140, 45, 66, 0.45), inset 0 1.5px 2px rgba(255, 255, 255, 0.5)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    fontFamily: "'Noto Serif Devanagari', serif",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 14px 28px -4px rgba(115, 35, 53, 0.45)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 10px 26px -6px rgba(140, 45, 66, 0.45)'; }}
                >
                  {isSubmitting ? 'संदेश भेजा जा रहा है...' : 'अपनी उपस्थिति दर्ज करें 💌'}
                </button>
              </form>
            )}
          </section>

          {/* 13. Witty Closing Card (Hindi) */}
          <section
            style={{
              ...sectionCardStyle,
              padding: '36px 22px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 242, 246, 0.62) 100%)',
              boxShadow: '0 20px 48px -10px rgba(140, 45, 66, 0.18), inset 0 1.5px 2px rgba(255, 255, 255, 1), inset 0 -1px 2px rgba(212, 175, 55, 0.18)',
            }}
          >
            {/* Playful Top Pill Capsule */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(254, 243, 199, 0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                borderRadius: '9999px',
                padding: '4px 14px',
                marginBottom: '16px',
                boxShadow: '0 2px 8px rgba(212, 175, 55, 0.15), inset 0 1px 1px #fff',
              }}
            >
              <span style={{ fontSize: '12px' }}>🎉</span>
              <span
                style={{
                  fontSize: '9.5px',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  color: '#856404',
                  fontFamily: "'Noto Serif Devanagari', serif",
                }}
              >
                महत्वपूर्ण सूचना • कोई बहाना नहीं चलेगा
              </span>
            </div>

            {/* Modern Stylish Radiant Line Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                margin: '0 auto 16px auto',
                maxWidth: '260px',
              }}
            >
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.6), rgba(140, 45, 66, 0.8))' }} />
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#d4af37', boxShadow: '0 0 8px #d4af37' }} />
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(140, 45, 66, 0.8), rgba(212, 175, 55, 0.6), transparent)' }} />
            </div>

            {/* Humorous & Warm Headings */}
            <h2
              style={{
                fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif",
                fontSize: '22px',
                color: '#4a121e',
                margin: '0 0 4px 0',
                fontWeight: '500',
              }}
            >
              नाच, गाना और ढेर सारा जश्न!
            </h2>

            <p
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: '30px',
                color: '#8c2d42',
                margin: '0 0 12px 0',
                lineHeight: '1.2',
              }}
            >
              आपका बेसब्री से इंतज़ार रहेगा!
            </p>

            <p
              style={{
                fontSize: '12.5px',
                color: '#683f49',
                lineHeight: '1.65',
                margin: '0 auto 18px auto',
                maxWidth: '380px',
                fontFamily: "'Noto Serif Devanagari', serif",
              }}
            >
              पूरी ऊर्जा और डांस के मूड के साथ पधारें! डांस फ्लोर पर खराब डांस करने वालों का विशेष स्वागत है। और हां, अगर कोई पूछे कि चौथी प्लेट गुलाब जामुन क्यों ले रहे हैं, तो कह दीजिएगा कि दूल्हा-दुल्हन ने खुद आदेश दिया है! 🍨
            </p>

            {/* Funny Modern Pill Badges */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '20px',
              }}
            >
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: '600',
                  color: '#573d03',
                  background: 'rgba(255, 243, 205, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.95)',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 6px rgba(180, 130, 20, 0.08), inset 0 1px 1px #fff',
                  fontFamily: "'Noto Serif Devanagari', serif",
                }}
              >
                🍨 अनलिमिटेड मिठाई
              </span>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: '600',
                  color: '#14452f',
                  background: 'rgba(209, 250, 229, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.95)',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 6px rgba(46, 125, 50, 0.08), inset 0 1px 1px #fff',
                  fontFamily: "'Noto Serif Devanagari', serif",
                }}
              >
                🥁 धमाकेदार ढोल
              </span>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: '600',
                  color: '#4a154b',
                  background: 'rgba(243, 232, 255, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.95)',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 6px rgba(106, 27, 154, 0.08), inset 0 1px 1px #fff',
                  fontFamily: "'Noto Serif Devanagari', serif",
                }}
              >
                💃 खुलकर नाचें
              </span>
            </div>

            {/* Modern Stylish Bottom Line Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                margin: '0 auto 16px auto',
                maxWidth: '260px',
              }}
            >
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.6), rgba(140, 45, 66, 0.8))' }} />
              <span style={{ fontSize: '11px', color: '#8c2d42' }}>♥</span>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(140, 45, 66, 0.8), rgba(212, 175, 55, 0.6), transparent)' }} />
            </div>

            {/* Witty Sign-off */}
            <p style={{ fontSize: '11.5px', color: '#7a4e58', margin: '0 0 4px 0', fontStyle: 'italic', fontFamily: "'Noto Serif Devanagari', serif" }}>
              ढेर सारे प्यार और बिना किसी औपचारिकता के,
            </p>
            <p style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '20px', color: '#4a121e', margin: 0, fontWeight: '500' }}>
              हर्ष एवं रुतबी 💕
            </p>
          </section>

          {/* 14. Blessing Closing Plaque */}
          <section
            style={{
              ...sectionCardStyle,
              background: 'linear-gradient(135deg, rgba(140, 45, 66, 0.92) 0%, rgba(110, 28, 46, 0.88) 100%)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              boxShadow: '0 20px 48px -8px rgba(115, 35, 53, 0.45), inset 0 1.5px 2px rgba(255, 255, 255, 0.45), inset 0 -1px 2px rgba(212, 175, 55, 0.35)',
            }}
          >
            <h2
              style={{
                fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif",
                fontSize: '22px',
                color: '#ffd54f',
                margin: '0 0 6px 0',
              }}
            >
              दर्शनाभिलाषी एवं स्वागताकांक्षी
            </h2>
            <p style={{ fontSize: '12px', color: '#fceef1', margin: '0 0 12px 0', lineHeight: '1.6' }}>
              समस्त परिजन एवं रिश्तेदार
            </p>
            <div style={{ width: '40px', height: '1px', backgroundColor: '#ffd54f', margin: '0 auto 12px auto' }} />
            <p style={{ fontSize: '11px', color: '#f8bbd0', margin: 0, letterSpacing: '0.05em' }}>
              हर्ष एवं रुतबी के शुभ विवाह में आपका हार्दिक अभिनंदन
            </p>
          </section>

          {/* 14. Footer Copyright / Watermark */}
          <footer style={{ textAlign: 'center', padding: '16px 0', color: '#a6727d', fontSize: '11px' }}>
            <p style={{ margin: '0 0 4px 0' }}>
              हर्ष संग रुतबी • 09 दिसम्बर 2026
            </p>
            <p style={{ margin: 0, fontSize: '10px', opacity: 0.8 }}>
              With Love &amp; Blessings
            </p>
          </footer>
        </main>
      )}
    </div>
  );
}
