'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
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
      const radius = 90 + (i % 5) * 45;
      return {
        id: i,
        x: Math.cos((angle * Math.PI) / 180) * radius,
        y: Math.sin((angle * Math.PI) / 180) * radius - 30,
        size: 7 + (i % 4) * 4,
        rotation: (i * 37) % 360,
        delay: (i % 6) * 0.06,
      };
    });
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 60, overflow: 'hidden' }}>
      {petals.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 }}
          animate={{
            opacity: [0, 0.85, 0],
            scale: [0.4, 1.15, 0.5],
            x: p.x,
            y: p.y,
            rotate: p.rotation + 180,
          }}
          transition={{
            duration: 2.2,
            delay: 0.1 + p.delay,
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
            boxShadow: '0 3px 10px rgba(216, 27, 96, 0.28)',
          }}
        />
      ))}
    </div>
  );
};

/* ─── "YOU ARE INVITED" Royal Badge ───────────────────────────────── */
const InvitedBadge = ({ isOpening }: { isOpening: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: -10, x: '-50%', scale: 0.9 }}
    animate={{
      opacity: isOpening ? 0.35 : 1,
      y: isOpening ? -20 : 0,
      x: '-50%',
      scale: isOpening ? 0.92 : 1,
    }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
    style={{
      position: 'absolute',
      top: '12%',
      left: '50%',
      zIndex: 25,
      textAlign: 'center',
      pointerEvents: 'none',
      width: 'max-content',
    }}
  >
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.94) 0%, rgba(255,248,242,0.9) 100%)',
        border: '1.5px solid rgba(212, 175, 55, 0.75)',
        borderRadius: '26px',
        padding: '7px 24px 9px',
        boxShadow: '0 8px 25px rgba(120, 40, 60, 0.22), inset 0 1px 2px rgba(255,255,255,0.95)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <p
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '9.5px',
          letterSpacing: '0.3em',
          fontWeight: '700',
          color: '#8c2d42',
          margin: '0 0 2px 0',
          textTransform: 'uppercase',
        }}
      >
        You Are
      </p>
      <p
        style={{
          fontFamily: "'Great Vibes', cursive",
          fontSize: '26px',
          color: '#7a2335',
          margin: 0,
          lineHeight: '1.05',
        }}
      >
        Invited
      </p>
    </div>
  </motion.div>
);

/* ─── "With the blessings..." Calligraphy ─────────────────────────── */
const BlessingsText = ({ isOpening }: { isOpening: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, x: '-50%' }}
    animate={{
      opacity: isOpening ? 0 : 1,
      y: isOpening ? 10 : 0,
      x: '-50%',
    }}
    transition={{ duration: 0.4 }}
    style={{
      position: 'absolute',
      bottom: '11.5%',
      left: '50%',
      zIndex: 25,
      textAlign: 'center',
      width: '90%',
      pointerEvents: 'none',
    }}
  >
    <p
      style={{
        fontFamily: "'Great Vibes', cursive",
        fontSize: '19px',
        color: '#ffffff',
        margin: 0,
        textShadow: '0 2px 10px rgba(0, 0, 0, 0.85), 0 1px 4px rgba(0,0,0,0.7)',
      }}
    >
      With the blessings of our families
    </p>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════════ */
