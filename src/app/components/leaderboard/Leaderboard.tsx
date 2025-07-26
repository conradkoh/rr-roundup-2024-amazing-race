import { api } from '@convex/_generated/api';
import { useQuery } from 'convex/react';
import { formatTime } from '@/app/utils/time';
import styles from './Leaderboard.module.scss';

interface LeaderboardProps {
  limit?: number;
  showHeader?: boolean;
  className?: string;
  standalone?: boolean;
}

export function Leaderboard({ 
  limit = 10, 
  showHeader = true, 
  className = '',
  standalone = false
}: LeaderboardProps) {
  const records = useQuery(api.leaderboard.getTopRecords, { limit });

  const formatDateTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!records || records.length === 0) {
    return (
      <div className={`${standalone ? styles.standaloneLeaderboard : styles.leaderboard} ${className}`}>
        {showHeader && <h2 className={styles.header}>🏆 Leaderboard</h2>}
        <div className={styles.emptyState}>
          No records yet. Be the first to defeat Captain Chaos!
        </div>
      </div>
    );
  }

  return (
    <div className={`${standalone ? styles.standaloneLeaderboard : styles.leaderboard} ${className}`}>
      {showHeader && <h2 className={styles.header}>🏆 Leaderboard</h2>}
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.rank}>Rank</div>
          <div className={styles.teamName}>Team</div>
          <div className={styles.time}>Time</div>
          <div className={styles.date}>Date</div>
        </div>
        {records.map((record) => (
          <div 
            key={record._id} 
            className={`${styles.tableRow} ${
              record.rank === 1 ? styles.firstPlace : 
              record.rank === 2 ? styles.secondPlace :
              record.rank === 3 ? styles.thirdPlace : ''
            }`}
          >
            <div className={styles.rank}>
              {record.rank === 1 && '🥇'}
              {record.rank === 2 && '🥈'}
              {record.rank === 3 && '🥉'}
              {record.rank > 3 && `#${record.rank}`}
            </div>
            <div className={styles.teamName}>{record.teamName}</div>
            <div className={styles.time}>{formatTime(record.completionTime)}</div>
            <div className={styles.date}>{formatDateTime(record.createdAt)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
