import { useEffect, useState } from 'react';
import { formatElapsedTime } from '@/app/utils/time';

interface GameTimerProps {
  startTime: number;
  className?: string;
}

export function GameTimer({ startTime, className = '' }: GameTimerProps) {
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`pt-2 text-4xl font-mono font-bold text-yellow-400 ${className}`}>
      {formatElapsedTime(startTime, currentTime)}
    </div>
  );
}
