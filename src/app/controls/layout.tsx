import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boss Fight - Controls",
  description: "RR Kids @ Play 2025 Boss Fight - Controls",
};
export default function ControlsLayout({
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