/*  MAIN: Royal Palace Door Intro Scene                              */
/* ═══════════════════════════════════════════════════════════════════ */
export default function EnvelopeIntro({ onStartOpen, onOpen }: EnvelopeIntroProps) {
  // State: 'idle' -> 'opening' -> 'walking' -> 'glowOut' -> 'done'
  const [phase, setPhase] = useState<'idle' | 'opening' | 'walking' | 'glowOut' | 'done'>('idle');
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenDoors = useCallback(() => {
    if (phase !== 'idle') return;

    // Start music immediately on tap
    if (onStartOpen) {
      onStartOpen();
    }

    setPhase('opening');

    // Couple starts stepping forward through open doors
    setTimeout(() => {
      setPhase('walking');
    }, 900);

    // Warm golden flash bloom transition
    setTimeout(() => {
      setPhase('glowOut');
    }, 4000);

    // Complete transition to main invitation card
    setTimeout(() => {
      setPhase('done');
      onOpen();
    }, 5100);
  }, [phase, onStartOpen, onOpen]);

  if (phase === 'done') return null;

  const isOpening = phase !== 'idle';
  const isWalking = phase === 'walking' || phase === 'glowOut';
  const isGlowingOut = phase === 'glowOut';

  return (
    <AnimatePresence>
      <motion.div
        key="royal-door-intro-scene"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        onClick={handleOpenDoors}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: phase === 'idle' ? 'pointer' : 'default',
          background: '#0d0205',
        }}
      >
        {/* ── Responsive Frame Container (Centers on any screen) ── */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '430px',
            height: '100%',
            maxHeight: '100vh',
            overflow: 'hidden',
            boxShadow: '0 0 60px rgba(0,0,0,0.85)',
            perspective: '1400px',
          }}
        >
          {/* ══ LAYER 1: PALACE COURTYARD BACKDROP (Inside the Doors) ══ */}
          <motion.div
            animate={{
              scale: isGlowingOut ? 1.25 : isOpening ? 1.08 : 1,
            }}
            transition={{
              duration: isGlowingOut ? 1.2 : 4.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
            }}
          >
            <img
              src="/images/palace-doorway.jpg"
              alt="Palace Courtyard"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center',
              }}
            />
            {/* Soft ambient lighting */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(255,220,230,0.12) 0%, rgba(255,210,160,0.08) 60%, rgba(0,0,0,0.3) 100%)',
              }}
            />
          </motion.div>

          {/* ══ LAYER 2: GLOWING LIGHT RAYS FROM DOORWAY ══ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: isGlowingOut ? 1 : isOpening ? 0.8 : 0,
              scale: isGlowingOut ? 3.5 : isOpening ? 1.4 : 0.6,
            }}
            transition={{
              duration: isGlowingOut ? 1.2 : 2.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              position: 'absolute',
              top: '42%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '280px',
              height: '380px',
              background: 'radial-gradient(ellipse at center, rgba(255,248,220,0.95) 0%, rgba(255,215,140,0.6) 30%, rgba(255,180,90,0.2) 60%, transparent 75%)',
              borderRadius: '50%',
              zIndex: 4,
              pointerEvents: 'none',
            }}
          />

          {/* ══ LAYER 3: 3D ROYAL PALACE DOUBLE DOORS ══ */}
          {/* Left Door Leaf */}
          <motion.div
            initial={{ rotateY: 0, x: 0 }}
            animate={{
              rotateY: isOpening ? -85 : 0,
              x: isOpening ? '-95%' : '0%',
            }}
            transition={{
              duration: 2.2,
              ease: [0.65, 0, 0.35, 1],
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '50.1%',
              height: '100%',
              zIndex: 10,
              transformOrigin: 'left center',
              overflow: 'hidden',
              backgroundImage: 'url(/images/palace-doors.jpg)',
              backgroundSize: '200% 100%',
              backgroundPosition: 'left center',
              boxShadow: isOpening ? 'none' : 'inset -5px 0 15px rgba(0,0,0,0.5)',
            }}
          >
            {/* Depth shadow on left door edge */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '30px',
                height: '100%',
                background: 'linear-gradient(to left, rgba(0,0,0,0.45), transparent)',
                pointerEvents: 'none',
              }}
            />
          </motion.div>

          {/* Right Door Leaf */}
          <motion.div
            initial={{ rotateY: 0, x: 0 }}
            animate={{
              rotateY: isOpening ? 85 : 0,
              x: isOpening ? '95%' : '0%',
            }}
            transition={{
              duration: 2.2,
              ease: [0.65, 0, 0.35, 1],
            }}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '50.1%',
              height: '100%',
              zIndex: 10,
              transformOrigin: 'right center',
              overflow: 'hidden',
              backgroundImage: 'url(/images/palace-doors.jpg)',
              backgroundSize: '200% 100%',
              backgroundPosition: 'right center',
              boxShadow: isOpening ? 'none' : 'inset 5px 0 15px rgba(0,0,0,0.5)',
            }}
          >
            {/* Depth shadow on right door edge */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '30px',
                height: '100%',
                background: 'linear-gradient(to right, rgba(0,0,0,0.45), transparent)',
                pointerEvents: 'none',
              }}
            />
          </motion.div>

          {/* Golden Center Rod & Handle (Seam) */}
          <motion.div
            initial={{ opacity: 1, x: '-50%' }}
            animate={{
              opacity: isOpening ? 0 : 1,
              x: '-50%',
              scaleY: isOpening ? 0.9 : 1,
            }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              width: '6px',
              height: '100%',
              background: 'linear-gradient(180deg, #c9a024 0%, #fff1b0 25%, #d4af37 50%, #fff1b0 75%, #c9a024 100%)',
              zIndex: 15,
              borderRadius: '3px',
              boxShadow: '0 0 14px rgba(212, 175, 55, 0.6), 0 0 28px rgba(212, 175, 55, 0.3)',
              pointerEvents: 'none',
            }}
          />

          {/* ══ LAYER 4: "YOU ARE INVITED" BADGE ══ */}
          <InvitedBadge isOpening={isOpening} />

          {/* ══ LAYER 5: COUPLE ILLUSTRATION (WALKING FORWARD INTO DOORWAY) ══ */}
          <motion.div
            initial={{ x: '-50%', y: 0, scale: 1, opacity: 1 }}
            animate={{
              x: '-50%',
              y: isWalking ? -80 : 0,
              scale: isWalking ? 0.72 : 1,
              opacity: isGlowingOut ? 0.2 : 1,
            }}
            transition={{
              duration: isWalking ? 3.4 : 0.8,
              ease: [0.25, 1, 0.5, 1],
            }}
            style={{
              position: 'absolute',
              bottom: '15%',
              left: '50%',
              zIndex: 20,
              width: '52%',
              maxWidth: '225px',
              pointerEvents: 'none',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <img
              src="/images/couple-transparent.png"
              alt="Harsh and Rutbi"
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 10px 22px rgba(0,0,0,0.5))',
              }}
            />
          </motion.div>

          {/* ══ LAYER 6: BLESSINGS TEXT ══ */}
          <BlessingsText isOpening={isOpening} />

          {/* ══ LAYER 7: INTERACTIVE "TAP TO OPEN" BUTTON ══ */}
          <AnimatePresence>
            {!isOpening && (
              <motion.div
                key="open-button"
                initial={{ opacity: 0, y: 15, x: '-50%', scale: 0.95 }}
                animate={{
                  opacity: showHint ? 1 : 0,
                  y: showHint ? 0 : 15,
                  x: '-50%',
                  scale: 1,
                }}
                exit={{ opacity: 0, scale: 0.9, y: 10, x: '-50%' }}
                transition={{ duration: 0.4 }}
                style={{
                  position: 'absolute',
                  bottom: '3.5%',
                  left: '50%',
                  zIndex: 30,
                  width: '82%',
                  maxWidth: '290px',
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  animate={{
                    boxShadow: [
                      '0 4px 20px rgba(212, 175, 55, 0.4)',
                      '0 6px 30px rgba(212, 175, 55, 0.75)',
                      '0 4px 20px rgba(212, 175, 55, 0.4)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    borderRadius: '28px',
                    border: '1.5px solid rgba(255, 255, 255, 0.85)',
                    background: 'linear-gradient(135deg, #d4af37 0%, #f7df87 50%, #c9a024 100%)',
                    color: '#4a1525',
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '13px',
                    fontWeight: '700',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <span>✦ Tap to Open ✦</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ══ LAYER 8: ROSE PETAL BURST ON OPEN ══ */}
          {isOpening && !isGlowingOut && <FloatingPetals />}

          {/* ══ LAYER 9: FULL-SCREEN WARM GOLDEN FLASH ON FINISH ══ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: isGlowingOut ? 1 : 0,
            }}
            transition={{
              duration: 1.1,
              ease: 'easeIn',
            }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, #ffffff 0%, #fff8ea 45%, #fff2d8 100%)',
              zIndex: 70,
              pointerEvents: 'none',
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}