import { BarrierTimer } from '@/app/components/barrier-timer';
import { ConditionalRender } from '@/app/components/condition/ConditionalRender';
import { EventLog } from '@/app/components/event-log/EventLog';
import { HealthBar } from '@/app/components/health-bar/HealthBar';
import { VictoryMessage } from '@/app/components/victory-message/VictoryMessage';
import { api } from '@convex/_generated/api';
import { useQuery } from 'convex/react';

export function MainContentSection() {
  const health = useQuery(api.boss.health);
  if (!health) {
    return null;
  }

  return (
    <div className="game-font flex flex-col items-center justify-center">
      <ConditionalRender renderIf={() => health.remainder === 0}>
        <VictoryMessage />
      </ConditionalRender>
      <ConditionalRender renderIf={() => health.remainder > 0}>
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
