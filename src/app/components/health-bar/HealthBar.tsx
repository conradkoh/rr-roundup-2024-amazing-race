import { asset } from '@/app/utils/assets';
import Image from 'next/image';
export function HealthBar() {
  return <HealthBarComponent health={100} />;
}

/**
 * Health Bar UI Component
 * @param props
 * @returns
 */
export function HealthBarComponent(props: { health: number }) {
  return (
    <div className="w-full flex justify-center items-center text-5xl overflow-x-auto">
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
