import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import Gnb from '@/components/gnb';
import ThemeBtn from '@/components/theme-btn';
import './globals.css';

export const metadata: Metadata = {
  title: 'Suu.Blog',
  description: 'Suu3 기술 블로그',
  metadataBase: new URL('https://suu3.github.io'),
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicons/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicons/favicon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/favicons/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicons/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/favicons/favicon-192x192.png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#ff6737',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="light" data-theme="light">
        <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--surface)]/95 backdrop-blur">
          <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-3 px-4">
            <Link href="/" className="y2k-logo text-xl font-black tracking-tight">
              Suu.Blog
            </Link>
            <div className="flex items-center gap-2">
              <Gnb />
              <ThemeBtn />
            </div>
          </div>
        </header>

        <div className="page-shell">
          <main className="mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
          <footer className="mt-auto border-t border-[var(--line)] bg-[var(--surface)]">
            <div className="mx-auto flex h-20 w-full max-w-5xl flex-col items-center justify-center gap-1 px-4 text-xs text-[var(--muted)]">
              <p className="font-semibold text-[var(--text)]">@Suu3</p>
              <p>© 2024, Built with Gatsby</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
