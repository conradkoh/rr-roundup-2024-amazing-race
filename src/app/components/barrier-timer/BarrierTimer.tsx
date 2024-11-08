import { api } from '@convex/_generated/api';
import { useQuery } from 'convex/react';
import { useEffect, useState } from 'react';
import styles from './BarrierTimer.module.scss';
import Image from 'next/image';
import { asset } from '@/app/utils/assets';

const BUFFER_TIME = 0;
const FRAME_INTERVAL = Math.floor(1000 / 60); // 60 fps

export function BarrierTimer() {
  const gameState = useQuery(api.gameState.get);
  if (gameState === undefined) {
    return <div>Loading...</div>;
  }
  if (gameState.status.type === 'ready') {
    return <div>Game has not started</div>;
  }
  return (
    <BarrierTimerView
      barrierUpInterval={30 * 1000}
      barrierDownInterval={30 * 1000}
      startedAt={Date.now()}
    />
  );
}

function BarrierTimerView(props: {
  barrierUpInterval: number;
  barrierDownInterval: number;
  startedAt: number;
}) {
  const [state, setState] = useState({
    barrierState: 'barrier_up',
    maxTime: props.barrierUpInterval,
    nextTransition: {
      at: props.startedAt + props.barrierUpInterval + BUFFER_TIME,
      nextState: 'barrier_down',
    },
  });
  const [visualState, setVisualState] = useState({
    barrierState: 'barrier_up',
    remainingTime: props.barrierUpInterval,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      // update internal state
      if (currentTime > state.nextTransition.at) {
        setState({
          barrierState: state.nextTransition.nextState,
          maxTime:
            state.nextTransition.nextState === 'barrier_up'
              ? props.barrierUpInterval
              : props.barrierDownInterval,
          nextTransition: {
            at:
              (state.nextTransition.nextState === 'barrier_up'
                ? currentTime + props.barrierUpInterval
                : currentTime + props.barrierDownInterval) + BUFFER_TIME,
            nextState:
              state.nextTransition.nextState === 'barrier_up'
                ? 'barrier_down'
                : 'barrier_up',
          },
        });
      }

      // update visual state
      setVisualState({
        barrierState: state.barrierState,
        remainingTime: Math.min(
          Math.max(state.nextTransition.at - currentTime, 0),
          state.maxTime
        ),
      });
    }, FRAME_INTERVAL);
    return () => {
      clearInterval(interval);
    };
  }, [
    props.barrierDownInterval,
    props.barrierUpInterval,
    state.barrierState,
    state.maxTime,
    state.nextTransition.at,
    state.nextTransition.nextState,
  ]);

  switch (visualState.barrierState) {
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
