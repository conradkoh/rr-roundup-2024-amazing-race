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
  return <BarrierTimerView startedAt={Date.now()} />;
}

function BarrierTimerView(props: { startedAt: number }) {
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
          <div className="pt-8">
            BARRIER UP ({(visualState.remainingTime / 1000).toFixed(1)}s left)
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
          <div className="pt-8">
            BARRIER DOWN ({(visualState.remainingTime / 1000).toFixed(1)}s left)
          </div>
        </div>
      );
  }
}
