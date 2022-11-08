import React from 'react';
import { Snackbar as MaterialSnackbar, Box } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface Props {
  type?: string;
  content?: string;
  duration?: number;
  onClose?: () => void
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  }
);

export const Snackbar = (props: Props) => {
  const [open, setOpen] = React.useState(true);

  return (
    <MaterialSnackbar
      open={open}
      autoHideDuration={props.duration ? props.duration : 3000}
      sx={{ width: '50%' }}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      onClose={(event, reason) => {
        if(props.onClose){
          props.onClose();
        }
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
      }}
    >
      {props.type === 'success' ? (
        <Alert severity="success">
          {props.content === 'successMsg' &&
            'Changes were updated successfully'}
          {props.content === 'addUserSuccess' && 'User added successfully.'}
          {props.content === 'addOrganizationSuccess' &&
            'Organization added successfully'}
          {props.content === 'addSiteSuccess' && 'Site added successfully'}
          {props.content === 'updateSuiteSuccess' && 'Suite updated successfully'}
          {props.content === 'deleteSuiteSuccess' &&
            'Suite deleted successfully'}
          {props.content === 'uploadUsersSuccess' &&
            'Users uploaded successfully'}
        </Alert>
      ) : props.type === 'failure' ? (
        <Alert severity="error">
          {props.content === 'errorMsg' && 'Error while updating the changes'}
          {props.content === 'addUserFailure' && 'Error while adding the user.'}
          {props.content === 'addOrganizationFailure' &&
            'Error while adding Organization'}
          {props.content === 'addSiteFailure' && 'Error while adding Site'}
          {props.content === 'uploadUsersError' &&
            'Error while uploading Users'}
            {props.content === 'deleteSuiteFailure' &&
            'Error while deleting suite'}
          {props.content === 'updateSuiteFailure' &&
            'Error while updating suite'}
          {props.content === 'fetchError' &&
            'Error while loading the data, Please try again.'}
        </Alert>
      ) : (
        <Box></Box>
      )}
    </MaterialSnackbar>
  );
};
