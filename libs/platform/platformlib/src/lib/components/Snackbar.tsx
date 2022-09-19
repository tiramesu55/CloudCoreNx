import React from "react";
import { Snackbar as MaterialSnackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

interface Props {
  type?: string;
  content?: string;
  duration?: number;
}

export const Snackbar = (props: Props) => {
  const [open, setOpen] = React.useState(true);
  const Alert: any = React.forwardRef(function Alert(props, ref: any) {
    return <MuiAlert elevation={6} variant="filled" ref={ref} {...props} />;
  });

  return (
    <MaterialSnackbar
        open={open}
        autoHideDuration={props.duration ? props.duration : 3000}
        sx={{ width: "50%" }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={(event, reason) => {
          if (reason === "clickaway") {
            return;
          }
          setOpen(false);
        }}
      >
        {props.type === "success" ? (
          <Alert severity="success">
            {props.content === "editUserSuccess" &&
              "Changes were updated successfully."}
            {props.content === "addUserSuccess" && "User added successfully."}          
            {props.content === "editOrganizationSuccess" && "Changes were updated successfully"}
            {props.content === "addOrganizationSuccess" && "Organization added successfully"}
            {props.content === "editSiteSuccess" && "Changes were updated successfully"}
            {props.content === "addSiteSuccess" && "Site added successfully"}
          </Alert>
        ) : props.type === "failure" ? (
          <Alert severity="error">
            {props.content === "editUserFailure" &&
              "Error while updating the changes."}
            {props.content === "addUserFailure" &&
              "Error while adding the user."}
              {
                props.content === "editOrganizationFailure" && "Error while updating the changes"
              }
              {
                props.content === "addOrganizationFailure" && "Error while adding Organization"
              }
              {
                props.content === "editSiteFailure" && "Error while updating the changes"
              }
              {
                props.content === "addSIteFailure" && "Error while adding Site"
              }
          </Alert>
        ) : props.type === "fetchError" ? (
          <Alert severity="error">
            Error while loading the data, Please try again.
          </Alert>
        ) : (
          <span/>
        )}
      </MaterialSnackbar>
  );
};

