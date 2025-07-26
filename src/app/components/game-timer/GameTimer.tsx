import { useEffect, useState } from 'react';

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

  const formatElapsedTime = (startTime: number, currentTime: number): string => {
    const elapsed = currentTime - startTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}m${remainingSeconds.toString().padStart(2, '0')}s`;
  };

  return (
    <div className={`pt-2 text-4xl font-mono font-bold text-yellow-400 ${className}`}>
      {formatElapsedTime(startTime, currentTime)}
    </div>
  );
}
