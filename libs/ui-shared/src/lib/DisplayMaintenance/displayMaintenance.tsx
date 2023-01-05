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
import moment from 'moment';

interface Props {
    open: boolean;
    handleDisplayMaintenanceDialog: (value: boolean) => void;
    maintenanceStartDate: string;
    maintenanceEndDate: string;
    maintenanceReason?: string;
    fullLockout?: boolean;
    mainApp?: boolean;
    logout?: any;
    underMaintenance?: boolean;
    bypassUser?: boolean;
    application?: string;
    ignoreMaintenance?: () => void;
}

export const DisplayMaintenance = (props: Props) => {
    const theme = useTheme();

    const handleClose = () => {
        if (props.mainApp === true || !props.fullLockout || props.bypassUser || props.underMaintenance === false) {
            if (props?.application === "platform") {
                props.ignoreMaintenance && props.ignoreMaintenance()
            }
            props.handleDisplayMaintenanceDialog(false);
        } else if (props.mainApp === undefined && props.fullLockout === true && props.underMaintenance === true) {
            props.logout();
        }
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
                                {moment(props.maintenanceStartDate).format("hh:mm A (MM/DD/YYYY)")}
                            </Box>
                        </Box>
                        <Box>
                            Maintenance end time : <Box component={"span"} sx={{ color: `${theme.palette.blackFont.main}` }}>
                                {moment(props.maintenanceEndDate).format("hh:mm A (MM/DD/YYYY)")}
                            </Box>
                        </Box>
                        <Box sx={{
                            fontSize: `${theme.typography.body2.fontSize}`,
                            paddingTop: `${theme.spacing(2)}`
                        }}>
                            {props.maintenanceReason}
                        </Box>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose}>
                        {(props.mainApp || !props.fullLockout || !props.underMaintenance || props.bypassUser) ? "CLOSE" : "LOGOUT"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}