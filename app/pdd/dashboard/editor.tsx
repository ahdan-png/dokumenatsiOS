'use client';

import { useRef, useState, type FormEvent } from 'react';

type Agenda = { id: string; sectionId: string; title: string; slug: string; description: string; link: string | null; date: string | null };
type Item = { slug: string; link: string; description: string; wallpaperUrl?: string | null; password?: string; name?: string; agendas?: Agenda[]; newAgenda?: { title: string; description: string; link: string; date: string } };
type NotificationType = 'success' | 'error';
const inputClass = 'mt-1 w-full rounded-lg border border-black px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30';

export default function Editor({ sections, sectionFilter }: { sections: Item[]; sectionFilter?: string }) {
  const [items, setItems] = useState(sections.filter(section => !sectionFilter || section.slug === sectionFilter).map(section => ({ ...section, agendas: section.agendas?.map(agenda => ({ ...agenda, date: agenda.date ? agenda.date.slice(0, 10) : null })) })));
  const [notification, setNotification] = useState<{ message: string; type: NotificationType; leaving?: boolean } | null>(null);
  const [showPanitiaPassword, setShowPanitiaPassword] = useState(false);
  const [creatingAgenda, setCreatingAgenda] = useState<Record<number, boolean>>({});
  const [editingAgenda, setEditingAgenda] = useState<string | null>(null);
  const [deletingAgenda, setDeletingAgenda] = useState<string | null>(null);
  const notificationTimer = useRef<number | undefined>(undefined);
  const change = (i: number, key: string, value: string) => setItems(previous => previous.map((item, index) => index === i ? { ...item, [key]: value } : item));
  const notify = (message: string, type: NotificationType = 'success') => {
    setNotification({ message, type });
    if (notificationTimer.current) window.clearTimeout(notificationTimer.current);
    notificationTimer.current = window.setTimeout(() => {
      setNotification(previous => previous ? { ...previous, leaving: true } : null);
      window.setTimeout(() => setNotification(null), 250);
    }, 2950);
  };

  async function upload(i: number, file: File) {
    const form = new FormData();
    form.append('wallpaper', file);
    form.append('sectionSlug', items[i].slug);
    const response = await fetch('/api/upload-wallpaper', { method: 'POST', body: form });
    const data = await response.json();
    if (!response.ok) { notify(data.error || 'Upload wallpaper gagal.', 'error'); return; }
    change(i, 'wallpaperUrl', data.wallpaperUrl);
    notify('Wallpaper berhasil diunggah.');
  }

  async function saveSection(section: Item) {
    const sectionSettings = { link: section.link, description: section.description, password: section.password };
    const response = await fetch('/api/pdd/section/' + section.slug, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(sectionSettings) });
    const data = await response.json().catch(() => null);
    notify(response.ok ? 'Perubahan tersimpan.' : data?.error || 'Gagal menyimpan perubahan.', response.ok ? 'success' : 'error');
  }

  async function createAgenda(index: number, event: FormEvent) {
    event.preventDefault();
    const section = items[index], form = section.newAgenda;
    if (!form || creatingAgenda[index]) return;
    setCreatingAgenda(previous => ({ ...previous, [index]: true }));
    try {
      const response = await fetch('/api/agendas', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sectionSlug: section.slug, title: form.title, description: form.description, link: form.link || null, date: form.date || null }) });
      const data = await response.json();
      if (!response.ok) { notify(data.error || 'Gagal menambah agenda.', 'error'); return; }
      setItems(previous => previous.map((item, i) => i === index ? { ...item, agendas: [...(item.agendas || []), data], newAgenda: { title: '', description: '', link: '', date: '' } } : item));
      notify('Agenda dibuat.');
    } finally {
      setCreatingAgenda(previous => ({ ...previous, [index]: false }));
    }
  }

  async function updateAgenda(sectionIndex: number, agenda: Agenda) {
    const response = await fetch('/api/agendas/' + agenda.id, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title: agenda.title, slug: agenda.slug, description: agenda.description, link: agenda.link || null, date: agenda.date || null }) });
    notify(response.ok ? 'Agenda diperbarui.' : 'Gagal memperbarui agenda.', response.ok ? 'success' : 'error');
  }

  async function removeAgenda(sectionIndex: number, id: string) {
    if (!window.confirm('Hapus agenda ini?')) return;
    const response = await fetch('/api/agendas/' + id, { method: 'DELETE' });
    if (response.ok) {
      setDeletingAgenda(id);
      window.setTimeout(() => {
        setItems(previous => previous.map((item, i) => i === sectionIndex ? { ...item, agendas: (item.agendas || []).filter(agenda => agenda.id !== id) } : item));
        setDeletingAgenda(null);
      }, 250);
      notify('Agenda dihapus.');
    }
    else { const data = await response.json().catch(() => null); notify(data?.error || 'Gagal menghapus agenda.', 'error'); }
  }

  return <div className="space-y-8">
    <section>
      <h2 className="mb-5 text-2xl font-medium text-black">Pengaturan</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {items.map((section, index) => <div key={section.slug} className="editor-card rounded-xl border border-black bg-slate-50 p-6">
          <h3 className={`mb-5 text-lg font-medium ${section.slug === 'panitia' ? 'text-blue-500' : 'text-green-600'}`}>{section.slug === 'panitia' ? 'Kelola Panitia' : section.slug === 'pdd-dokumentasi' ? 'Tim PDD' : 'Umum'}</h3>
          <label className="mb-4 block text-sm text-black">Wallpaper<input type="file" accept="image/png,image/jpeg,image/webp" className={inputClass} onChange={event => event.target.files?.[0] && upload(index, event.target.files[0])} /></label>
          {section.wallpaperUrl && <img src={section.wallpaperUrl} alt="Pratinjau wallpaper" className="mb-4 h-24 w-full rounded-lg object-cover" />}
          {section.slug === 'panitia' && <label className="mb-5 block text-sm text-black">Password baru<div className="relative"><input type={showPanitiaPassword ? 'text' : 'password'} minLength={6} className={inputClass + ' pr-20'} value={section.password || ''} onChange={event => change(index, 'password', event.target.value)} placeholder="Kosongkan jika tidak diubah" /><button type="button" onClick={() => setShowPanitiaPassword(!showPanitiaPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 px-2 text-sm text-slate-600">{showPanitiaPassword ? 'Sembunyikan' : 'Lihat'}</button></div></label>}
          <div className="mb-5 flex flex-col gap-4">
            <div className={`rounded-xl border border-gray-200 border-l-4 bg-white p-6 ${section.slug === 'panitia' ? 'border-l-blue-500' : 'border-l-green-500'}`}>
              <h5 className="mb-3 text-sm font-medium text-slate-700">Tambah Agenda</h5>
              <form onSubmit={event => createAgenda(index, event)} className="grid gap-2">
                <input className={inputClass} placeholder="Agenda" required value={section.newAgenda?.title || ''} onChange={event => change(index, 'newAgenda', { ...(section.newAgenda || {}), title: event.target.value } as any)} />
                <input className={inputClass} type="date" value={section.newAgenda?.date || ''} onChange={event => change(index, 'newAgenda', { ...(section.newAgenda || {}), date: event.target.value } as any)} />
                <textarea className={inputClass} placeholder="Deskripsi agenda" value={section.newAgenda?.description || ''} onChange={event => change(index, 'newAgenda', { ...(section.newAgenda || {}), description: event.target.value } as any)} />
                <input className={inputClass} type="url" placeholder="Link" value={section.newAgenda?.link || ''} onChange={event => change(index, 'newAgenda', { ...(section.newAgenda || {}), link: event.target.value } as any)} />
                <button disabled={creatingAgenda[index]} className="rounded-full bg-blue-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{creatingAgenda[index] ? 'Menyimpan...' : 'Tambah agenda'}</button>
              </form>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-3 font-medium">Agenda yang Sudah Dibuat</h3>
              <div className="space-y-3">{(section.agendas || []).map(agenda => <div key={agenda.id} className={`editor-list-item rounded-lg border border-black/20 p-3 ${deletingAgenda === agenda.id ? 'is-deleting' : ''}`}>
              {editingAgenda === agenda.id ? <>
                <input className={inputClass} placeholder="Agenda" value={agenda.title} onChange={event => setItems(previous => previous.map((item, i) => i === index ? { ...item, agendas: (item.agendas || []).map(a => a.id === agenda.id ? { ...a, title: event.target.value } : a) } : item))} />
                <input className={inputClass} type="date" value={agenda.date ? agenda.date.slice(0, 10) : ''} onChange={event => setItems(previous => previous.map((item, i) => i === index ? { ...item, agendas: (item.agendas || []).map(a => a.id === agenda.id ? { ...a, date: event.target.value || null } : a) } : item))} />
                <textarea className={inputClass} value={agenda.description} onChange={event => setItems(previous => previous.map((item, i) => i === index ? { ...item, agendas: (item.agendas || []).map(a => a.id === agenda.id ? { ...a, description: event.target.value } : a) } : item))} />
                <input className={inputClass} type="url" placeholder="Link" value={agenda.link || ''} onChange={event => setItems(previous => previous.map((item, i) => i === index ? { ...item, agendas: (item.agendas || []).map(a => a.id === agenda.id ? { ...a, link: event.target.value || null } : a) } : item))} />
                <div className="mt-2 flex gap-3 text-sm"><button type="button" onClick={async () => { await updateAgenda(index, agenda); setEditingAgenda(null); }} className="rounded-full bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700">Simpan agenda</button><button type="button" onClick={() => setEditingAgenda(null)} className="rounded-full border border-blue-200 bg-white px-4 py-2 text-blue-700 hover:bg-blue-50">Batal</button><button type="button" onClick={() => removeAgenda(index, agenda.id)} className="rounded-full border border-red-200 bg-white px-4 py-2 text-red-600 hover:bg-red-50">Hapus</button></div>
              </> : <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-medium text-black">{agenda.title}</p><p className="text-sm text-slate-500">{agenda.date ? agenda.date.slice(0, 10) : 'Tanggal belum diatur'}</p></div><div className="flex gap-3 text-sm"><button type="button" onClick={() => setEditingAgenda(agenda.id)} className="rounded-full border border-blue-200 bg-white px-4 py-2 text-blue-700 hover:bg-blue-50">Edit agenda</button><button type="button" onClick={() => removeAgenda(index, agenda.id)} className="rounded-full border border-red-200 bg-white px-4 py-2 text-red-600 hover:bg-red-50">Hapus</button></div></div>}
              </div>)}</div>
            </div>
          </div>
          <button onClick={() => saveSection(section)} className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">Simpan</button>
        </div>)}
      </div>
    </section>
    {notification && <div role="status" className={`toast ${notification.leaving ? 'toast-out' : ''} fixed right-5 top-5 z-50 rounded-lg border px-4 py-3 text-sm font-medium text-white shadow-lg ${notification.type === 'error' ? 'border-red-700 bg-red-600' : 'border-green-600 bg-green-500'}`}><span className="mr-2">{notification.type === 'error' ? '✕' : '✓'}</span>{notification.message}</div>}
  </div>;
}