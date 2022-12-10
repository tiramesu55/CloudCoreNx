import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material';
import { platformStore } from '@cloudcore/redux-store';

interface Props {
  open: boolean;
  handleLeave: (open: boolean) => void;
  suiteName: string;
  handleDelete: () => void;
}

const { useAppDispatch, useAppSelector } = platformStore;

const DeleteSuite = (props: Props) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [suiteName, setSuiteName] = React.useState('');
  //   const token = useAppSelector(selectToken);
  const dispatch = useAppDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    props.handleLeave(false);
  };

  React.useEffect(() => {
    setSuiteName(props.suiteName);
  }, [props.suiteName]);

  return (
    <div>
      <Dialog
        open={props.open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={'sm'}
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">
          <Box>
            <Typography
              component="span"
              variant="h4"
              fontWeight={'bold'}
              sx={{ color: `${theme.palette.blackFont.main}` }}
            >
              Delete Selected Suite
              <IconButton
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: `${theme.palette.blackFont.main}`,
                }}
                onClick={handleClose}
              >
                <CloseIcon fontSize="large" />
              </IconButton>
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box
              color={theme.palette.blackFont.main}
              fontSize={'32px'}
              my={6}
              fontWeight={400}
            >
              {`We will delete "${suiteName}" Suite.`}
            </Box>
            <Box
              color={theme.palette.blackFont.main}
              fontSize={theme.typography.body2.fontSize}
            >
              Please click "Cancel" to go back or click "Delete" to delete
              selected suite
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={props.handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteSuite;
