'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MenuButton({ label, href, glow }: { label: string; href: string; glow: string }) {
  const [spinning, setSpinning] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (spinning) return;
    setSpinning(true);
    setTimeout(() => router.push(href), 600);
  };

  return (
    <div className="relative h-28 w-28 select-none">
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full border border-white/30 bg-white/10"
        style={{ transform: 'rotate(-10deg) translate(-8px, 6px)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full border border-white/30 bg-white/10"
        style={{ transform: 'rotate(8deg) translate(6px, -6px)' }}
      />
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={spinning}
        aria-label={label}
        aria-busy={spinning}
        animate={
          spinning
            ? { rotate: 360, scale: 0.92, boxShadow: `0 0 48px 12px ${glow}` }
            : { rotate: 0, scale: 1, boxShadow: `0 0 20px 2px ${glow}` }
        }
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="absolute inset-0 flex select-none items-center justify-center rounded-full border border-white/40 px-3 text-center font-semibold text-white backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.05))',
          boxShadow: `0 0 20px 2px ${glow}, inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -8px 16px rgba(255,255,255,0.15)`,
        }}
      >
        <span className="text-sm tracking-wide drop-shadow-sm">{label}</span>
      </motion.button>
    </div>
  );
}
