import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'EPFO, made clearer — Service prototype',
    template: '%s · EPFO service prototype',
  },
  description: 'A task-first, accessible prototype for finding EPFO employee, employer and pensioner services and understanding official portal handoffs. Synthetic data only.',
  applicationName: 'EPFO service experience prototype',
  keywords: ['EPFO services', 'UAN', 'EPF passbook', 'EPF claim', 'EPF transfer', 'pension services', 'employer ECR'],
  authors: [{ name: 'EPFO experience improvement project' }],
  creator: 'EPFO experience improvement project',
  category: 'public service prototype',
  robots: { index: false, follow: false, nocache: true },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    title: 'EPFO, made clearer',
    description: 'A task-first service experience prototype. Synthetic data only.',
    siteName: 'EPFO service experience prototype',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'EPFO, made clearer — Prototype, synthetic data only' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EPFO, made clearer',
    description: 'A task-first service experience prototype. Synthetic data only.',
    images: ['/og.png'],
  },
  icons: { icon: '/og.png' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
