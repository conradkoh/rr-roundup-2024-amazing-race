'use client';
import { api } from '@convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { useCallback, useEffect, useRef } from 'react';
import styles from './styles.module.scss';
import {
  ConditionalRender,
  RenderIfDefined,
} from '@/app/components/condition/ConditionalRender';
import { MainContentSection } from '@/app/components/sections/main-content';

export default function Controls() {
  const callTakeDamage = useMutation(api.boss.takeDamage);
  const reset = useMutation(api.gameState.reset);
  const callStart = useMutation(api.gameState.start);
  const stop = useMutation(api.gameState.stop);
  const gameState = useQuery(api.gameState.get);
  const start = useCallback(() => {
    callStart();
  }, [callStart]);
  const takeDamage = useCallback(
    (dmg: { amount: number }) => {
      if (gameState?.status.type === 'started') {
        callTakeDamage(dmg);
      } else {
        start();
        callTakeDamage(dmg);
      }
    },
    [callTakeDamage, gameState?.status.type]
  );
  // keyboard shortcuts
  useEffect(() => {
    // press 1 for head shot
    const eventHandler = (e: KeyboardEvent) => {
      if (e.key === '1') {
        // get 5-dmg-btn and click it
        const btn = document.getElementById('5-dmg-btn');
        if (btn) {
          btn.click();
          btn.classList.add(`${styles['active']}`);
          setTimeout(() => btn.classList.remove(`${styles['active']}`), 100);
        }
      }
      if (e.key === '2') {
        const btn = document.getElementById('2-dmg-btn');
        if (btn) {
          btn.click();
          btn.classList.add(`${styles['active']}`);
          setTimeout(() => btn.classList.remove(`${styles['active']}`), 100);
        }
      }
    };
    window.addEventListener('keydown', eventHandler);
    return () => {
      window.removeEventListener('keydown', eventHandler);
    };
  }, [takeDamage]);
  return (
    <RenderIfDefined
      value={gameState}
      Component={({ value: gameState }) => (
        <>
          <h1 className="text-3xl font-bold">Controls</h1>
          <h2 className="pt-2 text-2xl font-bold">Game</h2>
          <div className="pt-2 space-x-2">
            <ConditionalRender
              renderIf={() => gameState.status.type === 'ready'}
            >
              <button
                className={`p-2 font-mono font-bold rounded-md bg-gray-200 ${styles['start']} ${styles['start-stop-btns']}`}
                onClick={useCallback(() => {
                  start();
                }, [gameState.status.type, start, stop])}
              >
                START
              </button>
            </ConditionalRender>
            <ConditionalRender
              renderIf={() => gameState.status.type === 'started'}
            >
              {/* STOP BUTTON */}
              <button
                className={`p-2 font-mono font-bold rounded-md bg-gray-200 ${styles['stop']} ${styles['start-stop-btns']}`}
                onClick={useCallback(() => {
                  stop();
                }, [stop])}
              >
                STOP
              </button>
            </ConditionalRender>
            <button
              className="p-2 font-mono font-bold rounded-md bg-gray-200"
              onClick={useCallback(() => {
                reset();
              }, [reset])}
            >
              RESET
            </button>
          </div>
          <h2 className="pt-2 text-2xl font-bold">Damage</h2>
          <p>
            Click on the control when the boss is hit to cause him to take
            damage.
          </p>
          <div className="pt-2 flex space-x-2 items-end">
            <div>
              <div className="font-bold text-center">Hotkey: 1</div>
              <button
                id="5-dmg-btn"
                className={`p-2 font-mono rounded-md bg-gray-200 ${styles['button']}`}
                onClick={useCallback(() => {
                  takeDamage({ amount: 5 });
                }, [takeDamage])}
              >
                HEAD (-5 HP)
              </button>
            </div>
            <div>
              <div className="font-bold text-center">Hotkey: 2</div>
              <button
                id="2-dmg-btn"
                className={`p-2 font-mono rounded-md bg-gray-200 ${styles['button']}`}
                onClick={useCallback(() => {
                  takeDamage({ amount: 2 });
                }, [takeDamage])}
              >
                BODY (-2 HP)
              </button>
            </div>
          </div>
          <h2 className="pt-2 text-2xl font-bold">Barrier Control</h2>
          <BarrierControlEmitter />

          <h2 className="pt-2 text-2xl font-bold">Preview</h2>
          <div className="pt-8">
            <MainContentSection />
          </div>
        </>
      )}
    ></RenderIfDefined>
  );
}

function BarrierControlEmitter() {
  const barrierState = useQuery(api.barrierState.get);
  const tickToggle = useMutation(api.barrierState.tickToggle);
  const lastState = useRef<any | undefined>(undefined);
  useEffect(() => {
    lastState.current = barrierState; //update whenever the barrier state changes
  }, []);

  useEffect(() => {
    // timely updates - ideally, we want to try to do a fetch as close to the expected update time as possible
    if (!barrierState?.nextTransition.at) {
      return;
    }
    const current = Date.now();
    const timeTillUpdate = barrierState?.nextTransition.at - current;
    const timeout = setTimeout(() => {
      tickToggle();
    }, timeTillUpdate);
    return () => {
      clearTimeout(timeout);
    };
  }, [barrierState?.nextTransition.at]);

  useEffect(() => {
    // This is a fallback in case the timer dies - yet, it is susceptible to delays of up to 1s
    const CHECK_INTERVAL = 3000;
    const interval = setInterval(() => {
      tickToggle();
    }, CHECK_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <>
      <div>Barrier State: {barrierState?.barrierState || '-'}</div>
      <div>
        Next Transition At:{' '}
        {barrierState?.nextTransition.at
          ? new Date(barrierState?.nextTransition.at).toISOString()
          : '-'}
      </div>
    </>
  );
}
