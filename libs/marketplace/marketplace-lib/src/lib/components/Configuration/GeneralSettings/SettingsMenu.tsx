import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Stack } from "@mui/material";
import Link from '@mui/material/Link';
import WarningLabel from './WarningLabel';

function SettingsMenu() {

    return (

        <Stack direction="row" sx={{ fontSize: "10pt" }} >
            <Stack>
                <Typography sx={{ textAlign: "left", marginLeft: "11em", fontSize: "10pt", fontWeight: "bold" }}>Adam Smith</Typography>
                <Typography sx={{ textAlign: "left", marginLeft: "11em", fontSize: "10pt", fontWeight: "bold" }}><Link>Adam@email.com</Link></Typography>
            </Stack>
            <Typography sx={{ textAlign: "left", marginLeft: "2em", fontSize: "10pt", fontWeight: "bold" }}>4hrs</Typography>
            <Typography sx={{ textAlign: "left", marginLeft: "5em", fontSize: "10pt", fontWeight: "bold" }}>No Electricty</Typography>
            <Typography sx={{ textAlign: "left", marginLeft: "6em", fontSize: "10pt", fontWeight: "bold" }} ><WarningLabel /></Typography>
        </Stack>
    )
}

export default SettingsMenu