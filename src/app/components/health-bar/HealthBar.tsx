import { asset } from '@/app/utils/assets';
import { api } from '@convex/_generated/api';
import { useQuery } from 'convex/react';
import Image from 'next/image';
export function HealthBar() {
  const health = useQuery(api.boss.health);
  if (!health) return null;
  return <HealthBarComponent health={health.remainder} />;
}

/**
 * Health Bar UI Component
 * @param props
 * @returns
 */
export function HealthBarComponent(props: { health: number }) {
  if (props.health === 0) {
    return (
      <div className="w-full flex justify-center items-center text-5xl overflow-x-auto">
        <div className="game-font">GAME OVER</div>
      </div>
    );
  }
  return (
    <div className="w-full flex justify-center items-center text-5xl">
      <Image src={asset('heart.png')} alt="Heart" width={100} height={100} />
      <div className="ml-10 health-bar">
        <div className="health-fill" style={{ width: `${props.health}%` }} />
      </div>
      <div className="pl-5 health-text font-[family-name:var(--font-press-start)]">
        {props.health}
      </div>
    </div>
  );
}
