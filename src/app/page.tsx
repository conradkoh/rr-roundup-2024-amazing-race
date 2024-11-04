'use client';
import Image from 'next/image';
import { useCallback, useState } from 'react';

export default function Home() {
  const [health, setHealth] = useState(100);
  const takeDamage = useCallback(
    (dmg: number) => {
      if (health > 0) {
        setHealth(Math.max(health - dmg, 0));
      }
    },
    [health]
  );
  return (
    <>
      <div className="h-screen w-screen min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
        <main className="h-full w-full">
          <div className="w-full h-full items-center justify-center game-font">
            <div className="text-5xl text-center w-100">
              Captain Chaos&apos; Lair
            </div>
            <div className="h-full flex flex-col justify-center items-center">
              <div className="w-full flex justify-center items-center text-5xl overflow-x-auto">
                <HealthBar health={health} />
              </div>
              <div className="pt-20 w-full text-center flex flex-col items-center">
                <div className="text-xl">DAMAGE CONTROLS</div>
                <div className="pt-3 w-full flex items-center justify-center space-x-3">
                  <button
                    className="p-2 rounded-sm bg-gray-200"
                    onClick={() => takeDamage(5)}
                  >
                    HEAD (-5 HP)
                  </button>
                  <button
                    className="p-2 rounded-sm bg-gray-200"
                    onClick={() => takeDamage(2)}
                  >
                    BODY (-2 HP)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <div>Bethel RR Round Up 2024</div>
        </footer>
      </div>
    </>
  );
}
function asset(name: string) {
  return '/assets/' + name;
}

function HealthBar(props: { health: number }) {
  return (
    <>
      <Image src={asset('heart.png')} alt="Heart" width={100} height={100} />
      <div className="ml-10 health-bar">
        <div className="health-fill" style={{ width: `${props.health}%` }} />
      </div>
      <div className="pl-5 health-text font-[family-name:var(--font-press-start)]">
        {props.health}
      </div>
    </>
  );
}
