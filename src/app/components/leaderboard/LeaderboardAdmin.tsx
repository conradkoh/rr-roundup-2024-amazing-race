import { api } from '@convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { useState } from 'react';
import { formatTime } from '@/app/utils/time';
import styles from './LeaderboardAdmin.module.scss';
import { Id } from '@convex/_generated/dataModel';

interface LeaderboardRecord {
  _id: string;
  teamName: string;
  completionTime: number;
  gameStartTime: number;
  gameEndTime: number;
  createdAt: number;
}

export function LeaderboardAdmin() {
  const records = useQuery(api.leaderboard.getAll);
  const updateRecord = useMutation(api.leaderboard.updateRecord);
  const deleteRecord = useMutation(api.leaderboard.deleteRecord);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const formatDateTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleEdit = (record: LeaderboardRecord) => {
    setEditingId(record._id);
    setEditingName(record.teamName);
  };

  const handleSave = async () => {
    if (!editingId || !editingName.trim()) return;

    try {
      await updateRecord({
        id: editingId as Id<'leaderboard'>,
        teamName: editingName.trim(),
      });
      setEditingId(null);
      setEditingName('');
    } catch (error) {
      console.error('Failed to update record:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      await deleteRecord({ id: id as Id<'leaderboard'> });
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  };

  if (!records) {
    return <div className={styles.loading}>Loading leaderboard...</div>;
  }

  if (records.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>🔧 Leaderboard Admin</h3>
        <div className={styles.emptyState}>No records to manage.</div>
      </div>
    );
  }

  // Sort records by completion time for ranking
  const sortedRecords = [...records].sort((a, b) => a.completionTime - b.completionTime);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>🔧 Leaderboard Admin</h3>
      <div className={styles.recordCount}>
        Total Records: {records.length}
      </div>
      
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.rank}>Rank</div>
          <div className={styles.teamName}>Team Name</div>
          <div className={styles.time}>Time</div>
          <div className={styles.date}>Date</div>
          <div className={styles.actions}>Actions</div>
        </div>
        
        {sortedRecords.map((record, index) => (
          <div key={record._id} className={styles.tableRow}>
            <div className={styles.rank}>#{index + 1}</div>
            
            <div className={styles.teamName}>
              {editingId === record._id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className={styles.editInput}
                  maxLength={50}
                  autoFocus
                />
              ) : (
                record.teamName
              )}
            </div>
            
            <div className={styles.time}>
              {formatTime(record.completionTime)}
            </div>
            
            <div className={styles.date}>
              {formatDateTime(record.createdAt)}
            </div>
            
            <div className={styles.actions}>
              {editingId === record._id ? (
                <div className={styles.editActions}>
                  <button
                    onClick={handleSave}
                    className={styles.saveButton}
                    disabled={!editingName.trim()}
                  >
                    ✓
                  </button>
                  <button
                    onClick={handleCancel}
                    className={styles.cancelButton}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className={styles.normalActions}>
                  <button
                    onClick={() => handleEdit(record)}
                    className={styles.editButton}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(record._id)}
                    className={styles.deleteButton}
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
