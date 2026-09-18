import Link from 'next/link';

const cards = [
  { slug: 'panitia', title: 'Dokumentasi Panitia', description: 'Kelola agenda dan dokumentasi panitia.' },
  { slug: 'umum', title: 'Dokumentasi Umum', description: 'Kelola agenda dan dokumentasi umum.' },
  { slug: 'pdd', title: 'PDD', description: 'Kelola tim dan agenda PDD.' },
];

export default function DashboardMenu({ basePath }: { basePath: string }) {
  return <div className="grid gap-5 sm:grid-cols-3">
    {cards.map(card => <Link key={card.slug} href={`${basePath}/${card.slug}`} className="dashboard-card glass rounded-2xl border border-slate-200 p-5 md:p-6">
      <span className="text-sm font-semibold uppercase tracking-[.16em] text-sky-700">Kelola</span>
      <h2 className="mt-3 text-2xl font-semibold text-slate-900">{card.title}</h2>
      <p className="mt-2 text-sm text-slate-600">{card.description}</p>
      <span className="mt-6 inline-block text-sm font-semibold text-sky-700">Buka →</span>
    </Link>)}
  </div>;
}
