'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ITEMS = [
  { label: 'Umum', href: '/umum', glow: 'rgba(59,130,246,0.7)' },
  { label: 'Panitia', href: '/panitia/login', glow: 'rgba(239,68,68,0.7)' },
  { label: 'PDD', href: '/pdd/login', glow: 'rgba(245,158,11,0.7)' },
];

const SPIN_DURATION = 0.45;

function MenuButton({ label, href, glow }: { label: string; href: string; glow: string }) {
  const [spinning, setSpinning] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (spinning) return;
    setSpinning(true);
    router.push(href);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      initial={false}
      animate={
        spinning
          ? {
              rotateX: 360,
              scale: 1.08,
              boxShadow: `0 0 60px 16px ${glow}`,
              transition: { duration: SPIN_DURATION, repeat: Infinity, ease: 'linear' },
            }
          : { rotateX: 0, scale: 1, boxShadow: `0 0 24px 4px ${glow}`, transition: { duration: 0.3 } }
      }
      style={{
        width: 'clamp(150px, 38vw, 220px)',
        height: 'clamp(52px, 11vw, 64px)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,255,255,0.08))',
        transformStyle: 'preserve-3d',
      }}
      className="flex select-none items-center justify-center rounded-full border border-white/40 text-base font-semibold text-white backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:text-lg"
    >
      {label}
    </motion.button>
  );
}

export default function MenuStack() {
  return (
    <div
      className="mx-auto mt-14 flex flex-wrap items-center justify-center gap-5 sm:mt-16 sm:gap-7"
      style={{ perspective: 1000 }}
    >
      {ITEMS.map((item) => (
        <MenuButton key={item.href} {...item} />
      ))}
    </div>
  );
}
