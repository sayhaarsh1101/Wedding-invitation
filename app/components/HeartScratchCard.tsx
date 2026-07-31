'use client';

import React, { useRef, useEffect, useState } from 'react';

interface HeartScratchProps {
  dateText?: string;
}

export default function HeartScratchCard({ dateText = "December 9, 2026" }: HeartScratchProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScratched, setIsScratched] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill scratch surface
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gold pattern text on scratch layer
    ctx.fillStyle = '#2b040a';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH HERE ✨', canvas.width / 2, canvas.height / 2 + 4);
  }, []);

  const handleScratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <div className="relative w-64 h-32 mx-auto rounded-2xl overflow-hidden border-2 border-[#d4af37] bg-[#1c0206] shadow-inner flex flex-col items-center justify-center p-4">
      {/* Revealed Hidden Content */}
      <div className="text-center space-y-1">
        <p className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">Save The Date</p>
        <p className="text-xl font-serif font-bold text-amber-100">{dateText}</p>
        <p className="text-[10px] text-rose-200/80 uppercase tracking-wider">Shubh Vivah</p>
      </div>

      {/* Scratch Overlay Canvas */}
      {!isScratched && (
        <canvas
          ref={canvasRef}
          width={256}
          height={128}
          onMouseMove={handleScratch}
          onTouchMove={handleScratch}
          className="absolute inset-0 cursor-pointer touch-none z-10 transition-opacity duration-500"
        />
      )}
    </div>
  );
}