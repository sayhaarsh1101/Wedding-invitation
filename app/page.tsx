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
  CheckCircle2,
  MapPin,
  Calendar,
} from 'lucide-react';
import HeartScratchCard from './components/HeartScratchCard';
import CountdownTimer from './components/CountdownTimer';
import EnvelopeIntro from './components/EnvelopeIntro';

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
      audioRef.current.volume = 0.3;
    }
  }, []);

  const handleStartOpen = async () => {
    if (audioRef.current) {
      try {
        audioRef.current.volume = 0.3;
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
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
      <audio ref={audioRef} loop preload="auto" src="/audio/wedding-music.mp3" />

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

              {/* Luxury Date Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                  borderTop: '1px solid #e8cdd4',
                  borderBottom: '1px solid #e8cdd4',
                  padding: '10px 0',
                  margin: '12px 0',
                  width: '90%',
                }}
              >
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', color: '#8c2d42', display: 'block' }}>
                    DECEMBER
                  </span>
                  <span style={{ fontSize: '9px', color: '#7a4e58', letterSpacing: '0.1em' }}>
                    WEDNESDAY
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '36px',
                    fontWeight: '700',
                    color: '#7a2335',
                    lineHeight: '1',
                  }}
                >
                  09
                </div>

                <div style={{ textAlign: 'left' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', color: '#8c2d42', display: 'block' }}>
                    2026
                  </span>
                  <span style={{ fontSize: '9px', color: '#7a4e58', letterSpacing: '0.1em' }}>
                    11:30 AM
                  </span>
                </div>
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
            <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#5c2c38', fontStyle: 'italic', margin: '0 0 10px 0' }}>
              “With hearts full of joy, we invite you to share our special day as we exchange vows and begin our new chapter together.”
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#8c2d42', margin: 0, fontWeight: '600' }}>
              We eagerly await your presence to grace this blessed celebration 💕
            </p>
          </section>

          {/* 4. Countdown Timer Card */}
          <section style={sectionCardStyle}>
            <h2 style={cursiveHeaderStyle}>Counting Down to Forever</h2>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0 16px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>
            <CountdownTimer targetDate="2026-12-09T10:00:00" />
          </section>

          {/* 5. Scratch to Reveal Section */}
          <section style={sectionCardStyle}>
            <h2 style={cursiveHeaderStyle}>Scratch for a Secret Message</h2>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0 14px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
              <HeartScratchCard dateText="DECEMBER 9, 2026" />
            </div>
          </section>

          {/* 6. Photo Carousel Gallery */}
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

          {/* 7. Program Timeline */}
          <section style={{ ...sectionCardStyle, textAlign: 'left' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Clock size={20} color="#8c2d42" style={{ margin: '0 auto 4px auto' }} />
              <h2 style={cursiveHeaderStyle}>The Celebrations</h2>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
                <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
                <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
                <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingLeft: '8px' }}>
              {[
                { title: 'Guest Arrival', date: 'Dec 9, 2026 • 10:00 AM', desc: 'Warm welcome of all guests with refreshments' },
                { title: 'Wedding Ceremony', date: 'Dec 9, 2026 • 11:30 AM', desc: 'The auspicious wedding rituals & celebrations' },
                { title: 'Grand Reception', date: 'Dec 10, 2026 • 7:00 PM', desc: 'Dinner, music, and celebratory banquet onwards' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#8c2d42', marginTop: '5px', flexShrink: 0 }} />
                  <div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: '#4a1525', margin: '0 0 2px 0', fontWeight: '600' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#8c2d42', margin: '0 0 2px 0', fontWeight: '600' }}>
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

          {/* 8. Venue & Map */}
          <section style={sectionCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '0 0 8px 0' }}>
              <MapPin size={20} color="#8c2d42" />
            </div>

            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#4a1525', margin: '0 0 6px 0', fontWeight: '600' }}>
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
              View on Google Maps
            </a>
          </section>

          {/* 9. Dress Code */}
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
                Ladies
              </h3>
              <p style={{ fontSize: '12px', color: '#683f49', margin: 0 }}>
                Traditional attire in pastel or festive royal colors
              </p>
            </div>

            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: '#8c2d42', margin: '0 0 4px 0', fontWeight: '600' }}>
                Gentlemen
              </h3>
              <p style={{ fontSize: '12px', color: '#683f49', margin: 0 }}>
                Suits, Kurta Pajama, or traditional formal wear
              </p>
            </div>
          </section>

          {/* 10. Pre-Wedding Events */}
          <section style={sectionCardStyle}>
            <Sparkles size={20} color="#8c2d42" style={{ margin: '0 auto 4px auto' }} />
            <h2 style={cursiveHeaderStyle}>Pre-Wedding Events</h2>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 18px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>

            {[
              { name: 'Mehendi', time: 'Dec 7, 2026 • 6:00 PM', place: 'Rajgir, Bihar' },
              { name: 'Haldi', time: 'Dec 8, 2026 • 10:00 AM', place: 'Rajgir, Bihar' },
              { name: 'Sangeet', time: 'Dec 8, 2026 • 7:00 PM', place: 'Rajgir Convention Centre' },
            ].map((evt, idx) => (
              <div key={idx} style={{ marginBottom: idx === 2 ? '0' : '16px' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: '#4a1525', margin: '0 0 2px 0', fontWeight: '600' }}>
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
            <h2 style={cursiveHeaderStyle}>Transportation</h2>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 12px 0' }}>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
              <span style={{ color: '#8c2d42', fontSize: '10px', margin: '0 6px' }}>♥</span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#e2b4be' }} />
            </div>
            <p style={{ fontSize: '12px', color: '#683f49', margin: 0, lineHeight: '1.6' }}>
              Convenient shuttle services will be available from Rajgir Railway Station &amp; Gaya Airport to the venue.
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
              Special accommodation for all our guests has been arranged at Rajgir Residency.
            </p>
          </section>

          {/* 12. RSVP Form (Direct to Google Sheets) */}
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