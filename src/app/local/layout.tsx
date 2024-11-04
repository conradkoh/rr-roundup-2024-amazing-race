import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Boss Fight - Local',
  description: 'Round Up 2024 Boss Fight - Local',
};

export default function LocalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="h-screen w-screen min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
        {children}
      </div>
    </>
  );
}
