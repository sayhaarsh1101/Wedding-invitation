'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface HeartScratchCardProps {
  dateText?: string;
}

export default function HeartScratchCard({ dateText = 'DECEMBER 9, 2026' }: HeartScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas Dimensions
    const width = 320;
    const height = 160;
    canvas.width = width;
    canvas.height = height;

    // Draw Gold Metallic Cover
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#ffe082');
    gradient.addColorStop(0.3, '#d4af37');
    gradient.addColorStop(0.7, '#aa8321');
    gradient.addColorStop(1, '#ffe082');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Overlay "SCRATCH HERE" Text
    ctx.fillStyle = '#4a3505';
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '2px';
    ctx.fillText('SCRATCH HERE', width / 2, height / 2);
  }, []);

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    // Count transparent pixels (alpha channel)
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    const percentage = (transparentPixels / (pixels.length / 4)) * 100;

    // Reveal completely once user scratches even a tiny bit (>2%)
    if (percentage > 2) {
      setIsRevealed(true);
    }
  };

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 35, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage();
  };

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsScratching(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isScratching) {
      scratch(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => setIsScratching(false);

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsScratching(true);
    if (e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isScratching && e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => setIsScratching(false);

  return (
    <div
      style={{
        position: 'relative',
        width: '320px',
        height: '160px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(140, 45, 66, 0.12)',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* Revealed Content Beneath */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #2a0812 0%, #120206 100%)',
          border: '1px solid rgba(212, 175, 55, 0.6)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#d4af37', margin: 0 }}>
          Save The Date
        </p>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', color: '#ffe082', margin: '8px 0', fontWeight: '500' }}>
          {dateText}
        </p>
        <p style={{ fontSize: '12px', letterSpacing: '0.1em', color: '#fecdd3', margin: 0 }}>
          MUMBAI, INDIA
        </p>
      </div>

      {/* Gold Scratch Surface */}
      <motion.canvas
        ref={canvasRef}
        animate={{ opacity: isRevealed ? 0 : 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          cursor: isRevealed ? 'default' : 'pointer',
          pointerEvents: isRevealed ? 'none' : 'auto',
          touchAction: 'none',
        }}
      />
    </div>
  );
}