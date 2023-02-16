import { Card, CardHeader, Typography, Divider, Stack, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";
import FormularyTable from "./FormularyTable";
import Avatar from '@mui/material/Avatar';
import { deepOrange, deepPurple } from '@mui/material/colors';

const FormularyListHeader = () => {

    const [searchValue, setSearchValue] = useState("")
    const [partner, setPartner] = useState("")

    const changePartner = (event: SelectChangeEvent) => {
        setPartner(event.target.value as string);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value)
    }

    const handleSearch = () => {
        console.log("searching")
    }

    return (
        <Stack direction="row">
            {/* <FormControl sx={{
                height: '40px',
                backgroundColor: 'white',
                "& .MuiInputBase-root": {
                    borderRadius: '2px',
                    fontSize: "10pt",
                }, ml: '0px',
                m: 0,
                minWidth: 120,
                width: '20%',
                marginBottom: '5px !important',
                marginTop: '0px !important'
            }} size="small">
                <Select
                    id="test-select"
                    value={partner}
                    onChange={changePartner}
                    displayEmpty
                    sx={{
                        "& .MuiSvgIcon-root": {
                            color: 'black'
                        },
                    }}
                >
                    <MenuItem value="" sx={{ fontSize: "10pt", backgroundColor: "white", }}>
                        Green Pharmacy

                    </MenuItem>

                    <MenuItem value={10} sx={{ fontSize: "10pt", backgroundColor: "white", }}>New Metro Pharmacy</MenuItem>
                    <MenuItem value={20} sx={{ fontSize: "10pt", backgroundColor: "white", }}>Get Well Pharmacy</MenuItem>

                </Select>
            </FormControl> */}

            <FormControl sx={{
                "& .MuiInputBase-root": {
                    height: '85%',
                    borderRadius: '2px',
                    paddingRight: '13px',
                    backgroundColor: 'white',
                    fontSize: "12pt"
                }, m: 0, marginTop: '0px', width: '45ch', marginBottom: ".5em"
            }} variant="outlined" size="small">
                <OutlinedInput
                    id="outlined-basic"
                    type='text'
                    value={searchValue}
                    onChange={handleChange}
                    placeholder="Search"
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                sx={{
                                    backgroundColor: 'white', color: 'white', height: '32px',
                                    width: "32px",
                                    marginLeft: "35px",
                                    borderRadius: "4px"
                                }}
                                aria-label="toggle password visibility"
                                onClick={handleSearch}
                                onMouseDown={handleSearch}
                                edge="end"
                            >
                                <SearchIcon sx={{ backgroundColor: "#6513F0" }} />
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Search"
                />
            </FormControl>

        </Stack>
    )
}

const FormularyList = () => {
    return (
        <>
            {<FormularyListHeader />}
            < Card raised sx={{ borderRadius: '4px' }}>
                <Stack direction="row" sx={{ marginLeft: "2em", marginTop: "1em", marginBottom: '1em' }}>
                    {/* <Avatar sx={{ bgcolor: "#c0ca33", width: 45, height: 45, fontSize: "14px", fontWeight: "bold" }}>GP</Avatar> */}
                    <Typography sx={{ color: "black", fontWeight: "bold", marginLeft: "-.5em", marginTop: ".2em", fontSize: "15pt" }}>Orlando, Florida</Typography>
                </Stack>
                <Divider variant='fullWidth' sx={{ width: '100%', color: '#F8F8F8' }} />
                <FormularyTable />
            </Card >
        </>
    )
}

export default FormularyList