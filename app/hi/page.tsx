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
          submittedAt: new Date().toISOString(),
          language: 'hi',
        }),
      });

      setIsSubmitted(true);
      setRsvpForm({ name: '', contact: '', attending: '', message: '' });
    } catch {
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reusable card styling matching English theme
  const sectionCardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '24px 20px',
    marginBottom: '20px',
    boxShadow: '0 8px 30px rgba(140, 45, 66, 0.08)',
    border: '1px solid #e8cdd4',
    textAlign: 'center' as const,
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
        background: 'linear-gradient(180deg, #2b040a 0%, #3d0711 15%, #f7eff1 45%, #fceef1 100%)',
        color: '#4a1525',
        fontFamily: "'Noto Serif Devanagari', 'Plus Jakarta Sans', sans-serif",
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

          {/* Luxury Main Arched Invitation Card */}
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
              padding: '26px 20px 24px 20px',
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

            {/* Monogram Crest */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                border: '1.5px solid #d4af37',
                margin: '0 auto 10px auto',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.25)',
              }}
            >
              <span
                style={{
                  fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif",
                  fontSize: '18px',
                  color: '#8c2d42',
                  fontWeight: '600',
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
            <div style={{ margin: '18px 0 16px 0' }}>
              <HeartScratchCard
                dateText="बुधवार, 09 दिसम्बर 2026"
                venueText="होटल नालंदा रीजेंसी, राजगीर"
                coupleName="हर्ष संग रुतबी"
                foilHeader="विवाह तिथि देखने के लिए स्क्रैच करें"
                foilSubtitle="✦ अपनी उंगली या माउस से स्क्रैच करें ✦"
                revealedPillText="✦ पावन विवाह तिथि ✦"
                celebrateNote="आपकी गरिमामयी उपस्थिति प्रार्थनीय है 💕"
                revealedStatusText="शुभ तिथि प्रकट! 🎉"
                swipeToScratchText="स्क्रैच करें"
              />
            </div>

            {/* Venue Location Text */}
            <div
              style={{
                backgroundColor: 'rgba(255, 245, 247, 0.85)',
                border: '1px solid #f0d5db',
                borderRadius: '16px',
                padding: '16px',
                margin: '18px 0 12px 0',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', margin: '0 0 4px 0' }}>
                <MapPin size={18} color="#8c2d42" />
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
              <p style={{ fontSize: '11.5px', color: '#7a4e58', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                {venueAddress}
              </p>
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#732335',
                  color: '#ffffff',
                  padding: '8px 18px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(115, 35, 53, 0.15)',
                }}
              >
                गूगल मैप्स पर देखें ➔
              </a>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '14px' }}>
              <ChevronDown size={22} color="#8c2d42" className="animate-bounce" />
            </div>
          </motion.section>

          {/* 3. Shloka & Mangal Card */}
          <section style={sectionCardStyle}>
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
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(4px)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  zIndex: 10,
                }}
              >
                <ChevronLeft size={18} color="#732335" />
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
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(4px)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  zIndex: 10,
                }}
              >
                <ChevronRight size={18} color="#732335" />
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

            {/* Event-by-Event Natural Cards (Hindi) */}
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
                    <h3 style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '16px', color: '#614603', margin: 0, fontWeight: '500' }}>
                      हल्दी उत्सव
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      backgroundColor: '#fff3cd',
                      color: '#856404',
                      padding: '3px 9px',
                      borderRadius: '12px',
                      border: '1px solid #ffeeba',
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
                    <h3 style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '16px', color: '#14452f', margin: 0, fontWeight: '500' }}>
                      मेहंदी की रस्म
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      backgroundColor: '#d8f3dc',
                      color: '#1b4332',
                      padding: '3px 9px',
                      borderRadius: '12px',
                      border: '1px solid #b7e4c7',
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
                    <h3 style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '16px', color: '#4a154b', margin: 0, fontWeight: '500' }}>
                      संगीत संध्या
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      backgroundColor: '#f3e5f5',
                      color: '#6a1b9a',
                      padding: '3px 9px',
                      borderRadius: '12px',
                      border: '1px solid #e1bee7',
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
              <p style={{ fontSize: '11px', color: '#683f49', margin: 0, lineHeight: '1.4', fontFamily: "'Noto Serif Devanagari', serif" }}>
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
                    <h3 style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '16px', color: '#614603', margin: 0, fontWeight: '500' }}>
                      अतिथि आगमन एवं स्वागत
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      backgroundColor: '#fff3cd',
                      color: '#856404',
                      padding: '3px 9px',
                      borderRadius: '12px',
                      border: '1px solid #ffeeba',
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
                    <h3 style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '16px', color: '#4a121e', margin: 0, fontWeight: '500' }}>
                      शुभ विवाह संस्कार (वरमाला व फेरे)
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      backgroundColor: '#fce4ec',
                      color: '#8c2d42',
                      padding: '3px 9px',
                      borderRadius: '12px',
                      border: '1px solid #f8bbd0',
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

            {/* Celebrations Pro-Tip */}
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
                display: 'inline-block',
                backgroundColor: '#732335',
                color: '#ffffff',
                padding: '10px 24px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(115, 35, 53, 0.2)',
              }}
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

            {/* Event-by-Event Natural Cards (Hindi) */}
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
                    <h3 style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '16px', color: '#614603', margin: 0, fontWeight: '500' }}>
                      हल्दी उत्सव
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      backgroundColor: '#fff3cd',
                      color: '#856404',
                      padding: '3px 9px',
                      borderRadius: '12px',
                      border: '1px solid #ffeeba',
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
                  पीला, हल्का गुलाबी या पेस्टल रंग! बस ऐसे कपड़े चुनें जिन पर थोड़ी हल्दी लग भी जाए तो कोई फिक्र न हो। 🌸
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
                    <h3 style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '16px', color: '#14452f', margin: 0, fontWeight: '500' }}>
                      मेहंदी
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      backgroundColor: '#d8f3dc',
                      color: '#1b4332',
                      padding: '3px 9px',
                      borderRadius: '12px',
                      border: '1px solid #b7e4c7',
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
                    <h3 style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '16px', color: '#4a154b', margin: 0, fontWeight: '500' }}>
                      संगीत संध्या
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      backgroundColor: '#f3e5f5',
                      color: '#6a1b9a',
                      padding: '3px 9px',
                      borderRadius: '12px',
                      border: '1px solid #e1bee7',
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
                    <h3 style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '16px', color: '#4a121e', margin: 0, fontWeight: '500' }}>
                      शुभ विवाह (वेडिंग)
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      backgroundColor: '#fce4ec',
                      color: '#8c2d42',
                      padding: '3px 9px',
                      borderRadius: '12px',
                      border: '1px solid #f8bbd0',
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

            {/* Helpful Footwear Tip */}
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
              <form onSubmit={handleGoogleSheetsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', color: '#683f49', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                    आपका शुभ नाम *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="पूरा नाम दर्ज करें"
                    value={rsvpForm.name}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e0c8ce',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: '#fffcfd',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11.5px', color: '#683f49', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                    संपर्क सूत्र / मोबाइल नंबर *
                  </label>
                  <input
                    type="text"
                    name="contact"
                    required
                    placeholder="मोबाइल नंबर"
                    value={rsvpForm.contact}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, contact: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e0c8ce',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: '#fffcfd',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11.5px', color: '#683f49', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                    क्या आप सम्मिलित हो रहे हैं? *
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
                      backgroundColor: '#fffcfd',
                      color: '#4a1525',
                    }}
                  >
                    <option value="">विकल्प चुनें</option>
                    <option value="हाँ! आपके साथ जश्न मनाने का मौका कैसे छोड़ सकते हैं">हाँ! आपके साथ जश्न मनाने का मौका कैसे छोड़ सकते हैं 🎉</option>
                    <option value="मन से साथ हैं (किसी कारणवश नहीं आ सकेंगे)">मन से साथ हैं (किसी कारणवश नहीं आ सकेंगे)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11.5px', color: '#683f49', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                    हर्ष और रुतबी के लिए संदेश
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="अपनी शुभकामनाएं, सलाह या कोई खास बात लिखें..."
                    value={rsvpForm.message}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e0c8ce',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: '#fffcfd',
                      resize: 'none',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: '#8c2d42',
                    color: '#ffffff',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 15px rgba(140, 45, 66, 0.25)',
                    marginTop: '6px',
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? 'संदेश भेजा जा रहा है...' : 'अपनी उपस्थिति दर्ज करें 💌'}
                </button>
              </form>
            )}
          </section>

          {/* 13. Blessing Closing Plaque */}
          <section style={{ ...sectionCardStyle, backgroundColor: '#8c2d42', color: '#ffffff', border: 'none' }}>
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
