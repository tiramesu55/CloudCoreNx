import styles from './component2.module.css';

/* eslint-disable-next-line */
export interface Component2Props {}

export function Component2(props: Component2Props) {
  return (
    <div className={styles['container']}>
            <br/>
      <br/>
      <br/>
      <br/>

      <h1>Welcome to Component2!</h1>
    </div>
  );
}

export default Component2;
