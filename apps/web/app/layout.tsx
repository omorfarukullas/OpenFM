import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OpenFM | Football Management Simulator',
  description: 'Build your football empire. Manage your club, simulate matches, and compete in leagues.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-200 antialiased selection:bg-emerald-500/30 selection:text-emerald-200`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
