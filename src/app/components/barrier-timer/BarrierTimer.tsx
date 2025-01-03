import { api } from '@convex/_generated/api';
import { useQuery } from 'convex/react';
import { useEffect, useState } from 'react';
import styles from './BarrierTimer.module.scss';
import Image from 'next/image';
import { asset } from '@/app/utils/assets';

const FRAME_INTERVAL = Math.floor(1000 / 60); // 60 fps

export function BarrierTimer() {
  const gameState = useQuery(api.gameState.get);
  if (gameState === undefined) {
    return <div>Loading...</div>;
  }
  if (gameState.status.type === 'ready') {
    return <div>Game has not started</div>;
  }
  return <BarrierTimerView />;
}

function BarrierTimerView() {
  const state = useQuery(api.barrierState.get);
  const [visualState, setVisualState] = useState<{
    barrierState: 'barrier_up' | 'barrier_down';
    remainingTime: number;
  }>();

  useEffect(() => {
    const interval = setInterval(() => {
      if (state) {
        const currentTime = Date.now();
        // update visual state
        setVisualState({
          barrierState: state.barrierState,
          remainingTime: Math.min(
            Math.max(state.nextTransition.at - currentTime, 0),
            state.maxTime
          ),
        });
      }
    }, FRAME_INTERVAL);
    return () => {
      clearInterval(interval);
    };
  }, [state]);

  switch (visualState?.barrierState) {
    case 'barrier_up':
      return (
        <div className="flex flex-col items-center justify-center">
          <Image
            src={asset('barrier-up.png')}
            alt={'barrier-up'}
            width={300}
            height={300}
            className={`${styles['barrier-icon']}`}
          />
          <div className="pt-8 text-4xl">BARRIER UP</div>
          <div>({(visualState.remainingTime / 1000).toFixed(1)}s left)</div>
          <div className="pt-4 font-mono text-lg text-center">
            Phew! You&apos;re safe. Use this chance to shoot Captain Chaos!
          </div>
        </div>
      );
    case 'barrier_down':
      return (
        <div className="flex flex-col items-center justify-center">
          <Image
            src={asset('barrier-down.png')}
            alt={'barrier-down'}
            width={300}
            height={300}
            className={`${styles['barrier-icon']}`}
          />
          <div className="pt-8 text-4xl">BARRIER DOWN</div>
          <div>({(visualState.remainingTime / 1000).toFixed(1)}s left)</div>
          <div className="pt-4 font-mono text-lg text-center">
            Captain Chaos is loose! Run for your life and regather your ammo!
          </div>
        </div>
      );
  }
}
