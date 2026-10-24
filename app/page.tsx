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
import HeartScratchCard from './components/HeartScratchCard';
import CountdownTimer from './components/CountdownTimer';
import EnvelopeIntro from './components/EnvelopeIntro';
import LanguageSwitch from './components/LanguageSwitch';

// Google Apps Script Web App URL for RSVP Responses
const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxxpyCpncoO_JnM22kcPpVYdPNXVs6sOp4mIs69qlp7waSmKxtkemu7GsuvP9t0RLV8/exec';

export default function WeddingInvitation() {
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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wasPlayingBeforeHiddenRef = useRef<boolean>(false);

  const venueName = 'Hotel Nalanda Regency';
  const venueAddress = 'Dangi Tola, Near Bus Stand, NH 82, Rajgir, Bihar - 803116';

  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${venueName}, ${venueAddress}`
  )}`;

  const galleryImages = [
    {
      src: '/images/gallery-4.png',
      title: 'When It All Began',
      desc: 'A stolen smile that turned into forever',
    },
    {
      src: '/images/gallery-3.jpg',
      title: 'Our Favorite Days',
      desc: 'Just two goofy souls laughing at our own jokes',
    },
    {
      src: '/images/gallery-2.jpg',
      title: 'Partners in Crime',
      desc: 'From quick chai dates to lifelong adventures',
    },
    {
      src: '/images/gallery-1.jpg',
      title: 'Ready for Dec 9',
      desc: 'Counting down to our happiest day with you',
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
      } catch (err) {
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

  // Google Sheets API Handler
  const handleGoogleSheetsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          ...rsvpForm,
          contact: null,
        }),
      });

      setIsSubmitted(true);
      setRsvpForm({ name: '', contact: null, attending: '', message: '' });
    } catch (error) {
      setIsSubmitted(true);
      setRsvpForm({ name: '', contact: null, attending: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Liquid Glass Luxury Card Styles
  const sectionCardStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 250, 252, 0.52) 100%)',
    backdropFilter: 'blur(24px) saturate(190%)',
    WebkitBackdropFilter: 'blur(24px) saturate(190%)',
    borderRadius: '28px',
    padding: '32px 22px',
    marginBottom: '24px',
    boxShadow: '0 20px 48px -12px rgba(115, 35, 53, 0.10), inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.95), inset 0 -1.5px 2px 0 rgba(212, 175, 55, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.45)',
    border: '1px solid rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    color: '#4a232b',
    position: 'relative',
  };

  const cursiveHeaderStyle: React.CSSProperties = {
    fontFamily: "'Great Vibes', cursive",
    fontSize: '34px',
    color: '#8c2d42',
    margin: '0 0 6px 0',
    fontWeight: 'normal',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #fdf6f7 0%, #faedf0 35%, #fff5ea 70%, #fcf0f2 100%)',
        color: '#3b111a',
        fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
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
      <LanguageSwitch currentLang="en" />

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

      {/* 1. LUXURY ENVELOPE INTRO SCENE */}
      {!isOpen && (
        <EnvelopeIntro
          onStartOpen={handleStartOpen}
          onOpen={handleOpenComplete}
        />
      )}

      {/* 2. MAIN INVITATION CONTENT (Rendered upon unsealing) */}
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
              padding: '24px 20px 24px 20px',
              marginBottom: '24px',
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

            {/* Floral Arch Framing */}
            <div
              style={{
                width: '100%',
                height: '110px',
                backgroundImage: 'url(/images/floral-arch.jpg)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'top center',
                mixBlendMode: 'multiply',
                marginBottom: '2px',
                position: 'relative',
                zIndex: 2,
              }}
            />

            {/* Top Ornamental Crest */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px', position: 'relative', zIndex: 2 }}>
              {/* Liquid Glass Monogram Medallion */}
              <div
                style={{
                  position: 'relative',
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255, 255, 255, 0.95)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(254, 245, 225, 0.45) 50%, rgba(255, 255, 255, 0.70) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 24px -4px rgba(140, 45, 66, 0.18), 0 0 16px 1px rgba(212, 175, 55, 0.22), inset 0 1.5px 2.5px rgba(255, 255, 255, 1), inset 0 -1px 2px rgba(212, 175, 55, 0.25), 0 0 0 1px rgba(212, 175, 55, 0.3)',
                  marginBottom: '10px',
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
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#8c2d42',
                    letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    lineHeight: 1,
                  }}
                >
                  H <span style={{ fontStyle: 'italic', fontFamily: "'Great Vibes', cursive", fontSize: '20px', color: '#c49a2c' }}>&amp;</span> R
                </span>
              </div>

              {/* Liquid Glass Auspicious Invocation Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 255, 255, 0.78)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.95)',
                  borderRadius: '9999px',
                  padding: '5px 16px',
                  boxShadow: '0 3px 12px rgba(140, 45, 66, 0.09), inset 0 1px 1.5px rgba(255, 255, 255, 1)',
                  margin: '0 auto',
                }}
              >
                <span style={{ fontSize: '11px', color: '#b45309' }}>✨</span>
                <p
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '11px',
                    letterSpacing: '0.14em',
                    color: '#8c2d42',
                    fontWeight: '700',
                    margin: 0,
                  }}
                >
                  ॥ Shree Ganeshaya Namah ॥
                </p>
                <span style={{ fontSize: '11px', color: '#b45309' }}>✨</span>
              </div>

              {/* Radiant Hairline Divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  margin: '12px auto 14px auto',
                  maxWidth: '180px',
                }}
              >
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.8))' }} />
                <span style={{ color: '#8c2d42', fontSize: '9px' }}>♥</span>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.8), transparent)' }} />
              </div>

              <p
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  color: '#632533',
                  textTransform: 'uppercase',
                  fontWeight: '500',
                  margin: '0 0 12px 0',
                }}
              >
                We request the pleasure of your company<br />to celebrate the wedding of
              </p>

              {/* Couple Names */}
              <h1
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: '52px',
                  color: '#7a2335',
                  margin: '4px 0 12px 0',
                  fontWeight: 'normal',
                  lineHeight: '1.15',
                  textShadow: '0 2px 12px rgba(140, 45, 66, 0.08)',
                }}
              >
                Harsh &amp; Rutbi
              </h1>

              {/* Interactive Gold Foil Date Reveal */}
              <div style={{ width: '100%', margin: '14px 0 16px 0', display: 'flex', justifyContent: 'center' }}>
                <HeartScratchCard
                  dateText="WEDNESDAY, DEC 09, 2026"
                  venueText="Hotel Nalanda Regency, Rajgir"
                  foilHeader="Mark Your Calendar, Ji! 📅"
                  foilSubtitle="Tap or scratch to reveal"
                  swipeToScratchText="✨ Tap or scratch to reveal"
                />
              </div>

              {/* Venue Liquid Glass Pod */}
              <div
                style={{
                  width: '100%',
                  marginTop: '10px',
                  marginBottom: '10px',
                  padding: '14px 18px',
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
                    textTransform: 'uppercase',
                    letterSpacing: '0.18em',
                    color: '#8c2d42',
                    fontWeight: '700',
                    background: 'rgba(255, 243, 205, 0.7)',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    marginBottom: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.9)',
                  }}
                >
                  <span>📍</span>
                  <span>To Be Held At</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', color: '#4a1525', margin: '0 0 4px 0', fontWeight: '700' }}>
                  {venueName}
                </h3>
                <p style={{ fontSize: '11.5px', color: '#7a4e58', margin: 0, lineHeight: '1.45' }}>
                  {venueAddress}
                </p>
              </div>
            </div>

            {/* Palace Garden Architectural Illustration */}
            <div style={{ width: '100%', opacity: 0.45, marginTop: '8px' }}>
              <svg viewBox="0 0 240 50" fill="none" stroke="#8c2d42" strokeWidth="1" style={{ width: '100%', height: '40px' }}>
                <path d="M10 45 V 25 L 35 12 L 60 25 V 45 M 50 45 V 32 H 70 V 45 M 85 45 V 18 L 120 5 L 155 18 V 45 M 105 45 V 28 H 135 V 45 M 180 45 V 25 L 205 12 L 230 25 V 45" />
                <circle cx="120" cy="5" r="3" fill="#8c2d42" />
              </svg>
            </div>

            {/* Scroll Indicator with Liquid Glass Pill */}
            <div
              style={{
                marginTop: '14px',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
              }}
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
                <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.22em', color: '#8c2d42', fontWeight: '700' }}>
                  Scroll for Itinerary
                </span>
                <ChevronDown size={13} color="#8c2d42" className="animate-bounce" />
              </div>
            </div>
          </motion.section>

          {/* 3. Invitation Greeting Card */}
          <section style={sectionCardStyle}>
            <p style={{ fontSize: '14.5px', lineHeight: '1.7', color: '#5c2c38', margin: '0 0 10px 0' }}>
              “We’re making it official! After countless dates, shared laughs, and family debates, we’re finally tying the knot. Honestly, our big day wouldn’t mean half as much without our favorite people in the room.”
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#8c2d42', margin: 0, fontWeight: '600' }}>
              Come for the vows, stay for the banter, the endless food, and our questionable dance moves 💕
            </p>
          </section>

          {/* 4. Countdown Timer Card */}
          <section style={{ ...sectionCardStyle, background: 'linear-gradient(135deg, rgba(255, 253, 248, 0.88) 0%, rgba(254, 245, 238, 0.55) 100%)' }}>
            <h2 style={cursiveHeaderStyle}>Counting Down the Days</h2>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0 16px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>
            <p style={{ fontSize: '12px', color: '#7a4e58', margin: '0 0 16px 0', fontStyle: 'italic' }}>
              Until Harsh officially surrenders the TV remote for life! ⏳
            </p>
            <CountdownTimer targetDate="2026-12-09T10:00:00" />
          </section>

          {/* 6. Photo Carousel Gallery */}
          <section style={{ ...sectionCardStyle, padding: '24px 18px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Camera size={20} color="#8c2d42" style={{ margin: '0 auto 4px auto' }} />
              <h2 style={cursiveHeaderStyle}>A Few Favorite Moments</h2>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 10px 0' }}>
                <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
                <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
                <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              </div>
              <p style={{ fontSize: '11.5px', color: '#7a4e58', margin: 0 }}>
                Unfiltered memories from the road that brought us here
              </p>
            </div>

            {/* Main Carousel Frame with Liquid Glass Edge */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '380px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 16px 36px rgba(138, 43, 66, 0.18)',
                border: '1.5px solid rgba(255, 255, 255, 0.9)',
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
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '18px',
                        fontWeight: '600',
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
                        letterSpacing: '0.05em',
                      }}
                    >
                      {galleryImages[currentSlide].desc}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Liquid Glass Navigation Arrow Buttons */}
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

          {/* 7. Pre-Wedding Festivities */}
          <section style={{ ...sectionCardStyle, padding: '28px 18px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <Sparkles size={20} color="#8c2d42" />
              <span style={{ fontSize: '18px' }}>🎉</span>
            </div>
            <h2 style={cursiveHeaderStyle}>Pre-Wedding Festivities</h2>
            <p style={{ fontSize: '10px', color: '#8c2d42', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: '700', margin: '2px 0 6px 0' }}>
              Tuesday, December 08, 2026 • 9:00 AM Onwards
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 14px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>

            <p style={{ fontSize: '13px', color: '#683f49', fontStyle: 'italic', marginBottom: '18px', lineHeight: '1.5', margin: '0 0 18px 0', fontWeight: '500' }}>
              “Rishta pakka ho gaya, ab naach-gaana toh banta hai! 😂”
            </p>

            {/* Event-by-Event Liquid Glass Cards */}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>💛</span>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: '#614603', margin: 0, fontWeight: '700' }}>
                      Haldi Ceremony
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: '700',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      background: 'rgba(255, 243, 205, 0.75)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      color: '#856404',
                      padding: '4px 11px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255, 255, 255, 0.95)',
                      boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 1), 0 2px 8px rgba(180, 130, 20, 0.1)',
                    }}
                  >
                    Dec 8 • 9:00 AM Onwards
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#856404', fontWeight: '700', margin: '2px 0 6px 0', letterSpacing: '0.02em' }}>
                  9 AM — Beauty treatment, desi edition.
                </p>
                <p style={{ fontSize: '12px', color: '#573d03', margin: '0 0 6px 0', lineHeight: '1.55' }}>
                  Dulha-dulhan ki skin pe haldi, aur rishtedaaron ke paas permission to attack! 😂 Aaj koi skincare routine nahi bachayega.
                </p>
                <p style={{ fontSize: '10.5px', color: '#856404', margin: 0, fontWeight: '600' }}>
                  📍 Hotel Nalanda Regency, Rajgir
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>🌿</span>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15.5px', color: '#14452f', margin: 0, fontWeight: '700' }}>
                      Mehendi Celebrations
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: '700',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      background: 'rgba(209, 250, 229, 0.75)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      color: '#1b4332',
                      padding: '4px 11px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255, 255, 255, 0.95)',
                      boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 1), 0 2px 8px rgba(34, 197, 94, 0.1)',
                    }}
                  >
                    Dec 8 • 1:00 PM Onwards
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#1b4332', fontWeight: '700', margin: '2px 0 6px 0', letterSpacing: '0.02em' }}>
                  1 PM — Gossip, but make it permanent.
                </p>
                <p style={{ fontSize: '12px', color: '#1b4332', margin: '0 0 6px 0', lineHeight: '1.55' }}>
                  Haathon mein mehendi, dimaag mein gossip, aur sabki nazar dulhe ke naam par. 👀 Naam dhoondhne waale ko milega kya? Yeh toh koi nahi jaanta!
                </p>
                <p style={{ fontSize: '10.5px', color: '#2d6a4f', margin: 0, fontWeight: '600' }}>
                  📍 Hotel Nalanda Regency, Rajgir
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>🪩</span>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15.5px', color: '#4a154b', margin: 0, fontWeight: '700' }}>
                      Sangeet Night
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: '700',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      background: 'rgba(243, 232, 255, 0.75)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      color: '#6a1b9a',
                      padding: '4px 11px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255, 255, 255, 0.95)',
                      boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 1), 0 2px 8px rgba(168, 85, 247, 0.1)',
                    }}
                  >
                    Dec 8 • 7:00 PM Onwards
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#6a1b9a', fontWeight: '700', margin: '2px 0 6px 0', letterSpacing: '0.02em' }}>
                  7 PM — Talent optional, confidence compulsory.
                </p>
                <p style={{ fontSize: '12px', color: '#4a154b', margin: '0 0 6px 0', lineHeight: '1.55' }}>
                  Jo ghar pe kehte hain “mujhe dance nahi aata,” wahi stage pe sabse aage milenge. 💃 Aur jo dance nahi karenge, unki attendance sirf dinner ke liye mark hogi!
                </p>
                <p style={{ fontSize: '10.5px', color: '#6a1b9a', margin: 0, fontWeight: '600' }}>
                  📍 Hotel Nalanda Regency, Rajgir
                </p>
              </div>
            </div>

            {/* Public Notice Pod */}
            <div
              style={{
                marginTop: '16px',
                padding: '14px 16px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(254, 243, 199, 0.4) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                boxShadow: 'inset 0 1.5px 2px rgba(255, 255, 255, 0.95), 0 4px 14px rgba(212, 175, 55, 0.08)',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                <span style={{ fontSize: '15px' }}>⚠️</span>
                <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8c2d42' }}>
                  Public Notice
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#683f49', margin: 0, lineHeight: '1.55' }}>
                Shaadi mein sharmaana mana hai. Dance na karna shak ke ghere mein hai. Aur khaana khaake chupchaap nikal jaana? CCTV mein sab dikh raha hai, Ji! 😂
              </p>
            </div>
          </section>

          {/* 8. The Wedding Day */}
          <section style={{ ...sectionCardStyle, padding: '28px 18px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <Clock size={20} color="#8c2d42" />
              <Sparkles size={16} color="#d4af37" />
            </div>
            <h2 style={cursiveHeaderStyle}>The Wedding Day</h2>
            <p style={{ fontSize: '10px', color: '#8c2d42', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: '700', margin: '2px 0 6px 0' }}>
              Wednesday, December 09, 2026
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 14px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>

            <p style={{ fontSize: '12px', color: '#683f49', fontStyle: 'italic', marginBottom: '18px', lineHeight: '1.5', margin: '0 0 18px 0' }}>
              Aaj shaadi hai, Janab! Emotions bhi honge aur pet-pooja bhi. 😂
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
                    <span style={{ fontSize: '18px' }}>💼</span>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15.5px', color: '#614603', margin: 0, fontWeight: '700' }}>
                      Guest Arrival &amp; Welcome
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      letterSpacing: '0.02em',
                      background: 'rgba(255, 243, 205, 0.75)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      color: '#856404',
                      padding: '4px 11px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255, 255, 255, 0.95)',
                      boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 1), 0 2px 8px rgba(180, 130, 20, 0.1)',
                    }}
                  >
                    10:00 AM — Pehle chai, phir badhai!
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#573d03', margin: '0 0 6px 0', lineHeight: '1.55' }}>
                  Aate hi chai-samosa pakdiye, family se gale miliye, aur un sawaalon ke liye ready ho jaiye: “Pehchana mujhe?” aur “Ab tumhari baari kab hai?” 😂
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#b45309', fontWeight: '600' }}>
                  <span>📍</span>
                  <span>Hotel Nalanda Regency, Rajgir</span>
                </div>
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
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15.5px', color: '#4a121e', margin: 0, fontWeight: '700' }}>
                      The Wedding Ceremony
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      letterSpacing: '0.02em',
                      background: 'rgba(252, 228, 236, 0.75)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      color: '#8c2d42',
                      padding: '4px 11px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255, 255, 255, 0.95)',
                      boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 1), 0 2px 6px rgba(140, 45, 66, 0.1)',
                    }}
                  >
                    11:30 AM onwards — Pyaar, phere aur family drama!
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#4a121e', margin: '0 0 6px 0', lineHeight: '1.55' }}>
                  Varmala hogi, phere honge, aankhein nam hongi... aur peeche se koi na koi poochega, “Khaana kab khulega?” 🥺🍲 Blessings ready rakhiye, appetite bhi!
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#9d174d', fontWeight: '600' }}>
                  <span>📍</span>
                  <span>Wedding venue</span>
                </div>
              </div>
            </div>

            {/* Zaroori Suchna, Ji! Pod */}
            <div
              style={{
                marginTop: '16px',
                padding: '12px 16px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(254, 243, 199, 0.4) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                boxShadow: 'inset 0 1.5px 2px rgba(255, 255, 255, 0.95), 0 4px 14px rgba(212, 175, 55, 0.08)',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                <span style={{ fontSize: '16px' }}>🍽️</span>
                <span style={{ fontSize: '11.5px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8c2d42' }}>
                  Zaroori Suchna, Ji!
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#683f49', margin: 0, lineHeight: '1.55' }}>
                Diet kal se. Aaj toh shaadi hai! Ek plate pyaar ke naam, doosri taste ke naam... aur teesri bas, “thoda sa aur le lete hain.” 😂
              </p>
            </div>
          </section>

          {/* 8. Venue & Map */}
          <section style={sectionCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '0 0 8px 0' }}>
              <MapPin size={20} color="#8c2d42" />
            </div>

            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#4a1525', margin: '0 0 6px 0', fontWeight: '600' }}>
              {venueName}
            </h2>
            <p style={{ fontSize: '12px', color: '#7a4e58', margin: '0 0 8px 0', lineHeight: '1.5' }}>
              {venueAddress}
            </p>
            <p style={{ fontSize: '11.5px', color: '#683f49', margin: '0 0 16px 0', fontStyle: 'italic' }}>
              Conveniently located along the main road in Rajgir. If you get turned around or need a hand, don’t hesitate to give us or the front desk a quick ring!
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
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 14px 28px -4px rgba(115, 35, 53, 0.45)'; }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 10px 24px -6px rgba(140, 45, 66, 0.4)'; }}
            >
              Open in Google Maps
            </a>
          </section>

          {/* 9. Dress Code */}
          <section style={{ ...sectionCardStyle, padding: '28px 18px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <Shirt size={20} color="#8c2d42" />
              <Sparkles size={16} color="#d4af37" />
            </div>
            <h2 style={cursiveHeaderStyle}>What to Wear</h2>
            <p style={{ fontSize: '10px', color: '#8c2d42', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: '700', margin: '2px 0 6px 0' }}>
              A Few Suggestions for Each Function
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 14px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>

            <p style={{ fontSize: '12px', color: '#683f49', fontStyle: 'italic', marginBottom: '18px', lineHeight: '1.5', margin: '0 0 18px 0' }}>
              “Most importantly: wear whatever makes you feel happy, comfortable, and ready to dance!” ✨
            </p>

            {/* Event-by-Event Liquid Glass Cards */}
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
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15.5px', color: '#614603', margin: 0, fontWeight: '700' }}>
                      Haldi Ceremony
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: '700',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
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
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ec4899' }} />
                    Pinks or Yellows
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#573d03', margin: 0, lineHeight: '1.55' }}>
                  Yellows, pastels, or soft pinks! Just pick something you wouldn’t mind getting a tiny bit of haldi on — turmeric is notorious for finding its way everywhere! 🌸
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
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15.5px', color: '#14452f', margin: 0, fontWeight: '700' }}>
                      Mehendi
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: '700',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
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
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2d6a4f' }} />
                    Shades of Green
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#1b4332', margin: 0, lineHeight: '1.55' }}>
                  Any shade of green you love! Outfits with easy-to-roll sleeves are always a smart choice while henna sets. 🍃
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
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15.5px', color: '#4a154b', margin: 0, fontWeight: '700' }}>
                      Sangeet Night
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: '700',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
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
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#9c27b0' }} />
                    Indo-Western &amp; Festive
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#4a154b', margin: 0, lineHeight: '1.55' }}>
                  Indo-Western, festive, or sparkly! Most importantly, pick something you can dance and move around in all evening. 💃
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
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15.5px', color: '#4a121e', margin: 0, fontWeight: '700' }}>
                      The Wedding Ceremony
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: '700',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
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
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#8c2d42' }} />
                    Traditional &amp; Royal
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#4a121e', margin: 0, lineHeight: '1.55' }}>
                  Saris, lehengas, sherwanis, or suits! Dress up as much as you’d like - just please save red for the bride! 👑
                </p>
              </div>
            </div>

            {/* Friendly Footwear Note Pod */}
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
              <span style={{ fontSize: '18px', flexShrink: 0 }}>👟</span>
              <p style={{ fontSize: '11.5px', color: '#683f49', margin: 0, lineHeight: '1.45' }}>
                <strong style={{ color: '#8c2d42' }}>Helpful Tip:</strong> Stashing a pair of comfortable flats in your bag is always a great decision for when the music kicks into high gear!
              </p>
            </div>
          </section>
          {/* 11. Transportation & Accommodation */}
          <section style={sectionCardStyle}>
            <Car size={20} color="#8c2d42" style={{ margin: '0 auto 4px auto' }} />
            <h2 style={cursiveHeaderStyle}>Travel &amp; Getting Here</h2>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 12px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>
            <p style={{ fontSize: '12.5px', color: '#683f49', margin: 0, lineHeight: '1.65' }}>
              Rajgir is well connected by road and rail. Local taxis, cabs, and auto-rickshaws are readily available from nearby railway stations and airports directly to the hotel. If you need any assistance with directions along the way, please don’t hesitate to reach out to us. Wishing you a very safe journey - we can’t wait to welcome you! 🚗
            </p>
          </section>

          <section style={sectionCardStyle}>
            <Building size={20} color="#8c2d42" style={{ margin: '0 auto 4px auto' }} />
            <h2 style={cursiveHeaderStyle}>Where You’ll Be Staying</h2>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 12px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>
            <p style={{ fontSize: '12.5px', color: '#683f49', margin: '0 0 8px 0', lineHeight: '1.65' }}>
              We want all of us under one roof like one big happy family! Rooms are reserved for our guests at <strong>Hotel Nalanda Regency</strong>. Check in, drop your bags, freshen up, and come join the party! 🏨
            </p>
            <p style={{ fontSize: '11px', color: '#8c2d42', margin: 0 }}>
              📍 Dangi Tola, Near Bus Stand, NH 82, Rajgir, Bihar - 803116
            </p>
          </section>

          {/* 12. RSVP Form (Direct to Google Sheets) */}
          <section style={{ ...sectionCardStyle, textAlign: 'left' }}>
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <Mail size={20} color="#8c2d42" style={{ margin: '0 auto 4px auto' }} />
              <h2 style={cursiveHeaderStyle}>Will You Be Joining Us?</h2>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
                <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
                <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
                <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              </div>
              <p style={{ fontSize: '11.5px', color: '#7a4e58', margin: '6px 0 0 0', fontStyle: 'italic' }}>
                Please let us know by November 25th so we can save you a cozy room and a plate of hot sweets 💕
              </p>
            </div>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '24px 12px' }}
              >
                <CheckCircle2 size={42} color="#8c2d42" style={{ margin: '0 auto 10px auto' }} />
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#4a1525', margin: '0 0 6px 0' }}>
                  Yay, Thank You!
                </h3>
                <p style={{ fontSize: '13px', color: '#7a4e58', margin: 0, lineHeight: '1.5' }}>
                  We got your note! Can’t wait to welcome you in Rajgir for a celebration we’ll all remember for years to come 💕
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleGoogleSheetsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* 1. Name */}
                <div>
                  <label style={{ fontSize: '12px', color: '#683f49', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span>Ji, Aapki Shubh Pehchaan? 😄</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Apna shubh naam likhein..."
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
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.2)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.95)'; e.currentTarget.style.boxShadow = 'inset 0 1.5px 2px rgba(255, 255, 255, 0.95), 0 2px 8px rgba(115, 35, 53, 0.04)'; }}
                  />
                </div>

                {/* 2. Attendance Selection */}
                <div>
                  <label style={{ fontSize: '12px', color: '#683f49', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span>Toh Janab, Baraat Mein Mil Rahe Hain Na? 💃</span>
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
                      cursor: 'pointer',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.2)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.95)'; e.currentTarget.style.boxShadow = 'inset 0 1.5px 2px rgba(255, 255, 255, 0.95), 0 2px 8px rgba(115, 35, 53, 0.04)'; }}
                  >
                    <option value="">Ek option select karein...</option>
                    <option value="Ji haan, zaroor aayenge! ❤️">Ji haan, zaroor aayenge! ❤️</option>
                    <option value="Bilkul! Dance floor hila denge! 🕺">Bilkul! Dance floor hila denge! 🕺</option>
                    <option value="Bhot mann tha par nhi aa paenge 🥺">Bhot mann tha par nhi aa paenge 🥺</option>
                    <option value="Abhi ghar pe permission leni hai 😂">Abhi ghar pe permission leni hai 😂</option>
                  </select>
                </div>

                {/* 3. A Note for the Couple */}
                <div>
                  <label style={{ fontSize: '12px', color: '#683f49', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span>Kuch Aashirwad, Kuch Raaz, Kuch Dance Requests? 💌</span>
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Advice, blessings, wishes ya koi special farmaish..."
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
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 14px 28px -4px rgba(115, 35, 53, 0.45)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 10px 26px -6px rgba(140, 45, 66, 0.45)'; }}
                >
                  {isSubmitting ? 'Sending...' : 'Send My RSVP 💌'}
                </button>
              </form>
            )}
          </section>

          {/* 13. Closing Card (Modern Liquid Glass & Witty) */}
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
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#856404',
                }}
              >
                Final Notice • Zero Excuses Allowed
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
                fontFamily: "'Playfair Display', serif",
                fontSize: '22px',
                color: '#4a121e',
                margin: '0 0 4px 0',
                fontWeight: '700',
              }}
            >
              Ready to Dance, Feast &amp; Celebrate?
            </h2>

            <p
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: '32px',
                color: '#8c2d42',
                margin: '0 0 12px 0',
                lineHeight: '1.2',
              }}
            >
              We can't wait to see you!
            </p>

            <p
              style={{
                fontSize: '12.5px',
                color: '#683f49',
                lineHeight: '1.65',
                margin: '0 auto 18px auto',
                maxWidth: '380px',
              }}
            >
              Pack your best energy and your roomiest dancing clothes! Bad dancing is not only welcomed, it is strictly mandatory. If anyone asks why you're taking a 4th plate of sweets, just tell them the bride &amp; groom personally insisted! 🍨
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
                }}
              >
                🍨 Unlimited Sweets
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
                }}
              >
                🥁 High-Decibel Dhol
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
                }}
              >
                💃 Zero Judgement Zone
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
            <p style={{ fontSize: '11.5px', color: '#7a4e58', margin: '0 0 4px 0', fontStyle: 'italic' }}>
              With lots of love, zero chill, &amp; sore dancing feet in advance,
            </p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#4a121e', margin: 0, fontWeight: '700' }}>
              Harsh &amp; Rutbi 💕
            </p>
          </section>

        </main>
      )}
    </div>
  );
}