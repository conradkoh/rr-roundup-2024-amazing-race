'use client';
import { EventLog } from '@/app/components/event-log/EventLog';
import { HealthBar } from '@/app/components/health-bar/HealthBar';
import { VictoryMessage } from '@/app/components/victory-message/VictoryMessage';
import { api } from '@convex/_generated/api';
import { useQuery } from 'convex/react';

export default function Home() {
  return (
    <>
      <div className="h-screen w-screen min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
        <main className="h-full w-full">
          <div className="w-full h-full items-center justify-center game-font">
            <div className="text-5xl text-center w-100">
              Captain Chaos&apos; Lair
            </div>
            <div className="h-full flex flex-col justify-center items-center">
              <MainContent />
            </div>
          </div>
        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <div className="bg-gray-100 border border-gray-200 opacity-85 rounded-3xl p-5 fixed bottom-10">
            Bethel RR Round Up 2024
          </div>
        </footer>
      </div>
    </>
  );
}

function MainContent() {
  const health = useQuery(api.boss.health);
  if (!health) {
    return null;
  }
  if (health.remainder === 0) {
    return <VictoryMessage />;
  }
  return (
    <>
      <HealthBar />
      <div className="pt-10"></div>
      <div className="h-1/2 overflow-auto">
        <EventLog />
      </div>
    </>
  );
}
