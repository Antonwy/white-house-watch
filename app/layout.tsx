import type { Metadata } from 'next';
import { Geist, Geist_Mono, Scheherazade_New } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const scheherazadeNew = Scheherazade_New({
  variable: '--font-scheherazade-new',
  subsets: ['latin'],
  weight: ['500', '700'],
});

export const metadata: Metadata = {
  title: 'Whitehouse Watch',
  description: 'Whitehouse Watch',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${scheherazadeNew.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
