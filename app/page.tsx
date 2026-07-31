'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, MapPin, Sparkles, Heart, Calendar, Clock, Compass } from 'lucide-react';
import HeartScratchCard from './components/HeartScratchCard';
import CountdownTimer from './components/CountdownTimer';

export default function WeddingInvitation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleOpenEnvelope = async () => {
    setIsOpen(true);
    if (audioRef.current) {
      try {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
      } catch (err: any) {
        // Suppress browser autoplay abort warnings cleanly
        if (err.name !== 'AbortError') {
          console.warn('Audio autoplay prevented:', err);
        }
        setIsPlaying(false);
      }
    }
  };

  const toggleAudio = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Playback error:', err);
        }
        setIsPlaying(false);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#2b040a', color: '#fff8f0', position: 'relative', fontFamily: 'sans-serif' }}>
      {/* Background Audio */}
      <audio 
        ref={audioRef} 
        loop 
        preload="auto"
        src="audio/wedding-music.mp3"
      />

      {/* Floating Audio Controls */}
      {isOpen && (
        <button
          onClick={toggleAudio}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 40,
            backgroundColor: '#3a080f',
            padding: '12px',
            borderRadius: '9999px',
            border: '1px solid #d4af37',
            color: '#d4af37',
            cursor: 'pointer',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
          }}
          aria-label="Toggle Audio"
        >
          {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      )}

      {/* 1. ENVELOPE / GATEWAY OVERLAY (Centered Modal) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(26, 2, 6, 0.95)',
              padding: '16px'
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: '#3a080f',
                borderRadius: '16px',
                padding: '32px 24px',
                border: '2px solid #d4af37',
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: '420px',
                boxSizing: 'border-box'
              }}
            >
              {/* Header Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d4af37' }}>
                <Sparkles size={16} />
                <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
                  Shubh Vivah
                </span>
                <Sparkles size={16} />
              </div>

              {/* Central Details */}
              <div style={{ marginTop: '24px', marginBottom: '24px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    margin: '0 auto 16px auto',
                    borderRadius: '9999px',
                    backgroundColor: '#2b040a',
                    border: '1px solid #d4af37',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#d4af37'
                  }}
                >
                  <Heart size={28} fill="#d4af37" />
                </div>
                <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#d4af37', marginBottom: '8px' }}>
                  Wedding Invitation
                </p>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffe082', margin: '0 0 8px 0', fontFamily: 'serif' }}>
                  Harsh &amp; Rutbi
                </h1>
                <p style={{ fontSize: '12px', color: '#fecdd3', letterSpacing: '0.1em', margin: 0 }}>
                  DECEMBER 9, 2026
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={handleOpenEnvelope}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  backgroundColor: '#d4af37',
                  color: '#2b040a',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                }}
              >
                Unfold Invitation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN CONTENT AREA */}
      <main
        style={{
          maxWidth: '768px',
          margin: '0 auto',
          padding: '48px 16px',
          display: isOpen ? 'block' : 'none'
        }}
      >
        {/* Header Hero Section */}
        <section style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              color: '#d4af37',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: '16px'
            }}
          >
            <Sparkles size={14} />
            <span>Blessings &amp; Joy</span>
          </div>

          <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#fecdd3', margin: '0 0 8px 0' }}>
            Together with their families
          </p>

          <h1 style={{ fontSize: '48px', fontFamily: 'serif', fontWeight: 'bold', color: '#ffe082', margin: '0 0 16px 0' }}>
            Harsh &amp; Rutbi
          </h1>

          <p style={{ fontSize: '14px', color: '#fef3c7', fontFamily: 'serif', fontStyle: 'italic', maxWidth: '500px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
            "Request the honor of your presence as we step into our forever and begin a new chapter of love, laughter, and togetherness."
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#d4af37' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> Dec 9, 2026</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> Mumbai, India</span>
          </div>
        </section>

        {/* Scratch Card Section */}
        <section
          style={{
            backgroundColor: 'rgba(43, 4, 10, 0.85)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '20px',
            padding: '24px',
            textAlign: 'center',
            marginBottom: '32px'
          }}
        >
          <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#d4af37', margin: '0 0 4px 0' }}>Interactive Reveal</p>
          <h2 style={{ fontSize: '24px', fontFamily: 'serif', color: '#fef3c7', margin: '0 0 16px 0' }}>Scratch To Reveal The Date</h2>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <HeartScratchCard dateText="December 9, 2026" />
          </div>
        </section>

        {/* Countdown Timer */}
        <section
          style={{
            backgroundColor: 'rgba(43, 4, 10, 0.85)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '20px',
            padding: '24px',
            textAlign: 'center',
            marginBottom: '32px'
          }}
        >
          <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#d4af37', margin: '0 0 16px 0' }}>Counting Down To Forever</p>
          <CountdownTimer targetDate="2026-12-09T10:00:00" />
        </section>

        {/* Schedule */}
        <section
          style={{
            backgroundColor: 'rgba(43, 4, 10, 0.85)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '32px'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#d4af37', margin: '0 0 4px 0' }}>The Ceremonies</p>
            <h2 style={{ fontSize: '24px', fontFamily: 'serif', color: '#ffe082', margin: 0 }}>Event Schedule</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#fef3c7', fontFamily: 'serif' }}>Baraat Welcome</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'rgba(254, 205, 211, 0.7)' }}>Arrival of groom &amp; procession</p>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#d4af37', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '6px 12px', borderRadius: '9999px', border: '1px solid rgba(212, 175, 55, 0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> 10:00 AM
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#fef3c7', fontFamily: 'serif' }}>Pheras Ceremony</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'rgba(254, 205, 211, 0.7)' }}>Sacred wedding vows</p>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#d4af37', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '6px 12px', borderRadius: '9999px', border: '1px solid rgba(212, 175, 55, 0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> 11:30 AM
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#fef3c7', fontFamily: 'serif' }}>Grand Reception</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'rgba(254, 205, 211, 0.7)' }}>Feast, music, and celebration</p>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#d4af37', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '6px 12px', borderRadius: '9999px', border: '1px solid rgba(212, 175, 55, 0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> 07:30 PM
              </span>
            </div>
          </div>
        </section>

        {/* Venue Section */}
        <section
          style={{
            backgroundColor: 'rgba(43, 4, 10, 0.85)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '20px',
            padding: '24px',
            textAlign: 'center',
            marginBottom: '32px'
          }}
        >
          <div style={{ width: '40px', height: '40px', margin: '0 auto 12px auto', borderRadius: '9999px', backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37' }}>
            <Compass size={20} />
          </div>
          <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#d4af37', margin: '0 0 4px 0' }}>Location</p>
          <h2 style={{ fontSize: '24px', fontFamily: 'serif', color: '#ffe082', margin: '0 0 8px 0' }}>The Taj Mahal Palace</h2>
          <p style={{ fontSize: '12px', color: 'rgba(254, 205, 211, 0.8)', maxWidth: '300px', margin: '0 auto 16px auto' }}>
            Apollo Bunder, Colaba, Mumbai, Maharashtra 400001
          </p>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#d4af37',
              color: '#2b040a',
              fontWeight: 'bold',
              padding: '10px 24px',
              borderRadius: '9999px',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              textDecoration: 'none'
            }}
          >
            <MapPin size={14} />
            <span>Open In Maps</span>
          </a>
        </section>

        {/* Footer */}
        <footer style={{ textAlign: 'center', paddingTop: '24px' }}>
          <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#d4af37', margin: '0 0 4px 0' }}>With love &amp; blessings</p>
          <p style={{ fontSize: '24px', fontFamily: 'serif', fontStyle: 'italic', color: '#ffe4e6', margin: 0 }}>Harsh &amp; Rutbi</p>
        </footer>
      </main>
    </div>
  );
}