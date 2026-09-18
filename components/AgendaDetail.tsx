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
    <div className="mx-auto max-w-3xl px-6 pb-12 pt-14 text-center">
      <div className="glass rounded-3xl p-6 shadow-2xl md:p-8">
        <h1 className="text-4xl font-bold">{a.title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600">{a.description}</p>
        {qr ? <img className="mx-auto mt-6 h-auto w-40 rounded-xl md:w-44" src={qr} alt="QR link" /> : <p className="mt-8 rounded-lg bg-slate-100 p-4 text-slate-500">QR dan link belum diatur.</p>}
        {a.link && <a className="mt-7 inline-block rounded-full bg-sky-700 px-7 py-3 font-semibold text-white transition-all duration-150 ease-in-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300" href={a.link} target="_blank" rel="noreferrer">Buka tautan</a>}
      </div>
    </div>
  </main>;
}