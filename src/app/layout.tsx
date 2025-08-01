import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.scss";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const pressStart = localFont({
  src: "./fonts/PressStart2P-Regular.ttf",
  variable: "--font-press-start",
  weight: "400 700",
});

export const metadata: Metadata = {
  title: "Boss Fight",
  description: "RR Kids @ Play 2025 Boss Fight",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pressStart.variable} w-screen h-screen antialiased`}
      >
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
