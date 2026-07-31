'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, MapPin, Sparkles, Heart, Calendar, Clock, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';
import HeartScratchCard from './components/HeartScratchCard';
import CountdownTimer from './components/CountdownTimer';

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotate: number;
}

export default function WeddingInvitation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpeningAnimation, setIsOpeningAnimation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [petals, setPetals] = useState<Petal[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const generatedPetals: Petal[] = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 6,
      size: 8 + Math.random() * 12,
      rotate: Math.random() * 360,
    }));
    setPetals(generatedPetals);
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#ff4d6d', '#ffe082', '#a81c24'],
    });
  };

  const handleOpenEnvelope = async () => {
    if (isOpeningAnimation || isOpen) return;

    setIsOpeningAnimation(true);
    triggerConfetti();

    if (audioRef.current) {
      try {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Audio autoplay prevented:', err);
        }
        setIsPlaying(false);
      }
    }

    setTimeout(() => {
      setIsOpen(true);
    }, 1300);
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
    <div style={{ minHeight: '100vh', backgroundColor: '#2b040a', color: '#fff8f0', position: 'relative', fontFamily: 'sans-serif', overflowX: 'hidden' }}>
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
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.6)'
          }}
          aria-label="Toggle Audio"
        >
          {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      )}

      {/* 1. ANIMATED ENVELOPE GATEWAY OVERLAY */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
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
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#140104',
              padding: '0 12px',
              boxSizing: 'border-box',
              overflow: 'hidden'
            }}
          >
            {/* FLOATING ROSE PETALS ANIMATION */}
            {petals.map((petal) => (
              <motion.div
                key={petal.id}
                initial={{ y: '-10vh', x: `${petal.x}vw`, rotate: 0, opacity: 0 }}
                animate={{
                  y: '110vh',
                  x: [`${petal.x}vw`, `${petal.x + 10}vw`, `${petal.x - 5}vw`],
                  rotate: [0, 180, 360],
                  opacity: [0, 0.7, 0.7, 0]
                }}
                transition={{
                  duration: petal.duration,
                  repeat: Infinity,
                  delay: petal.delay,
                  ease: 'linear'
                }}
                style={{
                  position: 'absolute',
                  width: `${petal.size}px`,
                  height: `${petal.size * 1.3}px`,
                  backgroundColor: '#d4af37',
                  borderRadius: '50% 0 50% 50%',
                  opacity: 0.6,
                  filter: 'blur(1px)',
                  pointerEvents: 'none',
                  zIndex: 1
                }}
              />
            ))}

            {/* Glowing Ambient Backdrop Behind Envelope */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                width: '400px',
                height: '400px',
                borderRadius: '9999px',
                background: 'radial-gradient(circle, rgba(212,175,55,0.4) 0%, rgba(212,175,55,0) 70%)',
                pointerEvents: 'none',
                zIndex: 2
              }}
            />

            {/* Tap Instruction Header */}
            <motion.p
              animate={{ opacity: isOpeningAnimation ? 0 : [0.5, 1, 0.5], y: isOpeningAnimation ? -10 : 0 }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              style={{
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: '#ffe082',
                zIndex: 10
              }}
            >
              <Sparkles size={14} /> Tap Seal To Open Invitation <Sparkles size={14} />
            </motion.p>

            {/* FULL SCREEN COVERAGE 3D ENVELOPE */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10
              }}
            >
              <div
                onClick={handleOpenEnvelope}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '62vh', /* Fills full height of modern phones nicely like the reference video */
                  minHeight: '420px',
                  maxHeight: '560px',
                  cursor: 'pointer',
                  perspective: '1200px'
                }}
              >
                {/* Back Shell of Envelope */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '24px',
                    backgroundColor: '#3a080f',
                    border: '1.5px solid rgba(212, 175, 55, 0.6)',
                    boxShadow: '0 30px 70px rgba(0, 0, 0, 0.95), inset 0 0 25px rgba(212, 175, 55, 0.2)'
                  }}
                />

                {/* Inside Invitation Card */}
                <motion.div
                  initial={{ y: 0, scale: 1 }}
                  animate={{
                    y: isOpeningAnimation ? -200 : 0,
                    scale: isOpeningAnimation ? 1.05 : 1
                  }}
                  transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
                  style={{
                    position: 'absolute',
                    left: '16px',
                    right: '16px',
                    top: '20px',
                    bottom: '20px',
                    zIndex: 10,
                    borderRadius: '16px',
                    border: '1.5px solid #d4af37',
                    backgroundColor: '#2b040a',
                    padding: '24px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.8)'
                  }}
                >
                  <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#d4af37', fontWeight: 600 }}>
                    Shubh Vivah
                  </span>
                  <h2 style={{ margin: '14px 0 8px 0', fontSize: '36px', fontWeight: 'bold', color: '#ffe082', fontFamily: 'serif', letterSpacing: '0.02em' }}>
                    Harsh &amp; Rutbi
                  </h2>
                  <p style={{ margin: 0, fontSize: '13px', color: '#fecdd3', letterSpacing: '0.2em', fontWeight: 500 }}>
                    DECEMBER 9, 2026
                  </p>
                </motion.div>

                {/* Envelope Lower Pocket Layer */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 20,
                    pointerEvents: 'none',
                    borderRadius: '24px',
                    backgroundColor: '#32060c',
                    clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%, 50% 50%)',
                    borderBottom: '2px solid #d4af37',
                    boxShadow: 'inset 0 15px 35px rgba(0,0,0,0.85)'
                  }}
                />

                {/* Top Flap */}
                <motion.div
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: isOpeningAnimation ? 180 : 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    zIndex: 30,
                    transformOrigin: 'top center',
                    pointerEvents: 'none'
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderTopLeftRadius: '24px',
                      borderTopRightRadius: '24px',
                      backgroundColor: '#440a12',
                      borderTop: '1.5px solid #d4af37',
                      clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)'
                    }}
                  />
                </motion.div>

                {/* PERFECTLY CENTERED ROYAL WAX SEAL */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '0',
                    right: '0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 40,
                    pointerEvents: 'none'
                  }}
                >
                  <motion.div
                    animate={{
                      scale: isOpeningAnimation ? [1, 1.25, 0] : 1,
                      opacity: isOpeningAnimation ? 0 : 1
                    }}
                    transition={{ duration: 0.4 }}
                    style={{
                      width: '72px',
                      height: '72px',
                      marginTop: '-36px',
                      borderRadius: '9999px',
                      backgroundColor: '#d4af37',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 30px rgba(212, 175, 55, 0.8), 0 10px 30px rgba(0,0,0,0.9)',
                      border: '2px solid #fff8f0',
                      position: 'relative'
                    }}
                  >
                    {/* Concentric Pulse Ring 1 */}
                    {!isOpeningAnimation && (
                      <motion.div
                        animate={{ scale: [1, 1.6], opacity: [0.8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
                        style={{
                          position: 'absolute',
                          inset: '-4px',
                          borderRadius: '9999px',
                          border: '2px solid #d4af37',
                          pointerEvents: 'none'
                        }}
                      />
                    )}

                    {/* Concentric Pulse Ring 2 */}
                    {!isOpeningAnimation && (
                      <motion.div
                        animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.8, delay: 0.4, ease: 'easeOut' }}
                        style={{
                          position: 'absolute',
                          inset: '-4px',
                          borderRadius: '9999px',
                          border: '1.5px solid #ffe082',
                          pointerEvents: 'none'
                        }}
                      />
                    )}

                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '9999px',
                        backgroundColor: '#a81c24',
                        border: '1px solid #8B0000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffe082'
                      }}
                    >
                      <Heart size={28} fill="#ffe082" />
                    </div>
                  </motion.div>
                </div>
              </div>
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