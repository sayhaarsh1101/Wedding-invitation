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

  const venueName = 'होटल नालंदा रीजेंसी';
  const venueAddress = 'डांगी टोला, बस स्टैंड के समीप, एन.एच. 82, राजगीर, बिहार - 803116';

  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Hotel Nalanda Regency, Dangi Tola, Near Bus Stand, NH 82, Rajgir, Bihar - 803116'
  )}`;

  const galleryImages = [
    {
      src: '/images/gallery-4.png',
      title: 'राजसी परिणय',
      desc: 'हर्ष एवं रुतबी',
    },
    {
      src: '/images/gallery-3.jpg',
      title: 'सदा के लिए हमसफ़र',
      desc: 'प्रेम और विश्वास का पावन बंधन',
    },
    {
      src: '/images/gallery-2.jpg',
      title: 'कदम से कदम',
      desc: 'जीवन की हर डगर साथ-साथ',
    },
    {
      src: '/images/gallery-1.jpg',
      title: 'खुशियों के पल',
      desc: 'मधुर मुस्कान और उत्सव',
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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }, []);

  const handleStartOpen = async () => {
    if (audioRef.current) {
      try {
        audioRef.current.volume = 0.3;
        await audioRef.current.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }
  };

  const handleOpenComplete = () => {
    setIsOpen(true);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.volume = 0.3;
      audioRef.current.play();
      setIsPlaying(true);
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
      <audio ref={audioRef} loop preload="auto" src="/audio/wedding-music.mp3" />

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
                autoRevealText="तुरंत देखें ✨"
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
            <p style={{ fontSize: '12px', color: '#683f49', margin: 0, lineHeight: '1.6' }}>
              स्नेहिल परिणय सूत्र के इस पावन उत्सव में आपकी उपस्थिति हमारे लिए अत्यंत सौभाग्य और आनंद का विषय होगी 💕
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
              बुधवार • प्रातः 11:30 बजे
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
            <CountdownTimer targetDate="2026-12-09T11:30:00" />
          </section>

          {/* 6. Photo Carousel Gallery */}
          <section style={{ ...sectionCardStyle, padding: '24px 18px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Camera size={20} color="#8c2d42" style={{ margin: '0 auto 4px auto' }} />
              <h2 style={headerStyle}>स्नेहिल स्मृतियां</h2>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 10px 0' }}>
                <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
                <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
                <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              </div>
              <p style={{ fontSize: '11.5px', color: '#7a4e58', margin: 0 }}>
                हमारे सुंदर सफर की कुछ खास झलकियां
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

          {/* 7. Program Timeline (मांगलिक कार्यक्रम) */}
          <section style={{ ...sectionCardStyle, textAlign: 'left' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Clock size={20} color="#8c2d42" style={{ margin: '0 auto 4px auto' }} />
              <h2 style={headerStyle}>मांगलिक कार्यक्रम</h2>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
                <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
                <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
                <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingLeft: '8px' }}>
              {[
                {
                  title: 'अतिथि आगमन एवं स्वागत',
                  date: '09 दिसम्बर 2026 • प्रातः 10:00 बजे',
                  desc: 'सादर पधारे सभी अतिथियों का भावभीना स्वागत एवं अल्पाहार',
                },
                {
                  title: 'शुभ विवाह संस्कार / पाणिग्रहण',
                  date: '09 दिसम्बर 2026 • प्रातः 11:30 बजे',
                  desc: 'वैदिक मंत्रोच्चार के बीच पावन वर-माला एवं फेरे',
                },
                {
                  title: 'स्वागत समारोह एवं प्रीतिभोज',
                  date: '10 दिसम्बर 2026 • सायं 7:00 बजे onwards',
                  desc: 'संगीत, आनंद एवं भव्य रात्रिभोज',
                },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#8c2d42', marginTop: '5px', flexShrink: 0 }} />
                  <div>
                    <h3 style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '17px', color: '#4a1525', margin: '0 0 2px 0', fontWeight: '500' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#8c2d42', margin: '0 0 2px 0', fontWeight: '600' }}>
                      {item.date}
                    </p>
                    <p style={{ fontSize: '12px', color: '#7a4e58', margin: 0, lineHeight: '1.5' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
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
            <p style={{ fontSize: '12px', color: '#7a4e58', margin: '0 0 18px 0', lineHeight: '1.5' }}>
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
                padding: '10px 24px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(115, 35, 53, 0.2)',
              }}
            >
              गूगल मैप्स पर देखें ➔
            </a>
          </section>

          {/* 9. Dress Code */}
          <section style={sectionCardStyle}>
            <Shirt size={20} color="#8c2d42" style={{ margin: '0 auto 4px auto' }} />
            <h2 style={headerStyle}>परिधान संहिता</h2>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 18px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '17px', color: '#8c2d42', margin: '0 0 4px 0', fontWeight: '500' }}>
                महिलाओं के लिए
              </h3>
              <p style={{ fontSize: '12px', color: '#683f49', margin: 0 }}>
                पारंपरिक भारतीय साड़ी, लहंगा या उत्सव परिधान
              </p>
            </div>

            <div>
              <h3 style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '17px', color: '#8c2d42', margin: '0 0 4px 0', fontWeight: '500' }}>
                पुरुषों के लिए
              </h3>
              <p style={{ fontSize: '12px', color: '#683f49', margin: 0 }}>
                कुर्ता-पायजामा, शेरवानी या फॉर्मल परिधान
              </p>
            </div>
          </section>

          {/* 10. Pre-Wedding Events (वैवाहिक पूर्व कार्यक्रम) */}
          <section style={sectionCardStyle}>
            <Sparkles size={20} color="#8c2d42" style={{ margin: '0 auto 4px auto' }} />
            <h2 style={headerStyle}>वैवाहिक पूर्व उत्सव</h2>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 18px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>

            {[
              { name: 'मेहंदी की रस्म', time: '07 दिसम्बर 2026 • सायं 6:00 बजे', place: 'होटल नालंदा रीजेंसी, राजगीर' },
              { name: 'हल्दी उत्सव', time: '08 दिसम्बर 2026 • प्रातः 10:00 बजे', place: 'होटल नालंदा रीजेंसी, राजगीर' },
              { name: 'संगीत संध्या', time: '08 दिसम्बर 2026 • सायं 7:00 बजे', place: 'होटल नालंदा रीजेंसी, राजगीर' },
            ].map((evt, idx) => (
              <div key={idx} style={{ marginBottom: idx === 2 ? '0' : '16px' }}>
                <h3 style={{ fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif", fontSize: '17px', color: '#4a1525', margin: '0 0 2px 0', fontWeight: '500' }}>
                  {evt.name}
                </h3>
                <p style={{ fontSize: '12px', color: '#8c2d42', margin: '0 0 2px 0', fontWeight: '600' }}>
                  {evt.time}
                </p>
                <p style={{ fontSize: '12px', color: '#7a4e58', margin: 0 }}>
                  {evt.place}
                </p>
              </div>
            ))}
          </section>

          {/* 11. Transportation & Accommodation */}
          <section style={sectionCardStyle}>
            <Car size={20} color="#8c2d42" style={{ margin: '0 auto 4px auto' }} />
            <h2 style={headerStyle}>परिवहन व्यवस्था</h2>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 12px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>
            <p style={{ fontSize: '12px', color: '#683f49', margin: 0, lineHeight: '1.6' }}>
              राजगीर रेलवे स्टेशन एवं गया एयरपोर्ट से विवाह स्थल तक विशेष वाहन सुविधा उपलब्ध रहेगी।
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
            <p style={{ fontSize: '12px', color: '#683f49', margin: '0 0 6px 0', lineHeight: '1.6' }}>
              हमारे सभी सम्मानीय अतिथियों के ठहरने की उत्तम व्यवस्था <strong>होटल नालंदा रीजेंसी</strong>, राजगीर में की गई है।
            </p>
            <p style={{ fontSize: '11.5px', color: '#8c2d42', margin: 0 }}>
              डांगी टोला, बस स्टैंड के समीप, एन.एच. 82, राजगीर, बिहार - 803116
            </p>
          </section>

          {/* 12. RSVP Form (Direct to Google Sheets) */}
          <section style={{ ...sectionCardStyle, textAlign: 'left' }}>
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <Mail size={20} color="#8c2d42" style={{ margin: '0 auto 4px auto' }} />
              <h2 style={headerStyle}>शुभकामनाएं एवं उपस्थिति</h2>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
                <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
                <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
                <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              </div>
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
                <p style={{ fontSize: '13px', color: '#7a4e58', margin: 0, lineHeight: '1.5' }}>
                  आपका स्नेह संदेश एवं उत्तर सफलतापूर्वक दर्ज हो गया है। हम आपके आगमन की प्रतीक्षा में हैं! 💕
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
                    <option value="हाँ, सपरिवार अवश्य सम्मिलित होंगे">हाँ, सपरिवार अवश्य सम्मिलित होंगे</option>
                    <option value="शायद / विचार कर रहे हैं">शायद / विचार कर रहे हैं</option>
                    <option value="क्षमा करें, सम्मिलित नहीं हो सकेंगे">क्षमा करें, सम्मिलित नहीं हो सकेंगे</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11.5px', color: '#683f49', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                    वर-वधू के लिए मंगल संदेश
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="अपनी मंगलकामनाएं लिखें..."
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
                  {isSubmitting ? 'संदेश भेजा जा रहा है...' : 'संदेश भेजें 💌'}
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
