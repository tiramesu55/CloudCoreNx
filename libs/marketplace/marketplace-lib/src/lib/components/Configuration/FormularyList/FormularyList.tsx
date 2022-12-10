import { Card, CardHeader, Typography, Divider, Stack, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";
import FormularyTable from "./FormularyTable";

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
            <Typography component={'span'} sx={{ padding: '5px', fontSize: 16, fontWeight: 600, }}>Formulary List</Typography>
            <FormControl sx={{
                "& .MuiInputBase-root": {
                    height: '65%',
                    borderRadius: '2px',
                    paddingRight: '13px',
                    backgroundColor: 'white'
                }, m: 1, marginTop: '2px', width: '25ch'
            }} variant="outlined" size="small">
                <OutlinedInput
                    id="outlined-adornment-password"
                    type='text'
                    value={searchValue}
                    onChange={handleChange}
                    placeholder="Search"
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                sx={{
                                    backgroundColor: 'white', color: 'black', height: '32px',
                                    width: "32px",
                                    marginLeft: "35px",
                                    borderRadius: "4px"
                                }}
                                aria-label="toggle password visibility"
                                onClick={handleSearch}
                                onMouseDown={handleSearch}
                                edge="end"
                            >
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Search"
                />
            </FormControl>
            <FormControl sx={{
                "& .MuiInputBase-root": {
                    height: '70%',
                    borderRadius: '2px',
                }, ml: 'auto !important',
                m: 1,
                minWidth: 120,
                width: '15%',
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
                    <MenuItem value="">
                        Partner 01
                    </MenuItem>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl>
        </Stack>
    )
}

const FormularyList = () => {
    return (
        < Card raised sx={{ borderRadius: '4px' }}>
            <CardHeader title={<FormularyListHeader />} />
            <Divider variant='fullWidth' sx={{ width: '100%', color: '#F8F8F8' }} />
            <FormularyTable />
        </Card >
    )
}

export default FormularyList