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
  const [rsvpForm, setRsvpForm] = useState({
    name: '',
    contact: '',
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
        body: JSON.stringify(rsvpForm),
      });

      setIsSubmitted(true);
      setRsvpForm({ name: '', contact: '', attending: '', message: '' });
    } catch (error) {
      setIsSubmitted(true);
      setRsvpForm({ name: '', contact: '', attending: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Luxury Card Styles
  const sectionCardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '32px 22px',
    marginBottom: '24px',
    boxShadow: '0 10px 32px rgba(138, 43, 66, 0.07)',
    border: '1px solid rgba(230, 210, 215, 0.7)',
    textAlign: 'center',
    color: '#4a232b',
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
        backgroundColor: '#fbf4f6',
        color: '#4a232b',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        position: 'relative',
        paddingBottom: '80px',
      }}
    >
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
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            padding: '12px',
            borderRadius: '50%',
            border: '1px solid #e5c5cc',
            color: '#8c2d42',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 6px 20px rgba(140, 45, 66, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
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

          {/* Luxury Main Arched Invitation Card (Directly inspired by reference video) */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              position: 'relative',
              borderRadius: '28px',
              backgroundColor: '#ffffff',
              border: '1.5px solid #e6c5cd',
              boxShadow: '0 16px 40px rgba(138, 43, 66, 0.12)',
              padding: '24px 20px 24px 20px',
              marginBottom: '24px',
              textAlign: 'center',
              overflow: 'hidden',
              background: 'linear-gradient(180deg, #ffffff 0%, #fffbfb 60%, #faedf0 100%)',
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
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  border: '1.5px solid #d4af37',
                  backgroundColor: '#fffdf9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)',
                  marginBottom: '10px',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#8c2d42',
                  }}
                >
                  H &amp; R
                </span>
              </div>

              <p
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.28em',
                  color: '#8c2d42',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  margin: 0,
                }}
              >
                Royal Wedding Invitation
              </p>

              <div style={{ width: '40px', height: '1px', backgroundColor: '#d4af37', margin: '10px auto' }} />

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
                }}
              >
                Harsh &amp; Rutbi
              </h1>

              {/* Interactive Gold Foil Date Reveal */}
              <div style={{ width: '100%', margin: '14px 0 16px 0', display: 'flex', justifyContent: 'center' }}>
                <HeartScratchCard
                  dateText="WEDNESDAY, DEC 09, 2026"
                  venueText="Hotel Nalanda Regency, Rajgir"
                />
              </div>

              {/* Venue Subtitle */}
              <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#8c2d42', fontWeight: '700', margin: '8px 0 4px 0' }}>
                To Be Held At
              </p>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', color: '#4a1525', margin: '0 0 4px 0', fontWeight: '600' }}>
                {venueName}
              </h3>
              <p style={{ fontSize: '11px', color: '#7a4e58', margin: '0 0 16px 0' }}>
                {venueAddress}
              </p>
            </div>

            {/* Palace Garden Architectural Illustration */}
            <div style={{ width: '100%', opacity: 0.45, marginTop: '8px' }}>
              <svg viewBox="0 0 240 50" fill="none" stroke="#8c2d42" strokeWidth="1" style={{ width: '100%', height: '40px' }}>
                <path d="M10 45 V 25 L 35 12 L 60 25 V 45 M 50 45 V 32 H 70 V 45 M 85 45 V 18 L 120 5 L 155 18 V 45 M 105 45 V 28 H 135 V 45 M 180 45 V 25 L 205 12 L 230 25 V 45" />
                <circle cx="120" cy="5" r="3" fill="#8c2d42" />
              </svg>
            </div>

            {/* Scroll Indicator */}
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.7 }}>
              <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#8c2d42' }}>
                Scroll for Itinerary
              </span>
              <ChevronDown size={14} color="#8c2d42" className="animate-bounce mt-1" />
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
          <section style={{ ...sectionCardStyle, background: 'linear-gradient(135deg, #fffdfb 0%, #fef7f0 50%, #fdf2f4 100%)', borderBottom: '2px solid rgba(212, 175, 55, 0.3)' }}>
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
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(6px)',
                  border: '1.5px solid rgba(212, 175, 55, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(140, 45, 66, 0.25)',
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
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(6px)',
                  border: '1.5px solid rgba(212, 175, 55, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(140, 45, 66, 0.25)',
                  zIndex: 10,
                  transition: 'all 0.2s ease',
                }}
              >
                <ChevronRight size={18} color="#8c2d42" />
              </button>

              {/* Slide Counter Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.55)',
                  backdropFilter: 'blur(6px)',
                  borderRadius: '12px',
                  padding: '3px 9px',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: '600',
                  letterSpacing: '0.1em',
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

            <p style={{ fontSize: '12px', color: '#683f49', fontStyle: 'italic', marginBottom: '18px', lineHeight: '1.5', margin: '0 0 18px 0' }}>
              “All our pre-wedding celebrations in one lively day of events!” ✨
            </p>

            {/* Event-by-Event Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
              {/* Haldi */}
              <div
                style={{
                  backgroundColor: '#fffdf2',
                  border: '1.5px solid #f6e39b',
                  borderRadius: '16px',
                  padding: '14px 14px',
                  boxShadow: '0 4px 14px rgba(212, 175, 55, 0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>💛</span>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', color: '#614603', margin: 0, fontWeight: '700' }}>
                      Haldi Ceremony
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: '700',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      backgroundColor: '#fff3cd',
                      color: '#856404',
                      padding: '3px 9px',
                      borderRadius: '12px',
                      border: '1px solid #ffeeba',
                    }}
                  >
                    Dec 8 • 9:00 AM Onwards
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#573d03', margin: '0 0 4px 0', lineHeight: '1.55' }}>
                  Kicking off the morning with turmeric, bright sunshine, family blessings, and lots of laughter. 🍋
                </p>
                <p style={{ fontSize: '10.5px', color: '#856404', margin: 0, fontWeight: '600' }}>
                  📍 Hotel Nalanda Regency, Rajgir
                </p>
              </div>

              {/* Mehendi */}
              <div
                style={{
                  backgroundColor: '#f3faf5',
                  border: '1.5px solid #b7e4c7',
                  borderRadius: '16px',
                  padding: '14px 14px',
                  boxShadow: '0 4px 14px rgba(46, 125, 50, 0.06)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>🌿</span>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', color: '#14452f', margin: 0, fontWeight: '700' }}>
                      Mehendi Celebrations
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: '700',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      backgroundColor: '#d8f3dc',
                      color: '#1b4332',
                      padding: '3px 9px',
                      borderRadius: '12px',
                      border: '1px solid #b7e4c7',
                    }}
                  >
                    Dec 8 • 1:00 PM Onwards
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#1b4332', margin: '0 0 4px 0', lineHeight: '1.55' }}>
                  Intricate henna art, favorite songs, and lunch while the designs dry. 🍃
                </p>
                <p style={{ fontSize: '10.5px', color: '#2d6a4f', margin: 0, fontWeight: '600' }}>
                  📍 Hotel Nalanda Regency, Rajgir
                </p>
              </div>

              {/* Sangeet */}
              <div
                style={{
                  backgroundColor: '#fdf6fa',
                  border: '1.5px solid #e9c2e0',
                  borderRadius: '16px',
                  padding: '14px 14px',
                  boxShadow: '0 4px 14px rgba(106, 27, 154, 0.06)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>🪩</span>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', color: '#4a154b', margin: 0, fontWeight: '700' }}>
                      Sangeet Night
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: '700',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      backgroundColor: '#f3e5f5',
                      color: '#6a1b9a',
                      padding: '3px 9px',
                      borderRadius: '12px',
                      border: '1px solid #e1bee7',
                    }}
                  >
                    Dec 8 • 7:00 PM Onwards
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#4a154b', margin: '0 0 4px 0', lineHeight: '1.55' }}>
                  Dinner, drinks, performances, and everyone out together on the dance floor! 💃
                </p>
                <p style={{ fontSize: '10.5px', color: '#6a1b9a', margin: 0, fontWeight: '600' }}>
                  📍 Hotel Nalanda Regency, Rajgir
                </p>
              </div>
            </div>

            {/* Note */}
            <div
              style={{
                marginTop: '16px',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                border: '1px dashed #d4af37',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '16px', flexShrink: 0 }}>🎉</span>
              <p style={{ fontSize: '11px', color: '#683f49', margin: 0, lineHeight: '1.4' }}>
                A full day of celebrations — come ready for good food, great music, and lots of fun!
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
              “The big day is here! Your presence and warm hugs mean the world to us.” ✨
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
              {/* Guest Arrival */}
              <div
                style={{
                  backgroundColor: '#fffdf5',
                  border: '1.5px solid #f6e39b',
                  borderRadius: '16px',
                  padding: '14px 14px',
                  boxShadow: '0 4px 14px rgba(212, 175, 55, 0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>🧳</span>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', color: '#614603', margin: 0, fontWeight: '700' }}>
                      Guest Arrival &amp; Welcome
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: '700',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      backgroundColor: '#fff3cd',
                      color: '#856404',
                      padding: '3px 9px',
                      borderRadius: '12px',
                      border: '1px solid #ffeeba',
                    }}
                  >
                    Dec 9 • 10:00 AM
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#573d03', margin: 0, lineHeight: '1.55' }}>
                  Check in, grab a piping hot cup of masala chai or a cold drink, and relax. Our families will be right in the lobby waiting to hug and welcome you! ☕
                </p>
              </div>

              {/* Wedding Ceremony */}
              <div
                style={{
                  backgroundColor: '#fcf3f5',
                  border: '1.5px solid #e8b3be',
                  borderRadius: '16px',
                  padding: '14px 14px',
                  boxShadow: '0 4px 14px rgba(140, 45, 66, 0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>💍</span>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', color: '#4a121e', margin: 0, fontWeight: '700' }}>
                      The Wedding Ceremony
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: '700',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      backgroundColor: '#fce4ec',
                      color: '#8c2d42',
                      padding: '3px 9px',
                      borderRadius: '12px',
                      border: '1px solid #f8bbd0',
                    }}
                  >
                    Dec 9 • 11:30 AM Onwards
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#4a121e', margin: 0, lineHeight: '1.55' }}>
                  The varmala, holy vows, and sacred pheras! Bring your blessings, cheer as loud as you can, and make sure you’re hungry for a grand lunch feast right after! 🌸
                </p>
              </div>
            </div>

            {/* Celebrations Note */}
            <div
              style={{
                marginTop: '16px',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                border: '1px dashed #d4af37',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '16px', flexShrink: 0 }}>🍽️</span>
              <p style={{ fontSize: '11px', color: '#683f49', margin: 0, lineHeight: '1.4' }}>
                <strong style={{ color: '#8c2d42' }}>A friendly heads-up:</strong> Leave all diets at home - the wedding feast is prepared with lots of love and zero calorie limits!
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
                display: 'inline-block',
                backgroundColor: '#732335',
                color: '#ffffff',
                padding: '10px 24px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(115, 35, 53, 0.2)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(115, 35, 53, 0.35)'; }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(115, 35, 53, 0.2)'; }}
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

            {/* Event-by-Event Natural Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
              {/* Haldi */}
              <div
                style={{
                  backgroundColor: '#fffdf2',
                  border: '1.5px solid #f6e39b',
                  borderRadius: '16px',
                  padding: '14px 14px',
                  boxShadow: '0 4px 14px rgba(212, 175, 55, 0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>💛</span>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', color: '#614603', margin: 0, fontWeight: '700' }}>
                      Haldi Ceremony
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: '700',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      backgroundColor: '#fff3cd',
                      color: '#856404',
                      padding: '3px 9px',
                      borderRadius: '12px',
                      border: '1px solid #ffeeba',
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
                  Yellows, pastels, or soft pinks! Just pick something you wouldn’t mind getting a tiny bit of haldi on  turmeric is notorious for finding its way everywhere! 🌸
                </p>
              </div>

              {/* Mehendi */}
              <div
                style={{
                  backgroundColor: '#f3faf5',
                  border: '1.5px solid #b7e4c7',
                  borderRadius: '16px',
                  padding: '14px 14px',
                  boxShadow: '0 4px 14px rgba(46, 125, 50, 0.06)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>🌿</span>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', color: '#14452f', margin: 0, fontWeight: '700' }}>
                      Mehendi
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: '700',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      backgroundColor: '#d8f3dc',
                      color: '#1b4332',
                      padding: '3px 9px',
                      borderRadius: '12px',
                      border: '1px solid #b7e4c7',
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

              {/* Sangeet */}
              <div
                style={{
                  backgroundColor: '#fdf6fa',
                  border: '1.5px solid #e9c2e0',
                  borderRadius: '16px',
                  padding: '14px 14px',
                  boxShadow: '0 4px 14px rgba(106, 27, 154, 0.06)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>🪩</span>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', color: '#4a154b', margin: 0, fontWeight: '700' }}>
                      Sangeet Night
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: '700',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      backgroundColor: '#f3e5f5',
                      color: '#6a1b9a',
                      padding: '3px 9px',
                      borderRadius: '12px',
                      border: '1px solid #e1bee7',
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

              {/* The Wedding */}
              <div
                style={{
                  backgroundColor: '#fcf3f5',
                  border: '1.5px solid #e8b3be',
                  borderRadius: '16px',
                  padding: '14px 14px',
                  boxShadow: '0 4px 14px rgba(140, 45, 66, 0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>👑</span>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', color: '#4a121e', margin: 0, fontWeight: '700' }}>
                      The Wedding Ceremony
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: '700',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      backgroundColor: '#fce4ec',
                      color: '#8c2d42',
                      padding: '3px 9px',
                      borderRadius: '12px',
                      border: '1px solid #f8bbd0',
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

            {/* Friendly Footwear Note */}
            <div
              style={{
                marginTop: '16px',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                border: '1px dashed #d4af37',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '16px', flexShrink: 0 }}>👟</span>
              <p style={{ fontSize: '11px', color: '#683f49', margin: 0, lineHeight: '1.4' }}>
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
              <form onSubmit={handleGoogleSheetsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#683f49', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your full name"
                    value={rsvpForm.name}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e0c8ce',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: '#faf6f7',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.15)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#e0c8ce'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#683f49', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                    Email / Phone Number
                  </label>
                  <input
                    type="text"
                    name="contact"
                    required
                    placeholder="you@example.com / +91..."
                    value={rsvpForm.contact}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, contact: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e0c8ce',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: '#faf6f7',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.15)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#e0c8ce'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#683f49', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                    Will you be able to attend?
                  </label>
                  <select
                    name="attending"
                    required
                    value={rsvpForm.attending}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, attending: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e0c8ce',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: '#faf6f7',
                      color: '#555',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.15)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#e0c8ce'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <option value="">Choose an option...</option>
                    <option value="Yes! Wouldn't miss it for the world">Yes! Wouldn’t miss it for the world 🎉</option>
                    <option value="Celebrating in spirit (Can't make it)">Celebrating in spirit (Can’t make it)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#683f49', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                    A Note for Harsh &amp; Rutbi
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Leave a wish, advice, or dance request..."
                    value={rsvpForm.message}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e0c8ce',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: '#faf6f7',
                      resize: 'none',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.15)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#e0c8ce'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: isSubmitting ? '#9c6270' : '#732335',
                    color: '#ffffff',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    textAlign: 'center',
                    marginTop: '6px',
                    boxShadow: '0 4px 12px rgba(115, 35, 53, 0.2)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(115, 35, 53, 0.35)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(115, 35, 53, 0.2)'; }}
                >
                  {isSubmitting ? 'Sending...' : 'Send My RSVP 💌'}
                </button>
              </form>
            )}
          </section>

          {/* 13. Closing Card */}
          <section style={{ ...sectionCardStyle, padding: '36px 20px' }}>
            <div style={{ opacity: 0.3, marginBottom: '10px' }}>
              <svg width="100%" height="16" viewBox="0 0 300 16" fill="none" stroke="#8c2d42" strokeWidth="1">
                <path d="M0 8 Q 75 0, 150 8 T 300 8" />
              </svg>
            </div>

            <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: '32px', color: '#8c2d42', margin: '0 0 10px 0' }}>
              We can't wait to celebrate with you!
            </p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#5a2532', margin: 0 }}>
              With lots of love, Harsh &amp; Rutbi 💕
            </p>

            <div style={{ opacity: 0.3, marginTop: '14px' }}>
              <svg width="100%" height="16" viewBox="0 0 300 16" fill="none" stroke="#8c2d42" strokeWidth="1">
                <path d="M0 8 Q 75 16, 150 8 T 300 8" />
              </svg>
            </div>
          </section>

        </main>
      )}
    </div>
  );
}