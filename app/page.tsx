'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, MapPin, Sparkles, Clock, Compass } from 'lucide-react';
import HeartScratchCard from './components/HeartScratchCard';
import CountdownTimer from './components/CountdownTimer';

export default function WeddingInvitation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpeningAnimation, setIsOpeningAnimation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

    // Unmount envelope screen after 2.4s animation finishes
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

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#fdf8f9',
        color: '#4a1525',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <audio ref={audioRef} loop preload="auto" src="/audio/wedding-music.mp3" />

      {/* Audio Control Floating Button */}
      {isOpen && (
        <button
          onClick={toggleAudio}
          aria-label="Toggle Audio"
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 60,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '10px',
            borderRadius: '50%',
            border: '1px solid #e2b4be',
            color: '#8c2d42',
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
            boxShadow: '0 4px 12px rgba(140, 45, 66, 0.15)',
          }}
        >
          {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      )}

      {/* Royal Embossed 3D Envelope Intro */}
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
                background: 'radial-gradient(circle at 50% 40%, #b85d72 0%, #732a3a 60%, #3e111c 100%)',
                boxShadow: 'inset 0 0 100px rgba(0,0,0,0.6)',
                overflow: 'hidden',
              }}
            >
              {/* Embossed Floral Damask Texture Background */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.18,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c16.568 0 30 13.432 30 30 0 16.568-13.432 30-30 30C13.432 60 0 46.568 0 30 0 13.432 13.432 0 30 0zm0 6C16.745 6 6 16.745 6 30s10.745 24 24 24 24-10.745 24-24S43.255 6 30 6z' fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                  backgroundSize: '80px 80px',
                  pointerEvents: 'none',
                }}
              />

              {/* Inner Card Gliding Upwards */}
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
                  left: '7%',
                  right: '7%',
                  top: '18%',
                  bottom: '18%',
                  zIndex: 10,
                  borderRadius: '16px',
                  border: '1.5px solid #d4af37',
                  background: 'linear-gradient(180deg, #2a0812 0%, #120206 100%)',
                  padding: '36px 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 0 20px rgba(212,175,55,0.15)',
                }}
              >
                <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.3em', color: '#f3e5ab', margin: 0 }}>
                  ✦ You Are Invited ✦
                </p>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '40px', color: '#ffe082', margin: '18px 0 8px 0', fontWeight: '400', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                  Harsh &amp; Rutbi
                </h1>
                <div style={{ width: '50px', height: '1px', backgroundColor: '#d4af37', margin: '14px 0' }} />
                <p style={{ fontSize: '12px', letterSpacing: '0.2em', color: '#fecdd3', margin: 0, fontWeight: '500' }}>
                  DECEMBER 9, 2026
                </p>
              </motion.div>

              {/* Left/Right/Bottom Royal Pocket Envelope Wings */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 20,
                  pointerEvents: 'none',
                  background: 'linear-gradient(180deg, rgba(164,70,90,0.95) 0%, rgba(115,42,58,0.98) 100%)',
                  clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%, 50% 50%)',
                  filter: 'drop-shadow(0px -8px 16px rgba(0,0,0,0.4))',
                }}
              />

              {/* Pocket Inner Border Accents */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 21,
                  pointerEvents: 'none',
                  borderBottom: '3px solid rgba(212, 175, 55, 0.5)',
                  boxShadow: 'inset 0 -15px 30px rgba(0,0,0,0.3)',
                }}
              />

              {/* Top Flap Container with 3D Flip & Centered Seal */}
              <motion.div
                animate={{ rotateX: isOpeningAnimation ? 180 : 0 }}
                transition={{
                  duration: 1.0,
                  ease: [0.4, 0, 0.2, 1],
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '52%',
                  zIndex: 30,
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                  pointerEvents: 'none',
                  filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.45))',
                }}
              >
                {/* Front Side of Flap */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#a3485c',
                    clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                    borderBottom: '1.5px solid rgba(255, 215, 0, 0.6)',
                    backfaceVisibility: 'hidden',
                  }}
                />

                {/* Inner Lining Side of Flap (Visible on Flip) */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: '#4a1220',
                    clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                    transform: 'rotateX(180deg)',
                    backfaceVisibility: 'hidden',
                    borderBottom: '1.5px solid #d4af37',
                    boxShadow: 'inset 0 0 30px rgba(0,0,0,0.7)',
                  }}
                />

                {/* Royal Gold Wax Seal - Perfectly Centered via Framer Motion x/y */}
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
                    width: '86px',
                    height: '86px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 30%, #fff1b8 0%, #d4af37 50%, #7a580c 100%)',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -3px 6px rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      border: '1.5px solid #634605',
                      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none',
                      backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    }}
                  >
                    <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: '22px', color: '#2a1902', lineHeight: '1', fontWeight: 'bold' }}>
                      Tap
                    </span>
                    <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#3d2603', marginTop: '2px', fontWeight: '600' }}>
                      OPEN
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Elegant Bottom Label below Seal */}
              <motion.div
                animate={{
                  opacity: isOpeningAnimation ? 0 : 1,
                }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute',
                  bottom: '12%',
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  zIndex: 25,
                  pointerEvents: 'none',
                }}
              >
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '13px', letterSpacing: '0.25em', color: '#fecdd3', textTransform: 'uppercase', margin: 0, textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>
                  YOU ARE INVITED
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '6px' }}>
                  <div style={{ width: '24px', height: '1px', backgroundColor: '#d4af37' }} />
                  <span style={{ color: '#d4af37', fontSize: '10px' }}>♥</span>
                  <div style={{ width: '24px', height: '1px', backgroundColor: '#d4af37' }} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Invitation Content */}
      {isOpen && (
        <main style={{ maxWidth: '480px', margin: '0 auto', padding: '40px 20px 60px 20px' }}>
          {/* Header */}
          <section style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#a45a6a', margin: '0 0 12px 0' }}>
              We are honored to welcome you to the wedding ceremony of
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '44px', color: '#8c2d42', margin: '0 0 8px 0', fontWeight: '500' }}>
              Harsh &amp; Rutbi
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '16px 0' }}>
              <div style={{ height: '1px', width: '40px', backgroundColor: '#e2b4be' }} />
              <Sparkles size={14} color="#8c2d42" />
              <div style={{ height: '1px', width: '40px', backgroundColor: '#e2b4be' }} />
            </div>
          </section>

          {/* Interactive Scratch Card */}
          <section
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #f2d6dc',
              borderRadius: '20px',
              padding: '24px 16px',
              textAlign: 'center',
              marginBottom: '28px',
              boxShadow: '0 10px 25px rgba(164, 90, 106, 0.08)',
            }}
          >
            <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: '32px', color: '#8c2d42', margin: '0 0 12px 0', fontWeight: 'normal' }}>
              Our forever begins
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <HeartScratchCard dateText="DECEMBER 9, 2026" />
            </div>
          </section>

          {/* Countdown Card */}
          <section
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #f2d6dc',
              borderRadius: '20px',
              padding: '24px 16px',
              textAlign: 'center',
              marginBottom: '28px',
              boxShadow: '0 10px 25px rgba(164, 90, 106, 0.08)',
            }}
          >
            <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: '30px', color: '#8c2d42', margin: '0 0 16px 0', fontWeight: 'normal' }}>
              Counting Down To Forever
            </h2>
            <CountdownTimer targetDate="2026-12-09T10:00:00" />
          </section>

          {/* Program Timeline */}
          <section
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #f2d6dc',
              borderRadius: '20px',
              padding: '28px 20px',
              marginBottom: '28px',
              boxShadow: '0 10px 25px rgba(164, 90, 106, 0.08)',
            }}
          >
            <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: '32px', color: '#8c2d42', textAlign: 'center', margin: '0 0 20px 0', fontWeight: 'normal' }}>
              Program Timeline
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { title: 'Guest Arrival', time: '10:00 AM', desc: 'Warm welcome & refreshments' },
                { title: 'Wedding Ceremony', time: '11:30 AM', desc: 'Sacred vows & Pheras' },
                { title: 'Grand Reception', time: '07:30 PM', desc: 'Dinner, music & celebration' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    backgroundColor: '#fdf4f6',
                    border: '1px solid #f2d6dc',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '15px', color: '#4a1525', fontWeight: '600' }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: '#8c5060', marginTop: '2px' }}>{item.desc}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#8c2d42', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {item.time}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Venue Section */}
          <section
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #f2d6dc',
              borderRadius: '20px',
              padding: '28px 20px',
              textAlign: 'center',
              marginBottom: '28px',
              boxShadow: '0 10px 25px rgba(164, 90, 106, 0.08)',
            }}
          >
            <Compass size={24} color="#8c2d42" style={{ margin: '0 auto 8px auto' }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#8c2d42', margin: '0 0 6px 0', fontWeight: '600' }}>
              The Taj Mahal Palace
            </h2>
            <p style={{ fontSize: '13px', color: '#683241', margin: '0 0 18px 0', lineHeight: '1.5' }}>
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
                backgroundColor: '#8c2d42',
                color: '#ffffff',
                padding: '10px 24px',
                borderRadius: '24px',
                fontSize: '12px',
                fontWeight: '600',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                boxShadow: '0 4px 12px rgba(140, 45, 66, 0.25)',
              }}
            >
              <MapPin size={14} /> View on Google Maps
            </a>
          </section>

          {/* Footer */}
          <footer style={{ textAlign: 'center', marginTop: '36px' }}>
            <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: '28px', color: '#8c2d42', margin: 0 }}>
              We can't wait to celebrate with you!
            </p>
          </footer>
        </main>
      )}
    </div>
  );
}