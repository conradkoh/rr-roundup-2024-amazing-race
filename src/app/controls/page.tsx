'use client';
import { api } from '@convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { useCallback, useEffect, useState, useMemo } from 'react';
import styles from './styles.module.scss';
import {
  ConditionalRender,
  RenderIfDefined,
} from '@/app/components/condition/ConditionalRender';
import { MainContentSection } from '@/app/components/sections/main-content';
import { LeaderboardAdminModal, TeamNameModal } from '@/app/components/leaderboard';
import { GameTimer } from '@/app/components/game-timer';

export default function Controls() {
  const callTakeDamage = useMutation(api.boss.takeDamage);
  const reset = useMutation(api.gameState.reset);
  const callStart = useMutation(api.gameState.start);
  const gameState = useQuery(api.gameState.get);
  const health = useQuery(api.boss.health);
  const addLeaderboardRecord = useMutation(api.leaderboard.addRecord);
  
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  
  const start = useCallback(() => {
    callStart();
  }, [callStart]);

  const takeDamage = useCallback(
    (dmg: { amount: number }) => {
      if (gameState?.status.type === 'started') {
        callTakeDamage(dmg);
      } else {
        start();
        callTakeDamage(dmg);
      }
    },
    [callTakeDamage, gameState?.status.type, start]
  );

  const handleTeamSubmission = useCallback(async (teamName: string) => {
    if (gameState?.status.type !== 'boss_defeated') return;
    
    await addLeaderboardRecord({
      teamName,
      gameStartTime: gameState.status.startedAt,
      gameEndTime: gameState.status.defeatedAt,
    });
    
    setShowTeamModal(false);
  }, [gameState?.status, addLeaderboardRecord]);

  const handleResetClick = useCallback(() => {
    reset();
  }, [reset]);

  const handleTeamModalOpen = useCallback(() => {
    setShowTeamModal(true);
  }, []);

  const handleTeamModalClose = useCallback(() => {
    setShowTeamModal(false);
  }, []);

  const handleAdminModalOpen = useCallback(() => {
    setShowAdminModal(true);
  }, []);

  const handleAdminModalClose = useCallback(() => {
    setShowAdminModal(false);
  }, []);

  // Memoized computed values
  const isGameStarted = useMemo(() => gameState?.status.type === 'started', [gameState?.status.type]);
  const isGameReady = useMemo(() => gameState?.status.type === 'ready', [gameState?.status.type]);
  const isBossDefeated = useMemo(() => gameState?.status.type === 'boss_defeated', [gameState?.status.type]);
  const handleHeadDamage = useCallback(() => {
    takeDamage({ amount: 5 });
  }, [takeDamage]);

  const handleBodyDamage = useCallback(() => {
    takeDamage({ amount: 2 });
  }, [takeDamage]);

  // Memoized computed values
  const completionTime = useMemo(() => {
    if (gameState?.status.type === 'boss_defeated') {
      return gameState.status.defeatedAt - gameState.status.startedAt;
    }
    return 0;
  }, [gameState?.status]);
  // keyboard shortcuts
  const handleKeyboardShortcuts = useCallback((e: KeyboardEvent) => {
    if (e.key === '1') {
      // get 5-dmg-btn and click it
      const btn = document.getElementById('5-dmg-btn');
      if (btn) {
        btn.click();
        btn.classList.add(`${styles['active']}`);
        setTimeout(() => btn.classList.remove(`${styles['active']}`), 100);
      }
    }
    if (e.key === '2') {
      const btn = document.getElementById('2-dmg-btn');
      if (btn) {
        btn.click();
        btn.classList.add(`${styles['active']}`);
        setTimeout(() => btn.classList.remove(`${styles['active']}`), 100);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardShortcuts);
    return () => {
      window.removeEventListener('keydown', handleKeyboardShortcuts);
    };
  }, [handleKeyboardShortcuts]);
  return (
    <RenderIfDefined
      value={gameState}
      Component={({ value: gameState }) => (
        <>
          <h1 className="text-3xl font-bold">Controls</h1>
          
          {/* Timer Display */}
          <ConditionalRender renderIf={() => isGameStarted || isBossDefeated}>
            <div className="pt-4">
              <h2 className="text-2xl font-bold text-green-400">⏱️ Game Timer</h2>
              {gameState.status.type === 'started' && (
                <GameTimer startTime={gameState.status.startedAt} />
              )}
              {gameState.status.type === 'boss_defeated' && (
                <div className="pt-2 text-4xl font-mono font-bold text-yellow-400">
                  {(() => {
                    const elapsed = gameState.status.defeatedAt - gameState.status.startedAt;
                    const seconds = Math.floor(elapsed / 1000);
                    const minutes = Math.floor(seconds / 60);
                    const remainingSeconds = seconds % 60;
                    return `${minutes.toString().padStart(2, '0')}m${remainingSeconds.toString().padStart(2, '0')}s (FINAL)`;
                  })()}
                </div>
              )}
            </div>
          </ConditionalRender>

          <h2 className="pt-2 text-2xl font-bold">Game</h2>
          <div className="pt-2 space-x-2">
            <ConditionalRender
              renderIf={() => isGameReady}
            >
              <button
                className={`p-2 font-mono font-bold rounded-md bg-gray-200 ${styles['start']} ${styles['start-stop-btns']}`}
                onClick={start}
              >
                START
              </button>
            </ConditionalRender>
            <button
              className="p-2 font-mono font-bold rounded-md bg-gray-200"
              onClick={handleResetClick}
            >
              RESET
            </button>
            <a href="/" target="_blank">
              <button className="p-2 font-mono font-bold rounded-md bg-gray-200">
                OPEN PRESENTER VIEW
              </button>
            </a>
            <a href="/leaderboard" target="_blank">
              <button className="p-2 font-mono font-bold rounded-md bg-gray-200">
                VIEW LEADERBOARD
              </button>
            </a>
          </div>
          
          {/* Add Team to Leaderboard Button */}
          <ConditionalRender renderIf={() => isBossDefeated}>
            <div className="pt-4">
              <h3 className="text-xl font-bold text-green-400">🏆 Boss Defeated!</h3>
              <div className="pt-2">
                <button
                  className="p-3 font-mono font-bold rounded-md bg-green-200 hover:bg-green-300 transition-colors"
                  onClick={handleTeamModalOpen}
                >
                  ✨ ADD TEAM TO LEADERBOARD
                </button>
              </div>
            </div>
          </ConditionalRender>
          <h2 className="pt-2 text-2xl font-bold">Damage</h2>
          <p>
            Click on the control when the boss is hit to cause him to take
            damage.
          </p>
          <div className="pt-2 flex space-x-2 items-end">
            <div>
              <div className="font-bold text-center">Hotkey: 1</div>
              <button
                id="5-dmg-btn"
                className={`p-2 font-mono rounded-md bg-gray-200 ${styles['button']}`}
                onClick={handleHeadDamage}
              >
                HEAD (-5 HP)
              </button>
            </div>
            <div>
              <div className="font-bold text-center">Hotkey: 2</div>
              <button
                id="2-dmg-btn"
                className={`p-2 font-mono rounded-md bg-gray-200 ${styles['button']}`}
                onClick={handleBodyDamage}
              >
                BODY (-2 HP)
              </button>
            </div>
          </div>
          <h2 className="pt-2 text-2xl font-bold">Barrier Control</h2>
          <BarrierControlEmitter />

          {/* Leaderboard Management */}
          <h2 className="pt-4 text-2xl font-bold">Leaderboard Management</h2>
          <div className="pt-2">
            <button
              className="p-2 font-mono font-bold rounded-md bg-red-200 hover:bg-red-300 transition-colors"
              onClick={handleAdminModalOpen}
            >
              🔧 MANAGE LEADERBOARD
            </button>
          </div>

          <h2 className="pt-2 text-2xl font-bold">Preview</h2>
          <div className="pt-8">
            <MainContentSection />
          </div>

          {/* Team Name Modal */}
          {gameState?.status.type === 'boss_defeated' && (
            <TeamNameModal
              isOpen={showTeamModal}
              onSubmit={handleTeamSubmission}
              onClose={handleTeamModalClose}
              completionTime={completionTime}
            />
          )}

          {/* Leaderboard Admin Modal */}
          <LeaderboardAdminModal
            isOpen={showAdminModal}
            onClose={handleAdminModalClose}
          />
        </>
      )}
    ></RenderIfDefined>
  );
}

function BarrierControlEmitter() {
  const barrierState = useQuery(api.barrierState.get);
  const tickToggle = useMutation(api.barrierState.tickToggle);

  const nextTransitionTime = useMemo(() => {
    return barrierState?.nextTransition.at ? new Date(barrierState.nextTransition.at).toISOString() : '-';
  }, [barrierState?.nextTransition.at]);

  useEffect(() => {
    // timely updates - ideally, we want to try to do a fetch as close to the expected update time as possible
    if (!barrierState?.nextTransition.at) {
      return;
    }
    const current = Date.now();
    const timeTillUpdate = barrierState?.nextTransition.at - current;
    const timeout = setTimeout(() => {
      tickToggle();
    }, timeTillUpdate);
    return () => {
      clearTimeout(timeout);
    };
  }, [barrierState?.nextTransition.at, tickToggle]);

  useEffect(() => {
    // This is a fallback in case the timer dies - yet, it is susceptible to delays of up to 1s
    const CHECK_INTERVAL = 3000;
    const interval = setInterval(() => {
      tickToggle();
    }, CHECK_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [tickToggle]);

  return (
    <>
      <div>Barrier State: {barrierState?.barrierState || '-'}</div>
      <div>
        Next Transition At: {nextTransitionTime}
      </div>
    </>
  );
}
