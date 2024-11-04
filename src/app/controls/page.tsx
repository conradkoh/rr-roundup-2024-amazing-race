'use client';
import { EventLog } from '@/app/components/event-log/EventLog';
import { HealthBar } from '@/app/components/health-bar/HealthBar';
import { api } from '@convex/_generated/api';
import { useMutation } from 'convex/react';
import { useCallback, useEffect } from 'react';
import styles from './styles.module.scss';

export default function Controls() {
  const takeDamage = useMutation(api.boss.takeDamage);
  const reset = useMutation(api.boss.reset);
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
    <>
      <h1 className="text-3xl font-bold">Controls</h1>
      <p>
        Click on the control when the boss is hit to cause him to take damage.
      </p>
      <div className="pt-2 flex space-x-2 items-end">
        <div>
          <div className="font-bold text-center">Hotkey: 1</div>
          <button
            id="5-dmg-btn"
            className={`p-2 rounded-md bg-gray-200 ${styles['button']}`}
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
            className={`p-2 rounded-md bg-gray-200 ${styles['button']}`}
            onClick={useCallback(() => {
              takeDamage({ amount: 2 });
            }, [takeDamage])}
          >
            BODY (-2 HP)
          </button>
        </div>

        <div>
          <button
            className="p-2 rounded-md bg-gray-200"
            onClick={useCallback(() => {
              reset();
            }, [reset])}
          >
            RESET
          </button>
        </div>
      </div>
      <h2 className="pt-2 text-2xl font-bold">Preview</h2>
      <HealthBar />
      <EventLog />
    </>
  );
}
