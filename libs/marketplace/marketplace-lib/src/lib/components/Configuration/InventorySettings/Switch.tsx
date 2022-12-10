import styled from "@emotion/styled";
import { colors, lighten, Switch, SwitchProps } from "@mui/material";
import React from "react";

const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 52,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 3,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(26px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: '#6513F0',
                opacity: 1,
                border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#6513F0',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color: colors.grey[100]
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.7
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 20,
        height: 20,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: lighten('#39393D', 0.25),
        opacity: 1,

    },
}));

export const CustomSwitch = (props: SwitchProps) => {
    return (
        <IOSSwitch {...props} />
    )
}

