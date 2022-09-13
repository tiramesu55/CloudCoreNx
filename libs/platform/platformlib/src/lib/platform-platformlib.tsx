import styles from './platform-platformlib.module.css';

/* eslint-disable-next-line */
export interface PlatformPlatformlibProps {}

export function PlatformPlatformlib(props: PlatformPlatformlibProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to PlatformPlatformlib!</h1>
    </div>
  );
}

export default PlatformPlatformlib;
