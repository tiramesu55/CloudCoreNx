import { Box, FormControl, Select, MenuItem, SelectChangeEvent, IconButton, InputAdornment, OutlinedInput, Stack, Typography, darken, Divider, useTheme, lighten, Tooltip } from "@mui/material"
import { useState } from "react"
import mockBusinessRules from "../../../mocks/BusinessRules"
import SearchIcon from '@mui/icons-material/Search';
import MockInventorySettings, { IPartnerInventorySetting } from "../../../mocks/InventorySettings"
import ConfigurationCard from "../ConfigurationCard/ConfigurationCard";
import EditIcon from '@mui/icons-material/Edit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


const BusinessRules = () => {

    const theme = useTheme();

    const [partner, setPartner] = useState(MockInventorySettings.data[0].name)
    const [searchValue, setSearchValue] = useState("")

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
        <Box>
            <Stack direction="row" spacing={2.5}>
                <FormControl sx={{
                    "& .MuiInputBase-root": {
                        height: '70%',
                        borderRadius: '2px',
                        backgroundColor: 'white'
                    }, minWidth: 200, width: '15%', marginBottom: '5px !important'
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
                        {MockInventorySettings.data.map((data: IPartnerInventorySetting) => {
                            return (
                                <MenuItem value={data.name}>
                                    {data.name}
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>

                <FormControl sx={{
                    "& .MuiInputBase-root": {
                        height: '65%',
                        borderRadius: '2px',
                        paddingRight: '13px',
                        backgroundColor: 'white'
                    }, m: 1, width: '35ch'
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
                                    disabled
                                    sx={{
                                        backgroundColor: '#6513F0', color: 'white', height: '30px',
                                        width: "30px",
                                        marginLeft: "35px",
                                        borderRadius: "2px",

                                        "&:hover": {
                                            backgroundColor: lighten('#6513F0', .25)
                                        }
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
            </Stack>
            <ConfigurationCard color={MockInventorySettings.data[0].color} initials={MockInventorySettings.data[0].initials} name={MockInventorySettings.data[0].name}>
                <Stack>
                    <Box sx={{ padding: '16px' }}>

                        <Stack direction="row" sx={{ bgcolor: darken('#F8F8F8', .05), height: '42px' }} paddingLeft={2.5} paddingRight={2.5}>
                            <Typography variant="businessText" sx={{ width: '3%' }}>No.</Typography>
                            <Typography variant="businessText" sx={{ width: '50%' }}>Rule</Typography>
                            <Typography variant="businessText" sx={{ width: '3%', mr: '5%' }}>Value</Typography>
                            <Typography variant="businessText" sx={{ width: '3%' }}> Action</Typography>
                        </Stack>


                        {mockBusinessRules.map((data) => {
                            return (
                                <Box>
                                    <Stack sx={{ height: '42px' }} direction="row" paddingLeft={2.5} paddingRight={2.5}>
                                        <Typography variant="businessText" sx={{ width: '3%' }}>{data.id}.</Typography>
                                        <Typography variant="businessText" sx={{ width: '50%' }}>{data.rule}
                                            <Tooltip title={data.helperText} sx={{ '& .MuiTooltip-tooltip': { color: 'red' } }}>
                                                <InfoOutlinedIcon sx={{ color: theme.palette.primary.main, fontSize: '14px', marginBottom: '-2px', marginLeft: '10px' }} />
                                            </Tooltip>
                                        </Typography>
                                        <Typography variant="businessText" sx={{ width: '2%', textAlign: 'center', mr: '6%' }}>{data.value ? "YES" : "NO"}</Typography>
                                        <Typography variant="businessText" sx={{ width: '3%', textAlign: 'center' }}> <EditIcon /></Typography>
                                    </Stack>
                                    <Divider variant='fullWidth' sx={{ width: '100%', color: '#F8F8F8' }} />
                                </Box>
                            )
                        })}

                    </Box>
                </Stack >
            </ConfigurationCard >
        </Box >

    )
}

export default BusinessRules