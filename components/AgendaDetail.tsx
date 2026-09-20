'use client';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import Link from 'next/link';

export default function AgendaDetail({ section, slug }: { section: string; slug: string }) {
  const [data, setData] = useState<any>();
  const [qr, setQr] = useState('');
  useEffect(() => {
    fetch(`/api/section/${section}`).then(r => r.json()).then(x => setData({ ...x, agenda: x.agendas?.find((a: any) => a.slug === slug) }))
  }, [section, slug]);
  useEffect(() => { if (data?.agenda?.link) QRCode.toDataURL(data.agenda.link, { width: 260, margin: 2 }).then(setQr) }, [data]);
  if (!data) return <p className="p-10 text-center">Memuat...</p>;
  const a = data.agenda;
  if (!a) return <p className="p-10 text-center">Agenda tidak ditemukan.</p>;
  const listPath = section === 'pdd-dokumentasi' ? '/pdd/dokumentasi' : `/${section}`;
  return <main className="relative flex-1 bg-cover bg-center" style={{ backgroundImage: `url(${data.wallpaperUrl || ''})` }}>
    <Link href={listPath} className="absolute left-4 top-4 inline-flex rounded-full border border-blue-200 bg-white px-4 py-2 text-sm text-blue-700 shadow-sm">← Semua agenda</Link>
    <div className="mx-auto max-w-3xl px-6 pb-12 pt-24 text-center md:pt-20">
      <div className="rounded-3xl bg-white/60 p-6 shadow-2xl backdrop-blur-sm md:p-8">
        <div className="space-y-5">
          <h1 className="text-2xl font-bold">{a.title}</h1>
          {a.description && <p className="mx-auto max-w-xl text-slate-600">{a.description}</p>}
          {qr
            ? <div className="flex items-center justify-center">
                <img className="h-auto w-[clamp(140px,40vw,200px)] rounded-xl" src={qr} alt="QR link" />
              </div>
            : <p className="rounded-lg bg-slate-100 p-4 text-slate-500">QR dan link belum diatur.</p>}
          {a.link && <div className="flex items-center justify-center">
            <a className="inline-block rounded-full bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150 ease-in-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300" href={a.link} target="_blank" rel="noreferrer">Buka tautan</a>
          </div>}
        </div>
      </div>
    </div>
  </main>;
}