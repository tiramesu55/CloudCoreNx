import React from 'react';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from '@mui/material';
import maintenanceIcon from '../assets/maintenanceIcon.svg';

interface Props {
    open : boolean;
    handleDisplayMaintenanceDialog : (value : boolean) => void;
}

const DisplayMiantenance = (props : Props) => {
    const theme = useTheme();

    const handleClose = () => {
       props.handleDisplayMaintenanceDialog(false);
    }

    return (
        <div>
            <Dialog
                open={props.open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth={"sm"}
                fullWidth={true}
            >
                <DialogTitle id="alert-dialog-title">
                    <Box>
                        <Typography
                            component="span"
                            variant="h4"
                            fontWeight={"bold"}
                            sx={{ color: `${theme.palette.blackFont.main}` }}
                        >
                            Under Maintenance:
                            <IconButton
                                sx={{
                                    position: "absolute",
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
                    <DialogContentText id="alert-dialog-description" component={"div"}>
                        <Box>
                            <img src={maintenanceIcon} style={{
                                paddingBottom: `${theme.spacing(2)}`,
                                height: "80px"
                            }} />
                        </Box>
                        <Box>
                            Maintenance start time : <Box component={"span"} sx={{ color: `${theme.palette.blackFont.main}` }}>
                                10:00 AM EST (10/19/2022)
                            </Box>
                        </Box>
                        <Box>
                            Maintenance end time : <Box component={"span"} sx={{ color: `${theme.palette.blackFont.main}` }}>
                                10:00 AM EST (10/20/2022)
                            </Box>
                        </Box>
                        <Box sx={{
                            fontSize: `${theme.typography.body2.fontSize}`,
                            paddingTop: `${theme.spacing(2)}`
                        }}>
                            we are currently facing an issue in our Beta Enterprise Analytics cloud app and will be performing emergency
                            maintenance on the system today.
                        </Box>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose}>
                        CLOSE
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default DisplayMiantenance