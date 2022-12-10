import React from 'react';
import { Snackbar as MaterialSnackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

type SnackTypes = 'success' | 'info' | 'error' | 'warning';

interface Props {
  type?: SnackTypes;
  content?: string;
  open: boolean;
  duration?: number;
  onClose?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Snackbar = (props: Props) => {
  const { type, content, open, duration, onClose } = props;
  return (
    <MaterialSnackbar
      open={open}
      autoHideDuration={duration ? duration : 3000}
      sx={{ width: '50%' }}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      onClose={(event, reason) => {
        if (onClose) {
          onClose();
        }
        if (reason === 'clickaway') {
          return;
        }
        return;
      }}
    >
      <Alert severity={type ? type : 'error'}>{content}</Alert>
    </MaterialSnackbar>
  );
};
