'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type MenuButtonProps = {
  label: string;
  href: string;
  glow: string;
  rotate: number;
  offsetX: number;
  offsetY: number;
  z: number;
};

function MenuButton({ label, href, glow, rotate, offsetX, offsetY, z }: MenuButtonProps) {
  const [spinning, setSpinning] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (spinning) return;
    setSpinning(true);
    setTimeout(() => router.push(href), 700);
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: -110,
        marginTop: -32,
        transform: `rotate(${rotate}deg) translate(${offsetX}px, ${offsetY}px)`,
        zIndex: spinning ? 50 : z,
        perspective: 800,
      }}
    >
      <motion.button
        type="button"
        onClick={handleClick}
        animate={
          spinning
            ? { rotateY: 360, scale: 1.08, boxShadow: `0 0 60px 16px ${glow}` }
            : { rotateY: 0, scale: 1, boxShadow: `0 0 24px 4px ${glow}` }
        }
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        style={{
          width: 220,
          height: 64,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,255,255,0.08))',
          transformStyle: 'preserve-3d',
        }}
        className="flex select-none items-center justify-center rounded-full border border-white/40 font-semibold text-white backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
      >
        {label}
      </motion.button>
    </div>
  );
}

export default function MenuStack() {
  return (
    <div className="mt-14 flex justify-center">
      <div className="scale-[0.68] sm:scale-90 md:scale-100">
        <div className="relative" style={{ width: 320, height: 180 }}>
          <MenuButton label="Umum" href="/umum" glow="rgba(59,130,246,0.7)" rotate={-15} offsetX={-45} offsetY={35} z={1} />
          <MenuButton label="Panitia" href="/panitia/login" glow="rgba(239,68,68,0.7)" rotate={-15} offsetX={0} offsetY={0} z={2} />
          <MenuButton label="PDD" href="/pdd/login" glow="rgba(245,158,11,0.7)" rotate={-15} offsetX={45} offsetY={-35} z={3} />
        </div>
      </div>
    </div>
  );
}
