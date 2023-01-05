import { Button, Stack, Box, Typography, IconButton } from "@mui/material"
import { useState } from "react"
import ZoomInIcon from '@mui/icons-material/ZoomIn';

const LabelSettingsContent = () => {

    return (
        <Stack direction="row" spacing={2}>
            <Stack sx={{ flex: 2, padding: '20px', }}>
                <Typography sx={{ color: '#000000', letterSpacing: '0px', fontSize: '18px' }}>
                    Label
                </Typography>
                <Stack direction="row">
                    <img style={{ width: '90%', border: 'solid black 1px' }} src={require("../../../assets/lable_img_01.png")} alt="tote manifest" />
                    <Button variant="labelButton">
                        <ZoomInIcon sx={{ color: 'white' }} />
                    </Button>
                </Stack>

            </Stack>
            <Stack sx={{ flex: 1, padding: '20px' }}>
                <Typography sx={{ color: '#000000', letterSpacing: '0px', fontSize: '18px' }}>
                    Tote Manifest
                </Typography>
                <Stack direction="row">
                    <img style={{ border: 'solid black 1px' }} src={require("../../../assets/lable_img_02.png")} alt="tote manifest" />
                    <Button variant="labelButton">
                        <ZoomInIcon sx={{ color: 'white' }} />
                    </Button>
                </Stack>
            </Stack>
        </Stack>

    )
}

export default LabelSettingsContent