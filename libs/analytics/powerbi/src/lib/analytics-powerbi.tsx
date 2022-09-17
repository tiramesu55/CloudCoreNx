import styles from './analytics-powerbi.module.css';

/* eslint-disable-next-line */
export interface AnalyticsPowerbiProps {}

export function AnalyticsPowerbi(props: AnalyticsPowerbiProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to AnalyticsPowerbi!</h1>
    </div>
  );
}

export default AnalyticsPowerbi;
