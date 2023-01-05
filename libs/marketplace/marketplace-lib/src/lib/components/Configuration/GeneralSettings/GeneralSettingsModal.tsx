import * as React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Box, Stack } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { styled } from '@mui/system';



const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 300,
    p: 2,
    borderRadius: 1,

};

export default function PartnerOrdersModal(props: any) {

    const [value, setValue] = React.useState('Add Custom Reason');
    const [hours, setHours] = React.useState("")
    const [reason, setReason] = React.useState("")



    const StyledModal = styled(Modal)`
  .MuiBackdrop-root {

    background-color: rgba(20, 18, 19, .96)


  }
`;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };
    const turnOffHours = (event: SelectChangeEvent) => {
        setHours(event.target.value);
    };

    const turnOffReason = (event: SelectChangeEvent) => {
        setReason(event.target.value);
    };
    return (
        <div>


            <StyledModal
                open={props.open}
                onClose={props.handleClose}
            >

                <form>
                    <Box sx={style}>
                        <Box>
                            <Typography sx={{ display: "flex", justifyContent: "flex-end", marginTop: -1.5 }}>
                                <Button onClick={props.cancelClose} sx={{ display: "flex", justifyContent: "center", borderRadius: 50, color: "black" }}><CloseIcon /></Button></Typography></Box>

                        <Typography id="modal-modal-title" variant="h6" component="h2">

                            <b>Turn Off Partner Orders</b></Typography>
                        <br />
                        <Stack direction="row" spacing={3}>
                            <Stack direction="column">
                                <Typography sx={{ fontSize: "11pt", marginBottom: 1 }}><b>Site Operator</b></Typography>
                                <input type="text" name="name" placeholder={"Adam Smith"} style={{ width: "20em", height: "2em", borderRadius: 5, border: "1px solid gray", paddingLeft: "1em" }} disabled />

                            </Stack>

                            <Stack direction="column">
                                <Typography sx={{ marginBottom: 1, fontSize: "11pt" }}><b>Turn Off For</b><span style={{ color: 'red', marginLeft: 5, fontSize: "14pt" }}>*</span></Typography>

                                <FormControl >
                                    <Select
                                        value={hours}
                                        onChange={turnOffHours}
                                        sx={{
                                            "& .MuiSvgIcon-root": {
                                                color: 'black'
                                            }, width: "10em", height: "1.7em", borderRadius: .5
                                        }}>

                                        <MenuItem value={4}>4 Hours</MenuItem>
                                        <MenuItem value={8} sx={{ backgroundColor: "#E6D9FC" }}>8 Hours</MenuItem>
                                        <MenuItem value={12}>12 Hours</MenuItem>
                                        <MenuItem value={24} sx={{ backgroundColor: "#E6D9FC" }}>24 Hours</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                        </Stack>


                        <Typography sx={{ marginTop: 2, fontSize: "11pt" }}>
                            <b>Reason to Turn Off Partner Orders:</b><span style={{ color: 'red', marginLeft: 5, fontSize: "14pt" }}>*</span>

                        </Typography>



                        <FormControl >
                            <Select
                                value={reason}
                                onChange={turnOffReason}

                                sx={{
                                    "& .MuiSvgIcon-root": {
                                        color: 'black'
                                    }, width: "16em", height: "1.7em", borderRadius: .5
                                }}>

                                <MenuItem value={"Technical Issues"}>Technical Issues</MenuItem>
                                <MenuItem value={"No Electricity"}>No Electricity</MenuItem>
                                <MenuItem value={"Weather Related"}>Weather Related</MenuItem>
                                <MenuItem value={"Staffing"}>Staffing</MenuItem>
                                <MenuItem value={"Other"}>Other</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            sx={{ width: "100%", height: "2em", fontSize: "7pt", borderRadius: "0px", marginTop: 3 }}

                            id="outlined-basic"
                            multiline
                            maxRows={2}
                            size={"small"}

                            placeholder={value}
                            onChange={handleChange}
                        />

                        <Stack direction="row" spacing={2} sx={{ marginTop: "3em", display: "flex", justifyContent: "right" }}>

                            <Button onClick={() => {
                                props.updateStatus();
                                props.cancelClose();
                            }
                            }
                                variant="outlined" color="success" sx={{ borderRadius: 3, width: "9em" }}>
                                Cancel
                            </Button>
                            <Button onClick={() => {
                                props.handleClose()
                                props.displayFunction()

                            }}
                                variant="contained" color="primary" sx={{ borderRadius: 3, width: "9em", }}>
                                Turn Off
                            </Button>
                        </Stack>

                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>

                        </Typography>
                    </Box>
                </form>
            </StyledModal>

        </div >
    );
}