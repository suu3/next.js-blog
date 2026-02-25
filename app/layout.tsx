import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
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
      <body>
        <header className="sticky top-0 z-20 border-b border-[#2a2b31] bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
            <Link href="/" className="text-xl font-black tracking-tight">
              Suu.Blog
            </Link>
            <nav className="flex items-center gap-2 text-sm font-medium">
              <Link href="/" className="rounded-md border border-[#2a2b31] px-3 py-1.5 hover:bg-[#ffddca]">
                홈
              </Link>
              <Link
                href="/category"
                className="rounded-md border border-[#2a2b31] px-3 py-1.5 hover:bg-[#ffddca]"
              >
                카테고리
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
