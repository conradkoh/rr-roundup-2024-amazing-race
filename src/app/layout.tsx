import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.scss';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const pressStart = localFont({
  src: './fonts/PressStart2P-Regular.ttf',
  variable: '--font-press-start',
  weight: '400 700',
});

export const metadata: Metadata = {
  title: 'Boss Fight',
  description: 'Round Up 2024 Boss Fight',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pressStart.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
