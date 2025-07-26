'use client';
import { ConditionalRender } from '@/app/components/condition/ConditionalRender';
import { MainContentSection } from '@/app/components/sections/main-content';
import { api } from '@convex/_generated/api';
import { useQuery } from 'convex/react';

export default function Home() {
  const gameState = useQuery(api.gameState.get);
  if (gameState === undefined) {
    // return <div>Loading...</div>;
    return <></>;
  }
  return (
    <>
      {/* Waiting Room Screen */}
      <div
        className={`top-0 left-0 waiting-room-root h-screen w-screen flex flex-col items-center justify-center ${gameState.status.type === 'started' || gameState.status.type === 'boss_defeated' ? 'fadeout' : ''}`}
      >
        <div className="text-red-600 game-font text-9xl text-shadow-lg p-5 pb-1 rounded-md">
          CHAOS LAIR
        </div>
      </div>
      {/* Main Screen */}
      <ConditionalRender renderIf={() => gameState.status.type === 'started' || gameState.status.type === 'boss_defeated'}>
        <div
          className={`top-0 left-0 h-screen w-screen min-h-screen pt-8 font-[family-name:var(--font-geist-sans)] fadein`}
        >
          <main className="h-full w-full">
            <div className="game-font h-full w-full flex flex-col">
              <div className="text-5xl text-center w-100">Captain Chaos</div>
              <div className="pt-10 flex flex-col flex-grow">
                <MainContentSection />
              </div>
            </div>
          </main>
          <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-end">
            <div className="text-sm bg-gray-100 border border-gray-200 rounded-md p-2 fixed bottom-3 opacity-50">
              Bethel RR Round Up 2024
            </div>
          </footer>
        </div>
      </ConditionalRender>
    </>
  );
}
