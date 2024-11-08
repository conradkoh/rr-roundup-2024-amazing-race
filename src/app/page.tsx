'use client';
import { MainContentSection } from '@/app/components/sections/main-content';

export default function Home() {
  return (
    <>
      <div className="h-screen w-screen min-h-screen pt-8 font-[family-name:var(--font-geist-sans)]">
        <main className="h-full w-full">
          <div className="game-font h-full w-full flex flex-col">
            <div className="text-5xl text-center w-100">
              Captain Chaos&apos; Lair
            </div>
            <div className="pt-10 flex flex-col flex-grow">
              <MainContentSection />
            </div>
          </div>
        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-end">
          <div className="text-sm bg-gray-100 border border-gray-200 opacity-85 rounded-md p-2 fixed bottom-3 opacity-50">
            Bethel RR Round Up 2024
          </div>
        </footer>
      </div>
    </>
  );
}
