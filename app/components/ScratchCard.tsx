'use client';

import React, { useRef, useEffect, useState } from 'react';

interface ScratchCardProps {
  dateText?: string;
}

export default function ScratchCard({ dateText = 'December 12, 2026' }: ScratchCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas internal resolution to match container bounding box precisely
    const initCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Draw Pink Scratch Layer
      ctx.fillStyle = '#db8396'; // Pink cover color
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Text on Scratch Surface
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✨ Scratch to Reveal ✨', canvas.width / 2, canvas.height / 2);
    };

    initCanvas();

    // Re-initialize on window resize to keep exact bounds
    window.addEventListener('resize', initCanvas);
    return () => window.removeEventListener('resize', initCanvas);
  }, []);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleMouseDown = () => setIsScratching(true);
  const handleMouseUp = () => setIsScratching(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isScratching) scratch(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-36 my-6 rounded-2xl border-2 border-[#d4af37] overflow-hidden shadow-md bg-white flex items-center justify-center select-none"
    >
      {/* Hidden Text Revealed Underneath */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
        <p className="text-xs uppercase tracking-widest text-gray-500 font-sans">The Big Day</p>
        <p className="text-2xl font-bold text-[#802334] font-serif mt-1">{dateText}</p>
      </div>

      {/* Interactive Scratch Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-pointer touch-none z-10"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      />
    </div>
  );
}