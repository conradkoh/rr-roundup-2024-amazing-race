"use client";
import { Leaderboard } from "@/app/components/leaderboard";
import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-[family-name:var(--font-press-start)] p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl text-red-600 mb-4 text-shadow-lg">
            CHAOS LAIR
          </h1>
          <h2 className="text-2xl md:text-3xl text-yellow-400 mb-2">
            🏆 HALL OF CHAMPIONS 🏆
          </h2>
          <p className="text-sm md:text-base text-gray-300">
            Fastest teams to defeat Captain Chaos
          </p>
        </div>

        <div className="flex justify-center" key={refreshKey}>
          <Leaderboard
            limit={20}
            showHeader={false}
            className="w-full max-w-3xl"
            standalone={true}
          />
        </div>

        <div className="text-center mt-8 text-xs text-gray-500">
          RR Kids @ Play 2025 - Amazing Race Boss Fight
        </div>
      </div>
    </div>
  );
}
