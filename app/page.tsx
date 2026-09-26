import MenuStack from '@/components/MenuStack';

export default function Home() {
  return (
    <main className="relative flex-1 overflow-hidden bg-gradient-to-br from-sky-950 via-sky-900 to-teal-800 px-4 py-16 text-center text-white md:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-teal-300/15 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.15] [background-image:radial-gradient(rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:26px_26px]" />
      </div>

      <div className="relative">
        <p className="font-semibold tracking-[.2em]">SELAMAT DATANG DI</p>
        <h1 className="mt-5 whitespace-nowrap text-[clamp(1.75rem,8vw,3rem)] font-bold">DOKUMENTASI OSIM</h1>

        <MenuStack />
      </div>
    </main>
  );
}
