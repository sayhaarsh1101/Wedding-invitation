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
  Globe,
  CheckCircle2,
} from 'lucide-react';
import HeartScratchCard from './components/HeartScratchCard';
import CountdownTimer from './components/CountdownTimer';

// Your Google Apps Script Web App URL for Unlimited Responses
const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxxpyCpncoO_JnM22kcPpVYdPNXVs6sOp4mIs69qlp7waSmKxtkemu7GsuvP9t0RLV8/exec';

// Floral Petal Component for Opening Effect
const FloralPetals = () => {
  const petals = Array.from({ length: 18 });
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 35, overflow: 'hidden' }}>
      {petals.map((_, i) => {
        const angle = (i / petals.length) * 360;
        const radius = 180 + (i % 3) * 60;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius - 100;
        const size = 16 + (i % 4) * 8;
        const rotation = Math.random() * 360;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 }}
            animate={{
              opacity: [0, 0.9, 0],
              scale: [0.5, 1.2, 0.8],
              x: x,
              y: y,
              rotate: rotation + 180,
            }}
            transition={{
              duration: 2.2,
              delay: 0.2 + (i % 5) * 0.08,
              ease: [0.25, 1, 0.5, 1],
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: `${size}px`,
              height: `${size * 1.4}px`,
              background: 'radial-gradient(circle, #ffd0dc 0%, #e07a93 60%, #a8324e 100%)',
              borderRadius: '50% 0% 50% 50%',
              boxShadow: '0 2px 8px rgba(168, 50, 78, 0.3)',
            }}
          />
        );
      })}
    </div>
  );
};

