import {
  DialogActions,
  DialogContent,
  Button,
  Dialog,
  Box,
  Typography,
} from "@mui/material";
import theme from "../../themes";
import warningImg from "../../images/warning.png";

interface Props {
  open: boolean;
  handleDeleteDialog: (open: boolean) => void;
  handleDelete: () => void;
  orgDomain: string;
}

export const DeleteOrgDomain = (props: Props) => {

  const closeDialog = () => {
    props.handleDeleteDialog(false);
  };

  const deleteOrgDomain = () => {
    props.handleDeleteDialog(false);
    props.handleDelete()
  };

  return (
    <div>
      <Dialog
        sx={{
          "& .MuiDialog-paper": {
            width: "20%",
            maxHeight: 435,
            border: `2px solid red`,
            borderTop: `10px solid red`,
          },
        }}
        open={props.open}

        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ paddingTop: "40px", paddingX: "0px" }}>
          <Box alignItems={"center"} display={"flex"} justifyContent={"center"}>
            <img src={warningImg} alt="warning" />
          </Box>
          <Box>
            <Typography
              component={"span"}
              variant="h5"
              fontWeight={"bold"}
              sx={{
                color: "red",
                paddingTop: "20px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {"Warning"}
            </Typography>
          </Box>
          <Box>
            <Typography
              component={"span"}
              variant="subtitle2"
              color={theme.palette.blackFont.main}
              fontSize={theme.typography.subtitle1.fontSize}
              paddingX="40px"
              paddingTop={"20px"}
              display="flex"
              align="center"
            >
              Are you sure you want to delete domain {props.orgDomain}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: "40px",
            paddingX: "0px",
          }}
        >
          <Button
            onClick={closeDialog}
            sx={{ marginRight: theme.spacing(2), paddingX: theme.spacing(5) }}
            variant="outlined"
          >
            No
          </Button>
          <Button
            onClick={deleteOrgDomain}
            variant="contained"
            color="error"
            sx={{ color: "white", borderRadius: "5px" }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

