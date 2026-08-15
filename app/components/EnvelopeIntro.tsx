'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnvelopeIntroProps {
  onStartOpen?: () => void;
  onOpen: () => void;
}

/* ─── Floating Rose Petals ────────────────────────────────────────── */
const FloatingPetals = () => {
  const petals = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const angle = (i / 24) * 360;
      const radius = 150 + (i % 4) * 50;
      return {
        id: i,
        x: Math.cos((angle * Math.PI) / 180) * radius,
        y: Math.sin((angle * Math.PI) / 180) * radius - 50,
        size: 10 + (i % 4) * 5,
        rotation: (i * 41) % 360,
        delay: (i % 6) * 0.06,
      };
    });
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 70, overflow: 'hidden' }}>
      {petals.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 }}
          animate={{
            opacity: [0, 0.9, 0],
            scale: [0.3, 1.15, 0.6],
            x: p.x,
            y: p.y,
            rotate: p.rotation + 220,
          }}
          transition={{
            duration: 2.2,
            delay: 0.15 + p.delay,
            ease: [0.25, 1, 0.5, 1],
          }}
          style={{
            position: 'absolute',
            top: '46%',
            left: '50%',
            width: `${p.size}px`,
            height: `${p.size * 1.35}px`,
            background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #fce4ec 35%, #f48fb1 70%, #d81b60 100%)',
            borderRadius: '50% 0% 50% 50%',
            boxShadow: '0 3px 10px rgba(216, 27, 96, 0.3)',
          }}
        />
      ))}
    </div>
  );
};

/* ─── Satin Ribbon Bow ────────────────────────────────────────────── */
const SatinBow = ({ isOpened }: { isOpened: boolean }) => (
  <motion.div
    initial={{ scale: 1, opacity: 1 }}
    animate={{
      scale: isOpened ? 1.25 : 1,
      opacity: isOpened ? 0 : 1,
      filter: isOpened ? 'blur(8px)' : 'blur(0px)',
    }}
    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    style={{
      position: 'relative',
      width: '140px',
      height: '90px',
      pointerEvents: 'none',
    }}
  >
    <svg
      viewBox="0 0 140 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: '100%',
        height: '100%',
        filter: 'drop-shadow(0px 5px 12px rgba(160, 90, 110, 0.45))',
      }}
    >
      <defs>
        <linearGradient id="bowSilk" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff0f4" />
          <stop offset="30%" stopColor="#f8bbd0" />
          <stop offset="65%" stopColor="#ec829e" />
          <stop offset="100%" stopColor="#d46180" />
        </linearGradient>
        <linearGradient id="bowFold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c25272" />
          <stop offset="100%" stopColor="#8e2040" />
        </linearGradient>
        <radialGradient id="bowKnot" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fff5f8" />
          <stop offset="45%" stopColor="#f48fb1" />
          <stop offset="100%" stopColor="#ad3559" />
        </radialGradient>
      </defs>
      <path d="M58 50 C48 68, 30 78, 16 86 C28 78, 34 70, 33 64 C32 58, 44 52, 60 49 Z" fill="url(#bowSilk)" stroke="#e490a6" strokeWidth="0.6" />
      <path d="M82 50 C92 68, 110 78, 124 86 C112 78, 106 70, 107 64 C108 58, 96 52, 80 49 Z" fill="url(#bowSilk)" stroke="#e490a6" strokeWidth="0.6" />
      <path d="M66 45 C38 23, 10 31, 20 45 C26 56, 54 51, 70 47 Z" fill="url(#bowSilk)" stroke="#ffffff" strokeWidth="0.9" />
      <path d="M34 41 C38 34, 50 38, 64 45 C50 47, 39 45, 34 41 Z" fill="url(#bowFold)" opacity="0.35" />
      <path d="M74 45 C102 23, 130 31, 120 45 C114 56, 86 51, 70 47 Z" fill="url(#bowSilk)" stroke="#ffffff" strokeWidth="0.9" />
      <path d="M106 41 C102 34, 90 38, 76 45 C90 47, 101 45, 106 41 Z" fill="url(#bowFold)" opacity="0.35" />
      <ellipse cx="70" cy="46" rx="11" ry="9" fill="url(#bowKnot)" stroke="#ffffff" strokeWidth="0.9" />
    </svg>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════════ */
