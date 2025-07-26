/**
 * Shared utility functions for time formatting and calculations
 */

/**
 * Formats milliseconds into a readable time string (e.g., "05m23s")
 */
export function formatTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}m${remainingSeconds.toString().padStart(2, '0')}s`;
}

/**
 * Formats milliseconds into a time string with colon separator (e.g., "5:23")
 */
export function formatTimeWithColon(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Formats elapsed time between start and current time for live timer display
 */
export function formatElapsedTime(startTime: number, currentTime: number): string {
  const elapsed = currentTime - startTime;
  return formatTime(elapsed);
}

/**
 * Game state interface for type safety
 */
interface GameState {
  status: {
    type: 'ready' | 'started' | 'boss_defeated';
    startedAt?: number;
    defeatedAt?: number;
  };
}

/**
 * Calculates completion time from game state
 */
export function calculateCompletionTime(gameState: GameState | null | undefined): number {
  if (gameState?.status.type === 'boss_defeated' && 
      typeof gameState.status.startedAt === 'number' && 
      typeof gameState.status.defeatedAt === 'number') {
    return gameState.status.defeatedAt - gameState.status.startedAt;
  }
  return 0;
}
