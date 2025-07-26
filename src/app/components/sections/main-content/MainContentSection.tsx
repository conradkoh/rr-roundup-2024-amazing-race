import { BarrierTimer } from '@/app/components/barrier-timer';
import { ConditionalRender } from '@/app/components/condition/ConditionalRender';
import { EventLog } from '@/app/components/event-log/EventLog';
import { HealthBar } from '@/app/components/health-bar/HealthBar';
import { Leaderboard } from '@/app/components/leaderboard';
import { VictoryMessage } from '@/app/components/victory-message/VictoryMessage';
import { api } from '@convex/_generated/api';
import { useQuery } from 'convex/react';
import styles from './MainContentSection.module.scss';

export function MainContentSection() {
  const health = useQuery(api.boss.health);
  const gameState = useQuery(api.gameState.get);
  
  if (!health || !gameState) {
    return null;
  }

  const isBossDefeated = gameState.status.type === 'boss_defeated';

  return (
    <div className="game-font flex flex-col items-center justify-center">
      <ConditionalRender renderIf={() => isBossDefeated}>
        <div className={`p-5 ${styles['victory-container']}`}>
          <VictoryMessage />
          <div className="pt-8">
            <Leaderboard limit={5} showHeader={true} />
          </div>
        </div>
      </ConditionalRender>
      <ConditionalRender renderIf={() => !isBossDefeated && health.remainder > 0}>
        <HealthBar />
        <div className="pt-10"></div>
        <BarrierTimer />
        <div className="pt-10"></div>
        <div>
          <EventLog />
        </div>
      </ConditionalRender>
    </div>
  );
}
