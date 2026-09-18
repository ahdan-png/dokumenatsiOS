import Link from 'next/link';
import { db } from '@/lib/db';
import TeamManager from '@/components/TeamManager';

export default async function Menu() {
  const users = await db.pddUser.findMany({ orderBy: { username: 'asc' }, select: { id: true, username: true, name: true } });
  return <main className="mx-auto max-w-3xl p-4 md:p-8"><h1 className="text-3xl font-bold">Menu PDD</h1><div className="mt-8 grid gap-4 sm:grid-cols-2"><Link className="glass rounded-xl p-6 transition-all duration-150 ease-in-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300" href="/pdd/dokumentasi">Dokumentasi</Link><Link className="glass rounded-xl p-6 transition-all duration-150 ease-in-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300" href="/pdd/dashboard">Kelola dokumentasi</Link><TeamManager users={users} /></div></main>;
}