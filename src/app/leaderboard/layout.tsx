import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leaderboard - Chaos Lair',
  description: 'Hall of Champions - Fastest teams to defeat Captain Chaos',
};

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
