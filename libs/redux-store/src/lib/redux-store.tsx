import styles from './redux-store.module.css';
import { Provider } from 'react-redux';
import { store } from './store';
/* eslint-disable-next-line */
export interface ReduxStoreProps {
  children: any
}

export function ReduxStore({ children }: ReduxStoreProps) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}

export default ReduxStore;
