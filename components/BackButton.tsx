'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);
  const isDetailPage =
    (segments.length === 2 && (segments[0] === 'umum' || segments[0] === 'panitia') && segments[1] !== 'login') ||
    (segments.length === 3 && segments[0] === 'pdd' && segments[1] === 'dokumentasi');

  if (isDetailPage) return null;

  const backTargets: Record<string, string> = {
    '/umum': '/',
    '/panitia': '/',
    '/pdd/dokumentasi': '/pdd/menu',
    '/panitia/login': '/',
    '/pdd/login': '/',
  };
  const target = backTargets[pathname];

  return <div className="inline-block p-4">
    <button type="button" aria-label="Kembali" onClick={() => (target ? router.push(target) : router.back())} className="rounded-full border border-blue-200 bg-white px-4 py-2 text-blue-700 shadow-sm">
      <span aria-hidden="true" className="text-lg leading-none">←</span>
    </button>
  </div>;
}