/*  MAIN: Luxury Wedding Envelope Intro                              */
/* ═══════════════════════════════════════════════════════════════════ */
export default function EnvelopeIntro({ onStartOpen, onOpen }: EnvelopeIntroProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = () => {
    if (isOpened) return;
    setIsOpened(true);
    if (onStartOpen) {
      onStartOpen();
    }
    setTimeout(() => onOpen(), 2200);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="luxury-envelope-intro-scene"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        onClick={handleOpen}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: 'pointer',
          background: 'linear-gradient(180deg, #faf0f2 0%, #f4dfe4 40%, #edd1d8 75%, #e4bec7 100%)',
          padding: '12px',
        }}
      >
        {/* Soft background lace texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20V9H0V7h20V5H0V3h20V0h2v3h20v2H22v2h20v2H22v2h20v3H22v2h20v2H22v2.5h20v2H22v2h20v2H22v2h20v3H22v2h20v2H22v2h20v3h-2v-3H0v-2h20v-2H0v-2h20v-2H0v-3h20v-2H0v-2h20v-2H0v-2.5h20z' fill='%239e3f5b' fill-opacity='0.6' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            pointerEvents: 'none',
          }}
        />

        {isOpened && <FloatingPetals />}

        {/* ── Main Envelope Wrapper (Fully responsive across all screens) ── */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '410px',
            maxHeight: '94vh',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '385 / 560',
              maxHeight: 'min(78vh, 580px)',
              perspective: '1200px',
            }}
          >
            {/* ══ 1. ENVELOPE BACKPLATE (Base & Interior Palace Garden) ══ */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 2,
                borderRadius: '22px',
                overflow: 'hidden',
                background: 'linear-gradient(180deg, #f5d4dc 0%, #ecc1cc 50%, #e0abb8 100%)',
                boxShadow: '0 16px 50px rgba(140, 60, 85, 0.22)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.35,
                }}
              >
                <img
                  src="/images/palace-garden.jpg"
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center bottom',
                    filter: 'saturate(0.8) brightness(1.05)',
                  }}
                />
              </div>
            </div>

            {/* ══ 2. INVITATION CARD (Tucked inside envelope, glides UP on click) ══ */}
            <motion.div
              initial={{ y: 24, scale: 0.95 }}
              animate={{
                y: isOpened ? -60 : 24,
                scale: isOpened ? 1 : 0.95,
              }}
              transition={{
                delay: 0.2,
                duration: 1.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                position: 'absolute',
                left: '10px',
                right: '10px',
                top: '12px',
                bottom: '16px',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: '20px',
                padding: '14px 14px 16px',
                overflow: 'hidden',
                background: 'linear-gradient(180deg, #ffffff 0%, #fffbfc 50%, #faf0f3 100%)',
                border: '1px solid rgba(228, 185, 196, 0.6)',
                boxShadow: '0 12px 36px rgba(150, 60, 85, 0.16)',
              }}
            >
              {/* Palace Garden Artwork Wash */}
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

              {/* Floral Arch Framing the Card Top */}
              <div
                style={{
                  width: '100%',
                  height: '105px',
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

              {/* Monogram Crest */}
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  border: '1.5px solid #d4af37',
                  backgroundColor: '#fffdf9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 3px 10px rgba(212, 175, 55, 0.22)',
                  marginBottom: '6px',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#8c2d42',
                  }}
                >
                  H & R
                </span>
              </div>

              <p
                style={{
                  fontSize: '8px',
                  letterSpacing: '0.28em',
                  color: '#8c2d42',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  margin: '0 0 3px 0',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                Royal Wedding Invitation
              </p>

              <div style={{ width: '28px', height: '1px', backgroundColor: '#d4af37', margin: '2px 0 6px 0', position: 'relative', zIndex: 2 }} />

              <p
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.05em',
                  color: '#632533',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  margin: '0 0 2px 0',
                  lineHeight: '1.4',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                We request the pleasure of your company<br />to celebrate the wedding of
              </p>

              {/* Couple Names */}
              <h2
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: '36px',
                  color: '#7a2335',
                  margin: '2px 0 6px 0',
                  fontWeight: 'normal',
                  lineHeight: '1.1',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                Harsh & Rutbi
              </h2>

              {/* Date Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  borderTop: '1px solid #edd2d8',
                  borderBottom: '1px solid #edd2d8',
                  padding: '6px 0',
                  width: '90%',
                  margin: '2px 0 4px',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '0.12em', color: '#8c2d42', display: 'block' }}>
                    DECEMBER
                  </span>
                  <span style={{ fontSize: '7px', color: '#7a4e58', letterSpacing: '0.06em' }}>
                    WEDNESDAY
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '26px',
                    fontWeight: '700',
                    color: '#7a2335',
                    lineHeight: '1',
                  }}
                >
                  09
                </span>
                <div style={{ textAlign: 'left' }}>
                  <span style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '0.12em', color: '#8c2d42', display: 'block' }}>
                    2026
                  </span>
                  <span style={{ fontSize: '7px', color: '#7a4e58', letterSpacing: '0.06em' }}>
                    11:30 AM
                  </span>
                </div>
              </div>

              {/* Venue */}
              <p style={{ fontSize: '7px', letterSpacing: '0.15em', color: '#8c2d42', fontWeight: '700', textTransform: 'uppercase', margin: '3px 0 1px 0', position: 'relative', zIndex: 2 }}>
                To Be Held At
              </p>
              <p
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: '18px',
                  color: '#4a1525',
                  margin: '0 0 1px 0',
                  fontWeight: 'normal',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                Rajgir Convention Centre
              </p>
              <p style={{ fontSize: '8px', color: '#7a4e58', margin: 0, position: 'relative', zIndex: 2 }}>
                Rajgir, Bihar, India
              </p>
            </motion.div>

            {/* ══ 3. ENVELOPE FRONT FOLD OVERLAY ══ */}
            <motion.div
              initial={{ y: 0, opacity: 1 }}
              animate={{
                y: isOpened ? 100 : 0,
                opacity: isOpened ? 0 : 1,
              }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 20,
                pointerEvents: 'none',
                borderRadius: '22px',
                overflow: 'hidden',
              }}
            >
              <svg
                viewBox="0 0 385 560"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  inset: 0,
                }}
              >
                <defs>
                  <linearGradient id="topFlap" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#fadbe3" />
                    <stop offset="100%" stopColor="#eeb6c4" />
                  </linearGradient>
                  <linearGradient id="bottomFlap" x1="50%" y1="100%" x2="50%" y2="0%">
                    <stop offset="0%" stopColor="#e4a8b8" />
                    <stop offset="60%" stopColor="#eeb8c6" />
                    <stop offset="100%" stopColor="#f5cdd7" />
                  </linearGradient>
                  <linearGradient id="leftFlap" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#e8b2bf" />
                    <stop offset="100%" stopColor="#f2c8d3" />
                  </linearGradient>
                  <linearGradient id="rightFlap" x1="100%" y1="50%" x2="0%" y2="50%">
                    <stop offset="0%" stopColor="#e8b2bf" />
                    <stop offset="100%" stopColor="#f2c8d3" />
                  </linearGradient>
                  <filter id="foldShadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#8c2d42" floodOpacity="0.18" />
                  </filter>
                </defs>

                {/* Left Triangular Flap */}
                <path d="M 0 0 L 192.5 280 L 0 560 Z" fill="url(#leftFlap)" opacity="0.95" />

                {/* Right Triangular Flap */}
                <path d="M 385 0 L 192.5 280 L 385 560 Z" fill="url(#rightFlap)" opacity="0.95" />

                {/* Bottom Triangular Pocket Flap */}
                <path d="M 0 560 L 192.5 280 L 385 560 Z" fill="url(#bottomFlap)" filter="url(#foldShadow)" />

                {/* Top Flap (pointing down toward center bow) */}
                <path d="M 0 0 L 192.5 270 L 385 0 Z" fill="url(#topFlap)" filter="url(#foldShadow)" />

                {/* Subtle fold lines */}
                <line x1="0" y1="0" x2="192.5" y2="270" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                <line x1="385" y1="0" x2="192.5" y2="270" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                <line x1="0" y1="560" x2="192.5" y2="280" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                <line x1="385" y1="560" x2="192.5" y2="280" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              </svg>

              {/* Bottom Calligraphy */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  zIndex: 25,
                }}
              >
                <p
                  style={{
                    fontFamily: "'Great Vibes', cursive",
                    fontSize: '20px',
                    color: '#ffffff',
                    margin: 0,
                    textShadow: '0 1px 6px rgba(130, 45, 65, 0.4)',
                  }}
                >
                  Requests the pleasure
                </p>
                <p
                  style={{
                    fontSize: '8px',
                    letterSpacing: '0.25em',
                    color: '#fff0f3',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    margin: '2px 0 0 0',
                    textShadow: '0 1px 3px rgba(130, 45, 65, 0.3)',
                  }}
                >
                  of your gracious company
                </p>
              </div>
            </motion.div>

            {/* ══ 4. HORIZONTAL SATIN RIBBON BAND ══ */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: isOpened ? 0 : 1 }}
              transition={{ duration: 0.45 }}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                height: '38px',
                zIndex: 30,
                pointerEvents: 'none',
                background: 'linear-gradient(180deg, #fff0f4 0%, #f8c8d4 30%, #f0a8bc 70%, #e494a8 100%)',
                borderTop: '1px solid rgba(255,255,255,0.8)',
                borderBottom: '1px solid rgba(180,90,110,0.3)',
                boxShadow: '0 4px 14px rgba(160, 70, 95, 0.25)',
              }}
            />

            {/* ══ 5. SATIN BOW ══ */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 35,
                pointerEvents: 'none',
              }}
            >
              <SatinBow isOpened={isOpened} />
            </div>

            {/* Bottom Drop Shadow */}
            <div
              style={{
                position: 'absolute',
                bottom: '-8px',
                left: '14px',
                right: '14px',
                height: '24px',
                backgroundColor: 'rgba(120, 40, 60, 0.2)',
                filter: 'blur(14px)',
                borderRadius: '50%',
                zIndex: 1,
              }}
            />
          </div>

          {/* ── Tap Prompt ── */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{
              opacity: showHint && !isOpened ? 1 : 0,
              y: showHint && !isOpened ? 0 : 6,
            }}
            transition={{ duration: 0.5 }}
            style={{
              marginTop: '12px',
              textAlign: 'center',
            }}
          >
            <motion.p
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                fontSize: '10px',
                letterSpacing: '0.28em',
                color: '#8c2d42',
                fontWeight: '700',
                textTransform: 'uppercase',
                margin: 0,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                textShadow: '0 1px 2px rgba(255,255,255,0.6)',
              }}
            >
              ✦ Tap the ribbon to open ✦
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}