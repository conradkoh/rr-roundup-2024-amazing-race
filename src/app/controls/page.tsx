'use client';
import { EventLog } from '@/app/components/event-log/EventLog';
import { HealthBar } from '@/app/components/health-bar/HealthBar';
import { api } from '@convex/_generated/api';
import { useMutation } from 'convex/react';
import { useCallback } from 'react';

export default function Controls() {
  const takeDamage = useMutation(api.boss.takeDamage);
  const reset = useMutation(api.boss.reset);
  return (
    <>
      <h1 className="text-3xl font-bold">Controls</h1>
      <p>
        Click on the control when the boss is hit to cause him to take damage.
      </p>
      <div className="pt-2 flex space-x-2">
        <button
          className="p-2 rounded-md bg-gray-200"
          onClick={useCallback(() => {
            takeDamage({ amount: 5 });
          }, [takeDamage])}
        >
          HEAD (-5 HP)
        </button>
        <button
          className="p-2 rounded-md bg-gray-200"
          onClick={useCallback(() => {
            takeDamage({ amount: 2 });
          }, [takeDamage])}
        >
          BODY (-2 HP)
        </button>

        <button
          className="p-2 rounded-md bg-gray-200"
          onClick={useCallback(() => {
            reset();
          }, [reset])}
        >
          RESET
        </button>
      </div>
      <h2 className="pt-2 text-2xl font-bold">Preview</h2>
      <HealthBar />
      <EventLog />
    </>
  );
}
