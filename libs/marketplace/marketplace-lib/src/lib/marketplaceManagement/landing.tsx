import styles from './landing.module.css';

/* eslint-disable-next-line */
export interface LandingProps {}

export function Landing(props: LandingProps) {
  return (
    <div className={styles['container']}>
      <h1>Marketplace Landing</h1>
    </div>
  );
}


