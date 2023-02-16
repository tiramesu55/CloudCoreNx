import { Button, Stack, Box, Typography, IconButton } from "@mui/material"
import { useState } from "react"
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import LabelImage from "../../../assets/lable_img_01.png"
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import "./styles.css";



const LabelSettingsContent = () => {

    return (


        <Stack sx={{ flex: 2, padding: '20px' }}>
            <Stack direction="column" spacing={2}>
                <Grid container spacing={2}>
                    <Grid item md={1} sx={{ display: "flex", justifyContent: "left" }}>

                        <img style={{ width: '65px', height: '65px', border: 'solid black 1px' }} src={LabelImage} alt="tote manifest" />
                    </Grid>
                </Grid>
                <Typography sx={{ fontSize: "6pt", fontWeight: "bold" }}> VIAL LABEL</Typography>
            </Stack>
            <Stack direction="column">
                <img style={{ width: '65px', height: '65px', border: 'solid black 1px' }} src={LabelImage} alt="tote manifest" />
                <Typography sx={{ fontSize: "8pt" }}>PACKAGE LABEL</Typography>
            </Stack>
            <Stack direction="column">
                <img style={{ width: '65px', height: '65px', border: 'solid black 1px' }} src={LabelImage} alt="tote manifest" />
                <Typography sx={{ fontSize: "8pt" }}>SHIPPING MANIFEST</Typography>
            </Stack>
            <Stack direction="column">
                <img style={{ width: '65px', height: '65px', border: 'solid black 1px' }} src={LabelImage} alt="tote manifest" />
                <Typography sx={{ fontSize: "8pt" }}>BAG</Typography>
            </Stack>
            <Stack direction="column">
                <img style={{ width: '65px', height: '65px', border: 'solid black 1px' }} src={LabelImage} alt="tote manifest" />
                <Typography sx={{ fontSize: "8pt" }}>PACKAGE LABEL</Typography>
            </Stack>

        </Stack>


    )
}

export default LabelSettingsContent