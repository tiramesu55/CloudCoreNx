import { Route, Link } from 'react-router-dom';

import styles from './powerbi.module.css';

/* eslint-disable-next-line */
export interface PowerbiProps {}

export function Powerbi(props: PowerbiProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Powerbi!</h1>

      <ul>
        <li>
          <Link to="/">powerbi root</Link>
        </li>
      </ul>
      {/* <Route path="/" element={<div>This is the powerbi root route.</div>} /> */}
    </div>
  );
}

export default Powerbi;