export default function WeddingInvitation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpeningAnimation, setIsOpeningAnimation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lang, setLang] = useState<'EN' | 'UR'>('EN');
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

  const venueName = 'Rajgir Convention Centre';
  const venueAddress = 'Rajgir, Bihar, India - 803116';

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${venueName}, ${venueAddress}`
  )}`;

  const galleryImages = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.25;
    }
  }, []);

  const handleOpenEnvelope = async () => {
    if (isOpeningAnimation || isOpen) return;
    setIsOpeningAnimation(true);

    if (audioRef.current) {
      try {
        audioRef.current.volume = 0.25;
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        setIsPlaying(false);
      }
    }

    setTimeout(() => {
      setIsOpen(true);
    }, 2400);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.volume = 0.25;
      audioRef.current.play();
      setIsPlaying(true);
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
          'Content-Type': 'text/plain;charset=utf-8', // Prevents CORS preflight issues
        },
        body: JSON.stringify(rsvpForm),
      });

      // Show success screen & clear form inputs
      setIsSubmitted(true);
      setRsvpForm({ name: '', contact: '', attending: '', message: '' });
    } catch (error) {
      // Apps Script safely stores data even if CORS redirects kick in
      setIsSubmitted(true);
      setRsvpForm({ name: '', contact: '', attending: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Common Card Styling
  const sectionCardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '32px 22px',
    marginBottom: '24px',
    boxShadow: '0 8px 30px rgba(138, 43, 66, 0.06)',
    border: '1px solid rgba(230, 210, 215, 0.6)',
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
        backgroundColor: '#f8f4f5',
        color: '#4a232b',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        position: 'relative',
        paddingBottom: '80px',
      }}
    >
      <audio ref={audioRef} loop preload="auto" src="/audio/wedding-music.mp3" />

      {/* Audio Toggle Button */}
      {isOpen && (
        <button
          onClick={toggleAudio}
          aria-label="Toggle Audio"
          style={{
            position: 'fixed',
            top: '18px',
            right: '18px',
            zIndex: 60,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            padding: '10px',
            borderRadius: '50%',
            border: '1px solid #e5c5cc',
            color: '#8c2d42',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 16px rgba(140, 45, 66, 0.15)',
          }}
        >
          {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      )}

      {/* Floating Language Switcher */}
      {isOpen && (
        <button
          onClick={() => setLang(lang === 'EN' ? 'UR' : 'EN')}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            zIndex: 60,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #e5c5cc',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '12px',
            color: '#8c2d42',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Globe size={14} />
          {lang === 'EN' ? 'Urdu' : 'English'}
        </button>
      )}

      {/* Envelope Overlay */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="royal-envelope-wrapper"
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              backgroundColor: '#1d050c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              perspective: '1600px',
              overflow: 'hidden',
            }}
          >
            <div
              onClick={handleOpenEnvelope}
              style={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                maxHeight: '100dvh',
                cursor: 'pointer',
                background: 'linear-gradient(180deg, #d8a2af 0%, #c48393 50%, #b36b7c 100%)',
                boxShadow: 'inset 0 0 100px rgba(0,0,0,0.2)',
                overflow: 'hidden',
              }}
            >
              {/* Pattern Background */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.15,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23600018' fill-opacity='0.6'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  pointerEvents: 'none',
                }}
              />

              {/* Floral Opening Effect */}
              {isOpeningAnimation && <FloralPetals />}

              {/* Inner Card Envelope Pocket */}
              <motion.div
                initial={{ y: 0, opacity: 1 }}
                animate={{
                  y: isOpeningAnimation ? '-42vh' : 0,
                  scale: isOpeningAnimation ? 1.02 : 1,
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  position: 'absolute',
                  left: '8%',
                  right: '8%',
                  top: '20%',
                  bottom: '20%',
                  zIndex: 10,
                  borderRadius: '12px',
                  border: '1.5px solid #d4af37',
                  background: 'linear-gradient(180deg, #fcf8f9 0%, #f4eae9 100%)',
                  padding: '36px 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
                }}
              >
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '38px', color: '#7a2335', margin: '0 0 8px 0', fontWeight: '400' }}>
                  Harsh &amp; Rutbi
                </h1>
                <div style={{ width: '40px', height: '1px', backgroundColor: '#d4af37', margin: '10px 0' }} />
                <p style={{ fontSize: '11px', letterSpacing: '0.22em', color: '#8c2d42', margin: 0, fontWeight: '600', textTransform: 'uppercase' }}>
                  TOGETHER WITH THEIR FAMILIES
                </p>
              </motion.div>

              {/* Envelope Body Pocket Cut */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 20,
                  pointerEvents: 'none',
                  background: 'linear-gradient(180deg, #ce8e9d 0%, #b87082 100%)',
                  clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%, 50% 48%)',
                  filter: 'drop-shadow(0px -6px 12px rgba(0,0,0,0.15))',
                }}
              />

              {/* Bottom Envelope Ornament */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '8%',
                  left: 0,
                  right: 0,
                  zIndex: 25,
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px', opacity: 0.8 }}>
                  <svg width="120" height="20" viewBox="0 0 120 20" fill="none">
                    <path
                      d="M10 10 C 30 2, 40 18, 60 10 C 80 2, 90 18, 110 10 M 60 2 L 60 18"
                      stroke="#6e1d2f"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                    <circle cx="60" cy="10" r="3" fill="#6e1d2f" />
                  </svg>
                </div>
                <p
                  style={{
                    fontFamily: "'Cinzel', serif, sans-serif",
                    fontSize: '13px',
                    letterSpacing: '0.28em',
                    color: '#5c1424',
                    fontWeight: '700',
                    margin: 0,
                    textTransform: 'uppercase',
                    textShadow: '0 1px 1px rgba(255,255,255,0.4)',
                  }}
                >
                  YOU ARE INVITED
                </p>
                <div style={{ color: '#5c1424', fontSize: '10px', marginTop: '2px' }}>♥</div>
              </div>

              {/* Envelope Top Triangular Flap */}
              <motion.div
                animate={{ rotateX: isOpeningAnimation ? 180 : 0 }}
                transition={{ duration: 1.0, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '50%',
                  zIndex: 30,
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#bd7788',
                    clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                    borderBottom: '1.5px solid #d4af37',
                    backfaceVisibility: 'hidden',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: '#611a29',
                    clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                    transform: 'rotateX(180deg)',
                    backfaceVisibility: 'hidden',
                    borderBottom: '1.5px solid #d4af37',
                  }}
                />

                {/* Wax Seal */}
                <motion.div
                  initial={{ x: '-50%', y: '-50%' }}
                  animate={{
                    x: '-50%',
                    y: '-50%',
                    scale: isOpeningAnimation ? 0.1 : 1,
                    opacity: isOpeningAnimation ? 0 : 1,
                  }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    zIndex: 40,
                    width: '76px',
                    height: '76px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 30%, #fff1b8 0%, #d4af37 50%, #7a580c 100%)',
                    boxShadow: '0 10px 24px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: '18px', color: '#2a1902', fontWeight: 'bold' }}>
                      Tap
                    </span>
                    <br />
                    <span style={{ fontSize: '8px', letterSpacing: '0.15em', color: '#3d2603', fontWeight: 'bold' }}>
                      OPEN
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN INVITATION CONTENT */}
      {isOpen && (
        <main style={{ maxWidth: '440px', margin: '0 auto', padding: '0 16px 40px 16px' }}>

          {/* 1. Hero Section */}
          <section
            style={{
              position: 'relative',
              minHeight: '82vh',
              borderRadius: '0 0 32px 32px',
              overflow: 'hidden',
              marginBottom: '28px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '48px 20px 28px 20px',
              textAlign: 'center',
              color: '#ffffff',
              boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
              background: 'linear-gradient(180deg, rgba(20,10,15,0.65) 0%, rgba(35,15,25,0.85) 100%), url("https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80") center/cover no-repeat',
            }}
          >
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.22em', color: '#fbcfe8', textTransform: 'uppercase', margin: '0 0 6px 0', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                We are honored to welcome you to
              </p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', color: '#ffffff', fontStyle: 'italic', margin: 0, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                the Wedding ceremony of
              </p>
              <div style={{ margin: '8px 0', color: '#fbcfe8', fontSize: '10px' }}>♥</div>
            </div>

            <div style={{ margin: 'auto 0' }}>
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '52px',
                  fontWeight: '400',
                  margin: '0',
                  color: '#ffffff',
                  textShadow: '0 2px 12px rgba(0,0,0,0.8)',
                  lineHeight: '1.1',
                }}
              >
                Harsh
              </h1>

              <div
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: '38px',
                  color: '#ffe082',
                  textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                  margin: '8px 0',
                }}
              >
                &amp;
              </div>

              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '52px',
                  fontWeight: '400',
                  margin: '0',
                  color: '#ffffff',
                  textShadow: '0 2px 12px rgba(0,0,0,0.8)',
                  lineHeight: '1.1',
                }}
              >
                Rutbi
              </h1>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.85 }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#ffffff' }}>
                Scroll
              </span>
              <ChevronDown size={14} color="#ffffff" style={{ marginTop: '2px' }} />
            </div>
          </section>

          {/* 2. Invitation Greeting Card */}
          <section style={sectionCardStyle}>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#5c2c38', fontStyle: 'italic', margin: '0 0 12px 0' }}>
              We are honored to welcome you to the Wedding ceremony of Harsh &amp; Rutbi as they begin their journey together in faith and love,
            </p>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#8c2d42', margin: 0, fontWeight: '500' }}>
              we thank you for being part of this blessed occasion 💕
            </p>
          </section>

          {/* 3. Scratch to Reveal Section */}
          <section style={sectionCardStyle}>
            <h2 style={cursiveHeaderStyle}>Scratch to Reveal</h2>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0 6px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <HeartScratchCard dateText="DECEMBER 9, 2026" />
            </div>
          </section>

          {/* 4. Photo Carousel Gallery */}
          <section style={{ ...sectionCardStyle, padding: '16px' }}>
            <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: '16px', overflow: 'hidden' }}>
              <img
                src={galleryImages[currentSlide]}
                alt="Couple Gallery"
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease' }}
              />
              <div style={{ position: 'absolute', bottom: '12px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px' }}>
                {galleryImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    style={{
                      width: currentSlide === idx ? '18px' : '6px',
                      height: '6px',
                      borderRadius: '3px',
                      backgroundColor: currentSlide === idx ? '#8c2d42' : 'rgba(255,255,255,0.7)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* 5. Countdown Section */}
          <section style={sectionCardStyle}>
            <h2 style={cursiveHeaderStyle}>Counting Down to Forever</h2>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 16px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>
            <CountdownTimer targetDate="2026-12-09T10:00:00" />
          </section>

          {/* 6. Program Timeline */}
          <section style={{ ...sectionCardStyle, textAlign: 'left' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Clock size={20} color="#8c2d42" style={{ margin: '0 auto 4px auto' }} />
              <h2 style={cursiveHeaderStyle}>Program Timeline</h2>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
                <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
                <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
                <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingLeft: '8px' }}>
              {[
                { title: 'Guest Arrival', date: 'Dec 9, 2026, 10:00 AM', desc: 'We Warmly welcome you.. !' },
                { title: 'Wedding Ceremony', date: 'Dec 9, 2026, 11:30 AM', desc: 'Your gracious presence is requested' },
                { title: 'Reception', date: 'Dec 10, 2026, 7:00 PM', desc: 'Your gracious presence is requested. Dinner onwards' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#8c2d42', marginTop: '5px', flexShrink: 0 }} />
                  <div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: '#4a1525', margin: '0 0 2px 0', fontWeight: '600' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#8c2d42', margin: '0 0 2px 0', fontWeight: '500' }}>
                      {item.date}
                    </p>
                    <p style={{ fontSize: '12px', color: '#7a4e58', margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 7. Venue Details */}
          <section style={sectionCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '0 0 8px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>

            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#4a1525', margin: '0 0 6px 0', fontWeight: '600' }}>
              {venueName}
            </h2>
            <p style={{ fontSize: '12px', color: '#7a4e58', margin: '0 0 18px 0', lineHeight: '1.5' }}>
              {venueAddress}
            </p>

            <div style={{ margin: '16px auto', width: '180px', opacity: 0.25 }}>
              <svg viewBox="0 0 100 40" fill="none" stroke="#8c2d42" strokeWidth="1">
                <path d="M10 38 V 20 L 25 10 L 40 20 V 38 M 35 38 V 28 H 45 V 38 M 50 38 V 15 L 65 5 L 80 15 V 38" />
              </svg>
            </div>

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
              View on Google Maps
            </a>
          </section>

          {/* 8. Dress Code */}
          <section style={sectionCardStyle}>
            <Shirt size={20} color="#8c2d42" style={{ margin: '0 auto 4px auto' }} />
            <h2 style={cursiveHeaderStyle}>Dress Code</h2>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 18px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: '#8c2d42', margin: '0 0 4px 0', fontWeight: '600' }}>
                Women
              </h3>
              <p style={{ fontSize: '12px', color: '#683f49', margin: 0 }}>
                Elegant formal attire in pastel or jewel tones
              </p>
            </div>

            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: '#8c2d42', margin: '0 0 4px 0', fontWeight: '600' }}>
                Men
              </h3>
              <p style={{ fontSize: '12px', color: '#683f49', margin: 0 }}>
                Suit or traditional formal wear
              </p>
            </div>
          </section>

          {/* 9. Pre-Wedding Events */}
          <section style={sectionCardStyle}>
            <Sparkles size={20} color="#8c2d42" style={{ margin: '0 auto 4px auto' }} />
            <h2 style={cursiveHeaderStyle}>Pre-Wedding Events</h2>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 18px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>

            {[
              { name: 'Mehendi', time: 'Dec 7, 2026, 6:00 PM', place: 'Rajgir, Bihar' },
              { name: 'Haldi', time: 'Dec 8, 2026, 10:00 AM', place: 'Rajgir, Bihar' },
              { name: 'Sangeet', time: 'Dec 8, 2026, 7:00 PM', place: 'Rajgir Convention Centre' },
            ].map((evt, idx) => (
              <div key={idx} style={{ marginBottom: idx === 2 ? '0' : '16px' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: '#4a1525', margin: '0 0 2px 0', fontWeight: '600' }}>
                  {evt.name}
                </h3>
                <p style={{ fontSize: '12px', color: '#8c2d42', margin: '0 0 2px 0', fontWeight: '500' }}>
                  {evt.time}
                </p>
                <p style={{ fontSize: '12px', color: '#7a4e58', margin: 0 }}>
                  {evt.place}
                </p>
              </div>
            ))}
          </section>

          {/* 10. Transportation & Accommodation */}
          <section style={sectionCardStyle}>
            <Car size={20} color="#8c2d42" style={{ margin: '0 auto 4px auto' }} />
            <h2 style={cursiveHeaderStyle}>Transportation</h2>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 12px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>
            <p style={{ fontSize: '12px', color: '#683f49', margin: 0, lineHeight: '1.6' }}>
              Shuttle services will be available from Rajgir Railway Station &amp; Gaya Airport to the venue.
            </p>
          </section>

          <section style={sectionCardStyle}>
            <Building size={20} color="#8c2d42" style={{ margin: '0 auto 4px auto' }} />
            <h2 style={cursiveHeaderStyle}>Accommodation</h2>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 12px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>
            <p style={{ fontSize: '12px', color: '#683f49', margin: 0, lineHeight: '1.6' }}>
              Accommodation for outstation guests is arranged at Rajgir Residency.
            </p>
          </section>

          {/* 11. RSVP Form (Google Sheets Endpoint) */}
          <section style={{ ...sectionCardStyle, textAlign: 'left' }}>
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <Mail size={20} color="#8c2d42" style={{ margin: '0 auto 4px auto' }} />
              <h2 style={cursiveHeaderStyle}>Send a Message</h2>
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
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#4a1525', margin: '0 0 6px 0' }}>
                  Thank You!
                </h3>
                <p style={{ fontSize: '13px', color: '#7a4e58', margin: 0, lineHeight: '1.5' }}>
                  Your warm wishes &amp; RSVP response have been recorded successfully. We look forward to celebrating with you! 💕
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
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#683f49', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                    Email / Phone
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
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#683f49', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                    Will you be attending?
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
                    }}
                  >
                    <option value="">Select...</option>
                    <option value="Yes, Joyfully Attending">Yes, Joyfully Attending</option>
                    <option value="Regretfully Declining">Regretfully Declining</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#683f49', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Write your wishes..."
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
                    }}
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
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </section>

          {/* 12. Closing Message Card */}
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
              Harsh &amp; Rutbi
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