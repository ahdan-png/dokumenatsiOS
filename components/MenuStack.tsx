'use client';

import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const ITEMS = [
  { label: 'Umum', href: '/umum', glow: 'rgba(59,130,246,0.7)' },
  { label: 'Panitia', href: '/panitia/login', glow: 'rgba(239,68,68,0.7)' },
  { label: 'PDD', href: '/pdd/login', glow: 'rgba(245,158,11,0.7)' },
];

const ZOOM_DURATION = 0.3;
const ZOOM_SCALE = 1.9;

function MenuButton({ label, href, glow }: { label: string; href: string; glow: string }) {
  const [zooming, setZooming] = useState(false);
  const [shift, setShift] = useState(0);
  const ref = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const handleClick = () => {
    if (zooming) return;
    const box = ref.current?.getBoundingClientRect();
    if (box) setShift(window.innerWidth / 2 - (box.left + box.width / 2));
    setZooming(true);
    setTimeout(() => router.push(href), ZOOM_DURATION * 1000);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={handleClick}
      initial={false}
      animate={
        zooming
          ? { scale: ZOOM_SCALE, x: shift, opacity: 0.9, boxShadow: `0 0 70px 18px ${glow}` }
          : { scale: 1, x: 0, opacity: 1, boxShadow: `0 0 24px 4px ${glow}` }
      }
      transition={{ duration: ZOOM_DURATION, ease: 'easeOut' }}
      style={{
        width: 'clamp(150px, 38vw, 220px)',
        height: 'clamp(52px, 11vw, 64px)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,255,255,0.08))',
      }}
      className="flex select-none items-center justify-center rounded-full border border-white/40 text-base font-semibold text-white backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:text-lg"
    >
      {label}
    </motion.button>
  );
}

export default function MenuStack() {
  return (
    <div className="mx-auto mt-14 flex flex-wrap items-center justify-center gap-5 sm:mt-16 sm:gap-7">
      {ITEMS.map((item) => (
        <MenuButton key={item.href} {...item} />
      ))}
    </div>
  );
}
