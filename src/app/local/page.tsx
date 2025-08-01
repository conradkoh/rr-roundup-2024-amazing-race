"use client";
import { HealthBarComponent } from "@/app/components/health-bar/HealthBar";
import { VictoryMessage } from "@/app/components/victory-message/VictoryMessage";
import { useCallback, useEffect, useState } from "react";
import styles from "./styles.module.scss";

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
  // keyboard shortcuts
  useEffect(() => {
    // press 1 for head shot
    const eventHandler = (e: KeyboardEvent) => {
      if (e.key === "1") {
        // get 5-dmg-btn and click it
        const btn = document.getElementById("5-dmg-btn");
        if (btn) {
          btn.click();
          btn.classList.add(`${styles["active"]}`);
          setTimeout(() => btn.classList.remove(`${styles["active"]}`), 100);
        }
      }
      if (e.key === "2") {
        const btn = document.getElementById("2-dmg-btn");
        if (btn) {
          btn.click();
          btn.classList.add(`${styles["active"]}`);
          setTimeout(() => btn.classList.remove(`${styles["active"]}`), 100);
        }
      }
    };
    window.addEventListener("keydown", eventHandler);
    return () => {
      window.removeEventListener("keydown", eventHandler);
    };
  }, [takeDamage]);
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
                <MainContent health={health} />
              </div>
              <div className="pt-20 w-full text-center flex flex-col items-center">
                <div className="text-xl">DAMAGE CONTROLS</div>
                <div className="pt-3 w-full flex items-end justify-center space-x-3">
                  <div>
                    <div className="font-bold text-center">Hotkey: 1</div>
                    <button
                      id="5-dmg-btn"
                      className={`p-2 rounded-sm bg-gray-200 ${styles["button"]}`}
                      onClick={() => takeDamage(5)}
                    >
                      HEAD (-5 HP)
                    </button>
                  </div>
                  <div>
                    <div className="font-bold text-center">Hotkey: 2</div>
                    <button
                      id="2-dmg-btn"
                      className={`p-2 rounded-sm bg-gray-200 ${styles["button"]}`}
                      onClick={() => takeDamage(2)}
                    >
                      BODY (-2 HP)
                    </button>
                  </div>
                  <button
                    className={`p-2 rounded-sm bg-gray-200 ${styles["button"]}`}
                    onClick={useCallback(() => {
                      setHealth(100);
                    }, [])}
                  >
                    RESET
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <div>RR Kids @ Play 2025</div>
        </footer>
      </div>
    </>
  );
}

function MainContent(props: { health: number }) {
  if (props.health === 0) {
    return <VictoryMessage />;
  }
  return (
    <>
      <HealthBarComponent health={props.health} />
    </>
  );
}
