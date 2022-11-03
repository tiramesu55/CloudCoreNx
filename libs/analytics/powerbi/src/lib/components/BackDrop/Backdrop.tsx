import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

interface IBackDrop {
  loadingState: boolean;
}

export const BackdropPowerBi = ({ loadingState }: IBackDrop) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer - 1,
      }}
      open={loadingState}
      style={{
        position: 'absolute',
        backgroundColor: 'white',
      }}
    >
      <CircularProgress color="info" />
    </Backdrop>
  );
}
