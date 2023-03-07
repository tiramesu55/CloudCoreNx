import styled from "@emotion/styled";
import { Switch, SwitchProps, Typography } from "@mui/material";
import React, { useState } from "react";
import { Box, Stack } from "@mui/material";
import SettingsMenu from "./SettingsMenu";
import PartnerOrdersModal from "./GeneralSettingsModal";




const SettingsSwitch = styled((props: SwitchProps) => (

    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 86,
    height: 30,
    padding: 0,
    borderRadius: "15px",
    '& .MuiSwitch-switchBase': {
        padding: 3,
        marginLeft: 41,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(-42px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: '#C62828',
                opacity: 1,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
            '& .MuiSwitch-thumb': {
                boxSizing: 'border-box',
                width: "40px",
                height: "26px",
                marginTop: "-1px",
                display: "flex",
                justifyContent: "center",

                '&:before': {
                    color: '#C62828',
                    content: "'OFF'",
                }
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: "40px",
        height: "26px",
        fontSize: "12px",
        borderRadius: "15px",
        marginTop: "-1px",
        marginLeft: "-.5px",
        '&:before': {
            display: "flex",
            justifyContent: "center",
            color: '#3AC14B',
            content: "'ON'",
        }
    },
    '& .MuiSwitch-track': {
        backgroundColor: "#3AC14B ",
        opacity: 1,
    },
})

);
export default function GeneralSettingsSwitch() {
    const [turnOff, setTurnOff] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [settingsDisplay, setSettingsDisplay] = useState(false)


    const handleClose = (event: any, reason: string) => {

        setTurnOff(true)
        if (reason !== 'backdropClick') {
            setOpen(false)
        }
    }

    const cancelClose = () => {
        setOpen(false)
        setTurnOff(false)
    }

    const updateStatus = () => {
        turnOff === true ? setTurnOff(false) : setTurnOff(true)
        turnOff === true ? setOpen(false) : setOpen(true)
        turnOff === false ? setSettingsDisplay(false) : setSettingsDisplay(false)



    }

    const displayFunction = () => {
        settingsDisplay === false ? setSettingsDisplay(true) : setSettingsDisplay(false)

    }

    return (
        <>
            <Stack direction="row" sx={{ marginBottom: 2, display: "flex" }}>
                <Typography sx={{ fontSize: "10pt", fontWeight: "bold" }}>Accepting Partner Rx Orders</Typography>
                {settingsDisplay === true ?
                    (<><Typography sx={{ fontSize: "10pt", fontWeight: "bold", marginLeft: 6, textAlign: "left" }}>Action By</Typography>
                        <Typography sx={{ fontSize: "10pt", fontWeight: "bold", marginLeft: 11.5 }}>Duration</Typography>
                        <Typography sx={{ fontSize: "10pt", fontWeight: "bold", marginLeft: 7 }}>Reason</Typography>
                        <Typography sx={{ fontSize: "10pt", fontWeight: "bold", marginLeft: 11 }}>Comment</Typography>


                        <Stack direction="row" sx={{ marginBottom: 2, display: "flex" }}></Stack>
                    </>)

                    : null}
            </Stack>
            <Stack direction="row">
                <Box>

                    <SettingsSwitch onClick={() => updateStatus()} checked={turnOff} /></Box>
                {turnOff === true ? <><PartnerOrdersModal updateStatus={updateStatus} handleClose={handleClose} cancelClose={cancelClose} displayFunction={displayFunction} open={open} /> <br /> </> : null}

                {settingsDisplay === true ?

                    <Box><Typography sx={{
                        display: "flex", justifyContent: "center"
                    }}>
                        <SettingsMenu /></Typography>
                    </Box> : null}
            </Stack>
        </>
    )
}



