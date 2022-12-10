import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material';
import { InputTextWithLabel } from '../../components';

interface Report {
    label: string;
    value: string;
}

interface Props {
    open: boolean,
    selectedReport?: Report,
    handleCloseDialog: () => void,
    handleUpadteReportName: (updatedReport: any) => void
}

const EditReportName = (props: Props) => {
    const [report, setReport] = useState<Report>({ value: "", label: "" });
    const [invalidReportName, setInvalidReportName] = useState(false);
    const theme = useTheme();

    const handleClose = () => {
        props.handleCloseDialog();
        setInvalidReportName(false);
        setReport(props?.selectedReport ? props.selectedReport : { value: "", label: "" });
    }

    const onChangeHandler = (event: any) => {
        if (event.trim() === "") {
            setInvalidReportName(true);
        } else {
            setInvalidReportName(false);
        }
        setReport((report !== undefined) ? { ...report, label: event } : { label: "", value: "" });
    }

    useEffect(() => {
        if (props.selectedReport !== undefined) {
            setReport(props?.selectedReport)
        }
    }, [props?.selectedReport]);

    return (
        <>
            <Dialog
                open={props.open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth={'sm'}
                fullWidth={true}
                sx={{
                    '& .MuiDialog-paper': {
                        backgroundColor: theme.palette.secondary.main
                    }
                }}
            >
                <DialogTitle id="alert-dialog-title" component={"div"}>
                    <Box>
                        <Typography
                            component="span"
                            variant="h4"
                            fontWeight={'bold'}
                            sx={{ color: `${theme.palette.blackFont.main}` }}
                        >
                            Edit Report Name
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
                    <DialogContentText id="alert-dialog-description" component={"div"}>
                        <Box
                            my={4}
                            width={"100%"}
                            sx={{
                                display: "flex",
                                justifyContent: "center"
                            }}
                        >
                            <InputTextWithLabel
                                fieldName='reportName'
                                formWidth="90%"
                                label='Selected Report Name'
                                value={report?.label}
                                changeHandler={onChangeHandler}
                                error={invalidReportName}
                                helperText={
                                    invalidReportName ? "Report Name can not be empty" : ""
                                }
                            />
                        </Box>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        disabled={invalidReportName}
                        onClick={() => { props.handleUpadteReportName(report) }} autoFocus>
                        save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default EditReportName

