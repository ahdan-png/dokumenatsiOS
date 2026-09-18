import './globals.css';
import UiShell from '@/app/ui-shell';

export const metadata = { title: 'Dokumentasi OSIM', description: 'Dokumentasi kegiatan OSIM' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="id"><body className="flex min-h-dvh flex-col overflow-x-hidden">
    <UiShell>{children}</UiShell>
  </body></html>;
}