/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  open: boolean;
  handleClose: (value: boolean) => void;
  url: string;
  title: string;
  height?: string;
  dialogTitle?: string;
}

export const RoadMap = (props: Props) => {
  const theme = useTheme();
  const handleClose = () => {
    props.handleClose(false);
  };
  return (
    <Dialog
      open={props.open}
      fullWidth={true}
      maxWidth="xl"
      transitionDuration={0}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>
        <Box>
          <Typography component="span" variant="h6" fontWeight={'bold'}>
            {props.dialogTitle}
            <IconButton
              sx={{
                position: 'absolute',
                right: theme.spacing(1),
                top: theme.spacing(1),
                color: theme.palette.blackFont.main,
              }}
              onClick={handleClose}
            >
              <CloseIcon fontSize="large" />
            </IconButton>
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={5}>
          <iframe
            src={props.url}
            title={props.title}
            height={props.height}
          ></iframe>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: theme.spacing(2) }}></DialogActions>
    </Dialog>
  );
};
