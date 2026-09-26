'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import BackButton from '@/components/BackButton';

const LOGIN_ROUTES = /^\/(panitia|pdd|admin)\/login$/;
const BACK_ON_LOGIN = /^\/(panitia|pdd)\/login$/;

export default function UiShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';

  if (LOGIN_ROUTES.test(pathname)) {
    if (BACK_ON_LOGIN.test(pathname)) return <><BackButton />{children}</>;
    return <>{children}</>;
  }

  return <>
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <div className="flex flex-col text-sky-800" aria-label="Dokumentasi OSIM">
          <span className="font-bold">DOKUMENTASI OSIM</span>
          <span className="text-xs font-normal text-slate-400">by Sie KOMINFO</span>
        </div>
        <div className="flex items-center" aria-label="Logo OSIM">
          <Image src="/LOGO-OSIM.png" alt="Logo OSIM" width={52} height={40} className="h-10 w-[52px] object-contain" />
        </div>
      </div>
    </header>
    <BackButton />
    {children}
  </>;
}