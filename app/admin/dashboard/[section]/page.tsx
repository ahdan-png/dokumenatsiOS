import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import DashboardEditor from '@/app/pdd/dashboard/editor';
import LogoutButton from '@/components/LogoutButton';
import { redirect, notFound } from 'next/navigation';
import { dashboardSectionSlugs } from '@/lib/dashboard';

export default async function AdminSection({ params }: { params: { section: string } }) {
  if (getSession()?.role !== 'admin') redirect('/admin');
  const slug = dashboardSectionSlugs[params.section];
  if (!slug) notFound();
  const section = await db.section.findUnique({ where: { slug }, include: { agendas: true } });
  if (!section) notFound();
  return <main className="mx-auto max-w-5xl space-y-8 p-6 md:p-8">
    <div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">ADMIN / {params.section.toUpperCase()}</p><h1 className="text-2xl font-medium text-black">Kelola {section.name}</h1></div><LogoutButton /></div>
    <DashboardEditor sections={[{ slug: section.slug, name: section.name, link: section.link || '', description: section.description, wallpaperUrl: section.wallpaperUrl, agendas: section.agendas.map(a => ({ ...a, date: a.date?.toISOString() || null })) }]} sectionFilter={section.slug} />
  </main>;
}