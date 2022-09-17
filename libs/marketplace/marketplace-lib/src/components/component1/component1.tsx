import styles from './component1.module.css';

/* eslint-disable-next-line */
export interface Component1Props {}

export function Component1(props: Component1Props) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Component1!</h1>
    </div>
  );
}

export default Component1;
