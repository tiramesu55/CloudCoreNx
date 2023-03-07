import React, { useState } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import GeneralSettingsSwitch from "./GeneralSettingsSwitch"
import mockData from "./MockData";
import { styled } from "@mui/material/styles";
import CardHeader from '@mui/material/CardHeader';






export default function GeneralSettings(props: any) {
    const [results, setResults] = useState(mockData);

    function stringToColor(string: string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }

    function stringAvatar(name: string) {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }


    const pharmacyMapper = () => {
        return results.map(function (result: any, index: number) {

            return (

                <Box sx={{ flexGrow: 1, }}>
                    <Card sx={{ margin: 3, borderRadius: .4, boxShadow: 3 }}>
                        <CardContent >

                            <Stack direction="row">
                                <Avatar {...stringAvatar(result.PharmacyName)} style={{ width: 30, height: 30, fontSize: "12px" }} />
                                <Typography sx={{ flexGrow: 1 }}>
                                    <Typography sx={{ marginLeft: 1.5, display: "flex", fontWeight: 'bold', fontSize: "16px" }}>{result.PharmacyName}</Typography>
                                </Typography>

                                <Typography sx={{ display: "flex", alignItems: 'center', fontSize: "13px", textAlign: "left" }}>Contracted Capacity: <Typography sx={{ marginLeft: .5, fontSize: "13px" }}><b>{result.ContractCapacity.toLocaleString()}</b></Typography></Typography>

                                <Typography sx={{ marginLeft: 5, marginRight: 5, color: "lightgray" }}> |</Typography>

                                <Typography sx={{ display: "flex", alignItems: 'center', fontSize: "13px" }}>No. of Rxs Filled: <Typography sx={{ marginLeft: .5, fontSize: "13px" }}><b>{result.rxFilled.toLocaleString()}</b></Typography></Typography><Divider orientation="vertical" />

                                <Typography sx={{ marginLeft: 5, marginRight: 5, color: "lightgray" }}> | </Typography>

                                <Typography sx={{ display: "flex", alignItems: 'center', fontSize: "13px", marginRight: 3, }}>Available Capacity: <Typography sx={{ marginLeft: .5, fontSize: "13px" }}><b>{(result.ContractCapacity - result.rxFilled).toLocaleString()}</b></Typography></Typography>


                            </Stack>

                            <Divider variant='fullWidth' sx={{ marginTop: 2, marginBottom: 2, marginLeft: -5, marginRight: -10 }} />
                            <GeneralSettingsSwitch />
                        </CardContent>
                    </Card>
                </Box >

            );
        });
    };


    return <div>{pharmacyMapper()}</div>;
}









