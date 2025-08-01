"use client";
import { api } from "@convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { calculateCompletionTime } from "@/app/utils/time";
import { useCallback, useEffect, useState, useMemo, useRef, memo } from "react";
import styles from "./styles.module.scss";
import {
  ConditionalRender,
  RenderIfDefined,
} from "@/app/components/condition/ConditionalRender";
import { MainContentSection } from "@/app/components/sections/main-content";
import {
  LeaderboardAdminModal,
  TeamNameModal,
} from "@/app/components/leaderboard";
import { GameTimer } from "@/app/components/game-timer";

// Separate damage section component to isolate re-renders
const DamageSection = memo(function DamageSection({
  takeDamage,
}: {
  takeDamage: (dmg: { amount: number }) => void;
}) {
  const [damageMultiplier, setDamageMultiplier] = useState(2);

  const handleHeadDamage = useCallback(() => {
    takeDamage({ amount: 5 });
  }, [takeDamage]);

  const handleBodyDamage = useCallback(() => {
    takeDamage({ amount: 2 });
  }, [takeDamage]);

  const handleDoubleHeadDamage = useCallback(() => {
    takeDamage({ amount: 5 * damageMultiplier });
  }, [takeDamage, damageMultiplier]);

  const handleDoubleBodyDamage = useCallback(() => {
    takeDamage({ amount: 2 * damageMultiplier });
  }, [takeDamage, damageMultiplier]);

  return (
    <>
      <h2 className="pt-2 text-2xl font-bold">Damage</h2>
      <p>
        Click on the control when the boss is hit to cause him to take damage.
      </p>

      <div className="flex gap-4">
        {/* Basic Damage Buttons */}
        <div className="pt-4 flex flex-col border border-gray-300 rounded-lg p-4 bg-gray-50/30">
          <h3 className="text-lg font-bold mb-2 text-blue-400">Basic Damage</h3>
          <div className="flex-grow" />
          <div className="flex flex-col space-x-2 items-end flex-wrap gap-2">
            <div className="flex gap-4">
              <div>
                <div className="font-bold text-center">Hotkey: 1</div>
                <button
                  id="5-dmg-btn"
                  className={`p-2 font-mono rounded-md bg-gray-200 text-black ${styles["button"]}`}
                  onClick={handleHeadDamage}
                >
                  HEAD (-5 HP)
                </button>
              </div>
              <div>
                <div className="font-bold text-center">Hotkey: 2</div>
                <button
                  id="2-dmg-btn"
                  className={`p-2 font-mono rounded-md bg-gray-200 text-black ${styles["button"]}`}
                  onClick={handleBodyDamage}
                >
                  BODY (-2 HP)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Multiplied Damage Section */}
        <div className="pt-4 border border-orange-300 rounded-lg p-4 bg-orange-50/30">
          <h3 className="text-lg font-bold mb-2 text-orange-300">
            Multiplied Damage
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            The damage multiplier below applies only to hotkeys 3 and 4:
          </p>

          {/* Damage Multiplier Input */}
          <div className="mb-3">
            <label className="block text-sm font-bold mb-1">
              Damage Multiplier:
            </label>
            <input
              type="text"
              value={damageMultiplier}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Allow empty string or valid numbers
                if (
                  inputValue === "" ||
                  (!isNaN(Number(inputValue)) && Number(inputValue) >= 0)
                ) {
                  setDamageMultiplier(
                    inputValue === "" ? 0 : Number(inputValue)
                  );
                }
              }}
              className="p-1 w-20 font-mono rounded border border-orange-300 text-black bg-orange-50"
            />
          </div>

          <div className="flex space-x-2 items-end flex-wrap gap-2">
            <div>
              <div className="font-bold text-center">Hotkey: 3</div>
              <button
                id="double-head-dmg-btn"
                className={`p-2 font-mono rounded-md bg-orange-200 text-black ${styles["button"]}`}
                onClick={handleDoubleHeadDamage}
              >
                HEAD x{damageMultiplier} (-{5 * damageMultiplier} HP)
              </button>
            </div>
            <div>
              <div className="font-bold text-center">Hotkey: 4</div>
              <button
                id="double-body-dmg-btn"
                className={`p-2 font-mono rounded-md bg-orange-200 text-black ${styles["button"]}`}
                onClick={handleDoubleBodyDamage}
              >
                BODY x{damageMultiplier} (-{2 * damageMultiplier} HP)
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default function Controls() {
  const callTakeDamage = useMutation(api.boss.takeDamage);
  const reset = useMutation(api.gameState.reset);
  const callStart = useMutation(api.gameState.start);
  const gameState = useQuery(api.gameState.get);
  const addLeaderboardRecord = useMutation(api.leaderboard.addRecord);

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Ref to track previous game state for detecting transitions
  const previousGameStateRef = useRef<string | null>(null);

  const start = useCallback(() => {
    callStart();
  }, [callStart]);

  const takeDamage = useCallback(
    (dmg: { amount: number }) => {
      if (gameState?.status.type === "started") {
        callTakeDamage(dmg);
      } else {
        start();
        callTakeDamage(dmg);
      }
    },
    [callTakeDamage, gameState?.status.type, start]
  );

  const handleTeamSubmission = useCallback(
    async (teamName: string) => {
      if (gameState?.status.type !== "boss_defeated") return;

      await addLeaderboardRecord({
        teamName,
        gameStartTime: gameState.status.startedAt,
        gameEndTime: gameState.status.defeatedAt,
      });

      setShowTeamModal(false);
    },
    [gameState?.status, addLeaderboardRecord]
  );

  const handleResetClick = useCallback(() => {
    reset();
    setShowTeamModal(false); // Close modal on reset
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
  const isGameStarted = useMemo(
    () => gameState?.status.type === "started",
    [gameState?.status.type]
  );
  const isGameReady = useMemo(
    () => gameState?.status.type === "ready",
    [gameState?.status.type]
  );
  const isBossDefeated = useMemo(
    () => gameState?.status.type === "boss_defeated",
    [gameState?.status.type]
  );

  // Auto-show team modal when state transitions to boss_defeated
  useEffect(() => {
    const currentGameState = gameState?.status.type;
    const previousGameState = previousGameStateRef.current;

    // Only show modal if we just transitioned to boss_defeated (not if we're already in that state)
    if (
      currentGameState === "boss_defeated" &&
      previousGameState !== "boss_defeated" &&
      !showTeamModal
    ) {
      setShowTeamModal(true);
    }

    // Update the ref with current state for next comparison
    previousGameStateRef.current = currentGameState || null;
  }, [gameState?.status.type, showTeamModal]);

  // Memoized computed values
  const completionTime = useMemo(
    () => calculateCompletionTime(gameState),
    [gameState]
  );
  // keyboard shortcuts
  const handleKeyboardShortcuts = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts if user is typing in an input field
    const target = e.target as HTMLElement;
    if (
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable)
    ) {
      return;
    }

    if (e.key === "1") {
      // get 5-dmg-btn and click it
      const btn = document.getElementById("5-dmg-btn");
      if (btn) {
        btn.click();
        btn.classList.add(`${styles["active"]}`);
        setTimeout(() => btn.classList.remove(`${styles["active"]}`), 100);
      }
    }
    if (e.key === "2") {
      const btn = document.getElementById("2-dmg-btn");
      if (btn) {
        btn.click();
        btn.classList.add(`${styles["active"]}`);
        setTimeout(() => btn.classList.remove(`${styles["active"]}`), 100);
      }
    }
    if (e.key === "3") {
      const btn = document.getElementById("double-head-dmg-btn");
      if (btn) {
        btn.click();
        btn.classList.add(`${styles["active"]}`);
        setTimeout(() => btn.classList.remove(`${styles["active"]}`), 100);
      }
    }
    if (e.key === "4") {
      const btn = document.getElementById("double-body-dmg-btn");
      if (btn) {
        btn.click();
        btn.classList.add(`${styles["active"]}`);
        setTimeout(() => btn.classList.remove(`${styles["active"]}`), 100);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboardShortcuts);
    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcuts);
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
              <h2 className="text-2xl font-bold text-green-400">
                ⏱️ Game Timer
              </h2>
              {gameState.status.type === "started" && (
                <GameTimer startTime={gameState.status.startedAt} />
              )}
              {gameState.status.type === "boss_defeated" && (
                <div className="pt-2 text-4xl font-mono font-bold text-yellow-400">
                  {(() => {
                    const elapsed =
                      gameState.status.defeatedAt - gameState.status.startedAt;
                    const seconds = Math.floor(elapsed / 1000);
                    const minutes = Math.floor(seconds / 60);
                    const remainingSeconds = seconds % 60;
                    return `${minutes
                      .toString()
                      .padStart(2, "0")}m${remainingSeconds
                      .toString()
                      .padStart(2, "0")}s (FINAL)`;
                  })()}
                </div>
              )}
            </div>
          </ConditionalRender>

          <h2 className="pt-2 text-2xl font-bold">Game</h2>
          <div className="pt-2 space-x-2">
            <ConditionalRender renderIf={() => isGameReady}>
              <button
                className={`p-2 font-mono font-bold rounded-md bg-gray-200 text-black ${styles["start"]} ${styles["start-stop-btns"]}`}
                onClick={start}
              >
                START
              </button>
            </ConditionalRender>
            <button
              className="p-2 font-mono font-bold rounded-md bg-gray-200 text-black"
              onClick={handleResetClick}
            >
              RESET
            </button>
            <a href="/" target="_blank">
              <button className="p-2 font-mono font-bold rounded-md bg-gray-200 text-black">
                OPEN PRESENTER VIEW
              </button>
            </a>
            <a href="/leaderboard" target="_blank">
              <button className="p-2 font-mono font-bold rounded-md bg-gray-200 text-black">
                VIEW LEADERBOARD
              </button>
            </a>
          </div>

          {/* Add Team to Leaderboard Button */}
          <ConditionalRender renderIf={() => isBossDefeated}>
            <div className="pt-4">
              <h3 className="text-xl font-bold text-green-400">
                🏆 Boss Defeated!
              </h3>
              <div className="pt-2">
                <button
                  className="p-3 font-mono font-bold rounded-md bg-green-200 text-black hover:bg-green-300 transition-colors"
                  onClick={handleTeamModalOpen}
                >
                  ✨ ADD TEAM TO LEADERBOARD
                </button>
              </div>
            </div>
          </ConditionalRender>
          <DamageSection takeDamage={takeDamage} />
          <h2 className="pt-2 text-2xl font-bold">Barrier Control</h2>
          <BarrierControlEmitter />

          {/* Leaderboard Management */}
          <h2 className="pt-4 text-2xl font-bold">Leaderboard Management</h2>
          <div className="pt-2">
            <button
              className="p-2 font-mono font-bold rounded-md bg-red-200 text-black hover:bg-red-300 transition-colors"
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
          {gameState?.status.type === "boss_defeated" && (
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
    return barrierState?.nextTransition.at
      ? new Date(barrierState.nextTransition.at).toISOString()
      : "-";
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
      <div>Barrier State: {barrierState?.barrierState || "-"}</div>
      <div>Next Transition At: {nextTransitionTime}</div>
    </>
  );
}
