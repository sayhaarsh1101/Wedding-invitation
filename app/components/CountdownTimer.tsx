'use client';

import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string;
  variant?: 'light' | 'dark';
}

export default function CountdownTimer({ targetDate, variant = 'light' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
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
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const isDark = variant === 'dark';

  const boxStyle: React.CSSProperties = isDark
    ? {
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '14px',
        padding: '12px 8px',
        textAlign: 'center',
        backdropFilter: 'blur(4px)',
      }
    : {
        backgroundColor: 'rgba(140, 45, 66, 0.06)',
        border: '1px solid rgba(140, 45, 66, 0.12)',
        borderRadius: '14px',
        padding: '12px 8px',
        textAlign: 'center',
      };

  const numberStyle: React.CSSProperties = isDark
    ? {
        display: 'block',
        fontSize: '28px',
        fontWeight: '700',
        fontFamily: "'Playfair Display', serif",
        background: 'linear-gradient(135deg, #d4af37 0%, #aa8321 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }
    : {
        display: 'block',
        fontSize: '28px',
        fontWeight: '700',
        fontFamily: "'Playfair Display', serif",
        color: '#8c2d42',
      };

  const labelStyle: React.CSSProperties = isDark
    ? {
        fontSize: '9px',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        color: 'rgba(248, 187, 208, 0.7)',
        fontWeight: '500',
      }
    : {
        fontSize: '9px',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        color: '#8c2d42',
        fontWeight: '600',
        opacity: 0.7,
      };

  const items = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Mins' },
    { value: timeLeft.seconds, label: 'Secs' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', maxWidth: '340px', margin: '0 auto', padding: '4px 0' }}>
      {items.map((item) => (
        <div key={item.label} style={boxStyle}>
          <span style={numberStyle}>{item.value}</span>
          <span style={labelStyle}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
