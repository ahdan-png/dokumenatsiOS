'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/') return null;

  return <div className="mx-auto max-w-6xl px-5 pt-3">
    <button type="button" aria-label="Kembali" onClick={() => router.back()} className="rounded-full border border-blue-200 bg-white px-4 py-2 text-blue-700 shadow-sm">
      <span aria-hidden="true" className="text-lg leading-none">←</span>
    </button>
  </div>;
}
