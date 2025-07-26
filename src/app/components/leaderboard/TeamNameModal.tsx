import { useState } from 'react';
import { formatTime } from '@/app/utils/time';
import styles from './TeamNameModal.module.scss';

interface TeamNameModalProps {
  isOpen: boolean;
  onSubmit: (teamName: string) => void;
  onClose: () => void;
  completionTime: number;
}

export function TeamNameModal({ 
  isOpen, 
  onSubmit, 
  onClose, 
  completionTime 
}: TeamNameModalProps) {
  const [teamName, setTeamName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(teamName.trim());
      setTeamName('');
      onClose();
    } catch (error) {
      console.error('Failed to submit team name:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTeamName('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>🏆 VICTORY!</h2>
          <p>Captain Chaos has been defeated!</p>
        </div>
        
        <div className={styles.timeDisplay}>
          <div className={styles.timeLabel}>Completion Time:</div>
          <div className={styles.time}>{formatTime(completionTime)}</div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="teamName">Team Name:</label>
            <input
              id="teamName"
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter your team name"
              maxLength={50}
              required
              disabled={isSubmitting}
              autoFocus
            />
          </div>
          
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !teamName.trim()}
              className={styles.submitButton}
            >
              {isSubmitting ? 'Adding...' : 'Add to Leaderboard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
