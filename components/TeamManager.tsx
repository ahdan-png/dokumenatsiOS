'use client';

import { useRef, useState, type FormEvent } from 'react';

type User = { id: string; username: string; name: string };
type NotificationType = 'success' | 'error';
const inputClass = 'mt-1 w-full rounded-lg border border-black px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30';

export default function TeamManager({ users: initialUsers }: { users: User[] }) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState(initialUsers);
  const [newUser, setNewUser] = useState({ username: '', name: '', password: '' });
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);
  const [passwordEdits, setPasswordEdits] = useState<Record<string, string>>({});
  const [showPasswordEdits, setShowPasswordEdits] = useState<Record<string, boolean>>({});
  const [showPasswordEditValues, setShowPasswordEditValues] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<{ message: string; type: NotificationType; leaving?: boolean } | null>(null);
  const notificationTimer = useRef<number | undefined>(undefined);

  const notify = (message: string, type: NotificationType = 'success') => {
    setNotification({ message, type });
    if (notificationTimer.current) window.clearTimeout(notificationTimer.current);
    notificationTimer.current = window.setTimeout(() => {
      setNotification(previous => previous ? { ...previous, leaving: true } : null);
      window.setTimeout(() => setNotification(null), 250);
    }, 2950);
  };

  async function createUser(event: FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/pdd/users', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(newUser) });
    const data = await response.json();
    if (!response.ok) { notify(data.error || 'Gagal menambah pengguna.', 'error'); return; }
    setUsers([...users, data]);
    setNewUser({ username: '', name: '', password: '' });
    notify('Pengguna berhasil ditambahkan.');
  }

  async function updateUser(user: User) {
    const response = await fetch('/api/pdd/users/' + user.id, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ username: user.username, name: user.name }) });
    notify(response.ok ? 'Pengguna diperbarui.' : 'Gagal memperbarui pengguna.', response.ok ? 'success' : 'error');
  }

  async function changePassword(id: string) {
    const password = passwordEdits[id] || '';
    if (password.length < 6) { notify('Password minimal 6 karakter.', 'error'); return; }
    const response = await fetch('/api/pdd/users/' + id + '/password', { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password }) });
    if (response.ok) {
      setPasswordEdits(previous => ({ ...previous, [id]: '' }));
      setShowPasswordEdits(previous => ({ ...previous, [id]: false }));
    }
    notify(response.ok ? 'Password diperbarui.' : 'Gagal memperbarui password.', response.ok ? 'success' : 'error');
  }

  async function removeUser(id: string) {
    if (!window.confirm('Hapus pengguna ini?')) return;
    const response = await fetch('/api/pdd/users/' + id, { method: 'DELETE' });
    if (response.ok) { setUsers(users.filter(user => user.id !== id)); notify('Pengguna berhasil dihapus.'); }
    else notify('Gagal menghapus pengguna.', 'error');
  }

  return <>
    <button type="button" onClick={() => setOpen(previous => !previous)} className="glass rounded-xl p-6 text-left transition-all duration-150 ease-in-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
      <span className="text-sm font-semibold uppercase tracking-[.16em] text-sky-700">Kelola</span>
      <h2 className="mt-3 text-2xl font-semibold text-slate-900">Tambah tim</h2>
      <p className="mt-2 text-sm text-slate-600">Kelola anggota tim PDD.</p>
      <span className="mt-6 inline-block text-sm font-semibold text-sky-700">{open ? 'Tutup →' : 'Buka →'}</span>
    </button>
    {open && <div className="sm:col-span-2 rounded-xl border border-black bg-white p-4 md:p-6">
      <h2 className="mb-5 text-2xl font-medium text-black">Kelola Tim PDD</h2>
      <form onSubmit={createUser} className="mb-6 grid gap-3 md:grid-cols-4">
        <input className={inputClass} placeholder="Username" value={newUser.username} onChange={event => setNewUser({ ...newUser, username: event.target.value })} required />
        <input className={inputClass} placeholder="Nama" value={newUser.name} onChange={event => setNewUser({ ...newUser, name: event.target.value })} required />
        <div className="relative"><input className={inputClass + ' pr-20'} type={showNewUserPassword ? 'text' : 'password'} placeholder="Password" minLength={6} value={newUser.password} onChange={event => setNewUser({ ...newUser, password: event.target.value })} required /><button type="button" onClick={() => setShowNewUserPassword(!showNewUserPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 px-2 text-sm text-slate-600">{showNewUserPassword ? 'Sembunyikan' : 'Lihat'}</button></div>
        <button className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">Tambah tim</button>
      </form>
      <div className="space-y-3">{users.map(user => <div key={user.id} className="editor-list-item grid min-w-0 grid-cols-[auto_1fr] items-center gap-3 border-b border-black/20 py-3 last:border-0 sm:flex sm:flex-wrap">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white">{user.name.charAt(0).toUpperCase()}</span>
        <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
          <input className={inputClass} value={user.username} onChange={event => setUsers(users.map(item => item.id === user.id ? { ...item, username: event.target.value } : item))} aria-label={`Username ${user.name}`} />
          <input className={inputClass} value={user.name} onChange={event => setUsers(users.map(item => item.id === user.id ? { ...item, name: event.target.value } : item))} aria-label={`Nama ${user.username}`} />
        </div>
        <div className="col-span-2 flex min-w-0 flex-wrap gap-2 sm:col-span-auto">
          <button onClick={() => updateUser(user)} className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">Simpan</button>
          {showPasswordEdits[user.id] ? <div className="flex min-w-0 flex-wrap items-center gap-2"><div className="relative min-w-0 flex-1 sm:flex-none"><input className={inputClass + ' w-full sm:w-44 pr-16'} type={showPasswordEditValues[user.id] ? 'text' : 'password'} minLength={6} placeholder="Password baru" value={passwordEdits[user.id] || ''} onChange={event => setPasswordEdits(previous => ({ ...previous, [user.id]: event.target.value }))} aria-label={`Password baru ${user.username}`} /><button type="button" onClick={() => setShowPasswordEditValues(previous => ({ ...previous, [user.id]: !previous[user.id] }))} className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full px-1 text-xs text-blue-600">{showPasswordEditValues[user.id] ? 'Sembunyi' : 'Lihat'}</button></div><button onClick={() => changePassword(user.id)} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">Simpan</button><button type="button" onClick={() => setShowPasswordEdits(previous => ({ ...previous, [user.id]: false }))} className="rounded-full border border-blue-200 bg-white px-4 py-2 text-sm text-blue-700 hover:bg-blue-50">Batal</button></div> : <button onClick={() => setShowPasswordEdits(previous => ({ ...previous, [user.id]: true }))} className="rounded-full border border-blue-200 bg-white px-4 py-2 text-sm text-blue-700 hover:bg-blue-50">Password</button>}
          <button onClick={() => removeUser(user.id)} className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Hapus</button>
        </div>
      </div>)}</div>
    </div>}
    {notification && <div role="status" className={`toast ${notification.leaving ? 'toast-out' : ''} fixed right-5 top-5 z-50 rounded-lg border px-4 py-3 text-sm font-medium text-white shadow-lg ${notification.type === 'error' ? 'border-red-700 bg-red-600' : 'border-green-600 bg-green-500'}`}><span className="mr-2">{notification.type === 'error' ? '✕' : '✓'}</span>{notification.message}</div>}
  </>;
}