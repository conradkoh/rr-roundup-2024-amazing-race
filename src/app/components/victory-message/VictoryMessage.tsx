import styles from './VictoryMessage.module.scss';
export function VictoryMessage() {
  return <div className={`text-5xl ${styles['victory']}`}>VICTORY! 🏆</div>;
}
