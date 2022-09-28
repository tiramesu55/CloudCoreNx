import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportIssue: React.FC<Props> = ({ isOpen, onClose: Props }) => {
  const onClose = Props;

  return (
    <div>
      <Dialog
        open={isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle>
          {onClose ? (
            <IconButton
              aria-label="close"
              size="large"
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon fontSize="large" />
            </IconButton>
          ) : null}
          <Box component="span" sx={{ fontSize: "24px" }}>
            Support or Feedback
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box component="span" sx={{ fontSize: "24px", color: "#58595b" }}>
              For Support or Feedback, please send email to : <Box
                component={"a"}
                sx={{ color: "#8141f2", textDecoration: "none" }}
                href="mailto:RyanR@iarx.com"
              >
                RyanR@iarx.com
              </Box>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            sx={{
              marginRight: "16px",
              marginBottom: "16px",
              background: "#8141f2",
              borderRadius: "50px",
              paddingTop: "8px",
              paddingBottom: "8px",
              paddingLeft: "45px",
              paddingRight: "45px",
              fontSize: "16px",
              borderColor : "#8141f2",
              "&:hover": {
                background: "#8141f2",
              },
            }}
            variant="contained"
          >
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
