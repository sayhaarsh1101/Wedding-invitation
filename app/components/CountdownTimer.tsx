'use client';

import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string;
}

export default function CountdownTimer({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto py-2">
      <div className="bg-black/40 border border-[#d4af37]/30 rounded-xl p-3 text-center">
        <span className="block text-2xl sm:text-3xl font-bold font-serif gold-text">{timeLeft.days}</span>
        <span className="text-[10px] sm:text-xs uppercase tracking-wider text-rose-200/80">Days</span>
      </div>

      <div className="bg-black/40 border border-[#d4af37]/30 rounded-xl p-3 text-center">
        <span className="block text-2xl sm:text-3xl font-bold font-serif gold-text">{timeLeft.hours}</span>
        <span className="text-[10px] sm:text-xs uppercase tracking-wider text-rose-200/80">Hours</span>
      </div>

      <div className="bg-black/40 border border-[#d4af37]/30 rounded-xl p-3 text-center">
        <span className="block text-2xl sm:text-3xl font-bold font-serif gold-text">{timeLeft.minutes}</span>
        <span className="text-[10px] sm:text-xs uppercase tracking-wider text-rose-200/80">Mins</span>
      </div>

      <div className="bg-black/40 border border-[#d4af37]/30 rounded-xl p-3 text-center">
        <span className="block text-2xl sm:text-3xl font-bold font-serif gold-text">{timeLeft.seconds}</span>
        <span className="text-[10px] sm:text-xs uppercase tracking-wider text-rose-200/80">Secs</span>
      </div>
    </div>
  );
}