import {
  Backdrop as MaterialBackdrop,
  CircularProgress,
  BackdropProps,
} from '@mui/material';
import { createContext } from 'react';
export const BackDropContext = createContext(null);

interface Props extends BackdropProps {
  open: boolean;
  contextValue?: any;
}
export const Backdrop = (props: Props) => {
  return (
    <BackDropContext.Provider value={props.contextValue}>
      {props.children}
      <MaterialBackdrop
        open={props.open}
        invisible={false}
        sx={{ zIndex: '10', color: 'yellow' }}
      >
        <CircularProgress
          thickness={4}
          size={60}
          disableShrink
          sx={{ color: 'primary', animationDuration: '600ms' }}
          value={100}
        />
      </MaterialBackdrop>
    </BackDropContext.Provider>
  );
};
