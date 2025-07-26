import { api } from '@convex/_generated/api';
import { useQuery } from 'convex/react';
import { formatTimeWithColon, calculateCompletionTime } from '@/app/utils/time';
import styles from './VictoryMessage.module.scss';

export function VictoryMessage() {
  const gameState = useQuery(api.gameState.get);
  
  const completionTime = calculateCompletionTime(gameState);

  return (
    <div className="text-center">
      <div className={`text-5xl ${styles['victory']}`}>VICTORY! 🏆</div>
      {gameState?.status.type === 'boss_defeated' && (
        <div className="pt-4 text-3xl font-mono font-bold text-yellow-400">
          Completion Time: {formatTimeWithColon(completionTime)}
        </div>
      )}
    </div>
  );
}
