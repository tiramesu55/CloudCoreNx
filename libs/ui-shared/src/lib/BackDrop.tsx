import {
  Backdrop as MaterialBackdrop,
  CircularProgress,
  BackdropProps,
} from '@mui/material';

interface Props extends BackdropProps {
  open: boolean;
  contextValue?: any;
}
export const Backdrop = (props: Props) => {
  return (
    <MaterialBackdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer - 1,   //@is drawer an internal subcomponent of backdrop?
      }}
      open={props.open}
      style={{
        position: 'absolute',
        backgroundColor: 'white',
      }}
    >
             <CircularProgress
          thickness={4}
          size={60}
          disableShrink
          sx={{ color: 'primary', animationDuration: '600ms' }}
          value={100}
        />
    </MaterialBackdrop>
  );
}

