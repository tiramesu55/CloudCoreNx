import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Box, Stack } from "@mui/material";
import Warning from "../../../assets/Warning.svg"

export default function WarningLabel() {
    return (

        <Box sx={{ backgroundColor: "#FFFFF0", width: "32em", borderRadius: .5, height: "4em", border: "1.5px solid #EEB20E", borderLeft: "10px solid #EEB20E", }}>
            <Stack direction="row">

                <Typography sx={{ display: "flex", justifyContent: "center" }}>
                    <img src={Warning} alt="warning label" style={{ width: "20px", marginLeft: ".5em" }} /></Typography>

                <Typography sx={{ fontSize: "7.5pt", marginTop: "2.5em", marginLeft: ".5em" }}>Partner Orders will Be Turned Off from <span style={{ fontWeight: "bold" }}>12:00 PM to 4:00 PM</span> due to no electricity</Typography>

                <Typography sx={{ fontSize: "10pt", marginLeft: "-27em", fontWeight: "bold", color: "gold", }}>Warning</Typography>
            </Stack>
        </Box>
    );
}