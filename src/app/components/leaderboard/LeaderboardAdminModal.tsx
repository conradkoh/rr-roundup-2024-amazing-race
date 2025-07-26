import { useState } from 'react';
import { LeaderboardAdmin } from './LeaderboardAdmin';
import styles from './LeaderboardAdminModal.module.scss';

interface LeaderboardAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeaderboardAdminModal({ isOpen, onClose }: LeaderboardAdminModalProps) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>🔧 Leaderboard Management</h2>
          <button 
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        
        <div className={styles.content}>
          <LeaderboardAdmin />
        </div>
      </div>
    </div>
  );
}
