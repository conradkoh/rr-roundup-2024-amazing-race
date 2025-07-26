import { api } from '@convex/_generated/api';
import { useQuery } from 'convex/react';
import styles from './VictoryMessage.module.scss';

export function VictoryMessage() {
  const gameState = useQuery(api.gameState.get);
  
  const formatCompletionTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const completionTime = gameState?.status.type === 'boss_defeated' 
    ? gameState.status.defeatedAt - gameState.status.startedAt 
    : 0;

  return (
    <div className="text-center">
      <div className={`text-5xl ${styles['victory']}`}>VICTORY! 🏆</div>
      {gameState?.status.type === 'boss_defeated' && (
        <div className="pt-4 text-3xl font-mono font-bold text-yellow-400">
          Completion Time: {formatCompletionTime(completionTime)}
        </div>
      )}
    </div>
  );
}
