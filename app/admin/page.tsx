import Link from 'next/link';

export default function AdminLanding(){
  return <main className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-sky-900 to-teal-700 px-4 py-24 text-center text-white">
    <p className="font-semibold tracking-[.2em]">SELAMAT DATANG</p>
    <h1 className="mt-5 whitespace-nowrap text-[clamp(1.75rem,8vw,3rem)] font-bold">DOKUMENTASI OSIM</h1>
    <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-4">
      <Link href="/umum" className="rounded-xl bg-white/15 p-5 font-semibold backdrop-blur hover:bg-white/25">Umum</Link>
      <Link href="/panitia/login" className="rounded-xl bg-white/15 p-5 font-semibold backdrop-blur hover:bg-white/25">Panitia</Link>
      <Link href="/pdd/login" className="rounded-xl bg-white/15 p-5 font-semibold backdrop-blur hover:bg-white/25">PDD</Link>
      <Link href="/admin/login" className="rounded-xl bg-white/15 p-5 font-semibold backdrop-blur hover:bg-white/25">Admin</Link>
    </div>
  </main>
}
