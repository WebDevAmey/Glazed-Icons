import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/Toaster';
import { themeScript } from '@/components/ThemeToggle';
import { SITE } from '@/lib/icons';
import './globals.css';

const description = `${SITE.count} glossy app-tile icons in 18 colours. Recolour any icon, pick its corners, and copy it as SVG, React, Tailwind or plain JS. Free and open source under MIT.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name}: glossy app icons for your interface`, template: `%s | ${SITE.name}` },
  description,
  applicationName: SITE.name,
  keywords: ['icons', 'svg icons', 'react icons', 'app icons', 'glossy icons', 'gradient icons', 'tailwind icons', 'open source icons', 'free icons'],
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: SITE.name, url: '/', title: `${SITE.name}: glossy app icons for your interface`, description, images: [{ url: '/og.png', width: 1200, height: 630, alt: 'A dock of glossy, colourful Glazed icon tiles' }] },
  twitter: { card: 'summary_large_image', title: SITE.name, description, images: ['/og.png'] },
  icons: { icon: '/icon.svg', apple: '/apple-icon.png' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f6f8' },
    { media: '(prefers-color-scheme: dark)', color: '#0e0e12' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
