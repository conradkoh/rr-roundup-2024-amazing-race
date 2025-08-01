import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boss Fight - Local",
  description: "RR Kids @ Play 2025 Boss Fight - Local",
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
