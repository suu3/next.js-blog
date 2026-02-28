import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { css, cx } from '@/styled-system/css';
import Gnb from '@/components/gnb';
import MobileScrollControls from '@/components/mobile-scroll-controls';
import Providers from '@/components/providers';
import ThemeBtn from '@/components/theme-btn';
import * as motion from 'framer-motion/client';
import '@/styled-system/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
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
    <html lang="ko" suppressHydrationWarning>
      <body>
        <Providers>
          <header
            className={css({
              position: 'sticky',
              top: 0,
              zIndex: 20,
              borderBottom: '1px solid var(--line)',
              background: 'color-mix(in srgb, var(--surface) 95%, transparent)',
              backdropFilter: 'blur(8px)',
            })}
          >
            <div
              className={css({
                mx: 'auto',
                display: 'flex',
                h: '4rem',
                w: 'full',
                maxW: '64rem',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                px: '1rem',
              })}
            >
              <Link href="/" className={cx('y2k-logo', css({ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '-0.025em' }))}>
                Suu.Blog
              </Link>
              <div className={css({ display: 'flex', alignItems: 'center', gap: '0.5rem' })}>
                <Gnb />
                <ThemeBtn />
              </div>
            </div>
          </header>

          <div className="page-shell">
            <motion.main
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className={css({ mx: 'auto', w: 'full', maxW: '64rem', px: '1rem', py: '2rem' })}
            >
              {children}
            </motion.main>
            <MobileScrollControls />
            <footer className={css({ mt: 'auto', borderTop: '1px solid var(--line)', bg: 'var(--surface)' })}>
              <div
                className={css({
                  mx: 'auto',
                  display: 'flex',
                  h: '5rem',
                  w: 'full',
                  maxW: '64rem',
                  flexDir: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  px: '1rem',
                  fontSize: '0.75rem',
                  color: 'var(--muted)',
                })}
              >
                <p className={css({ fontWeight: '600', color: 'var(--text)' })}>@Suu3</p>
                <p>ⓒ 2024, Built with Gatsby</p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}

