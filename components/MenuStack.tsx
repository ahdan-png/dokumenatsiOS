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
    setTimeout(() => router.push(href), 600);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      initial={false}
      animate={
        spinning
          ? { rotate: rotate + 360, x: 0, y: 0, scale: 1.08, zIndex: 50, boxShadow: `0 0 60px 16px ${glow}` }
          : { rotate, x: offsetX, y: offsetY, zIndex: z, boxShadow: `0 0 24px 4px ${glow}` }
      }
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: -110,
        marginTop: -32,
        width: 220,
        height: 64,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,255,255,0.08))',
      }}
      className="flex select-none items-center justify-center rounded-full border border-white/40 font-semibold text-white backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
    >
      {label}
    </motion.button>
  );
}

export default function MenuStack() {
  return (
    <div className="mt-14 flex justify-center">
      <div className="scale-[0.68] sm:scale-90 md:scale-100">
        <div className="relative" style={{ width: 360, height: 200 }}>
          <MenuButton label="Umum" href="/umum" glow="rgba(59,130,246,0.7)" rotate={-13} offsetX={-72} offsetY={26} z={1} />
          <MenuButton label="Panitia" href="/panitia/login" glow="rgba(239,68,68,0.7)" rotate={-3} offsetX={0} offsetY={-14} z={2} />
          <MenuButton label="PDD" href="/pdd/login" glow="rgba(245,158,11,0.7)" rotate={9} offsetX={72} offsetY={26} z={3} />
        </div>
      </div>
    </div>
  );
}
