import { FormControl, IconButton, InputAdornment, OutlinedInput} from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";


const FormularySearch = ({sendSearchDataToParent}:any) => {

    const [searchValue, setSearchValue] = useState("")

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        sendSearchDataToParent(event.target.value);
    }
    const handleSearch = () => {
        //console.log("searching")
    }
    return(
<FormControl sx={{
    "& .MuiInputBase-root": {
        height: '30px',
        borderRadius: '2px',
        paddingRight: '13px',
        backgroundColor: 'white',
        fontsize:'14px',
    }, m: 1, marginTop: '2px', width: '25ch'
}} variant="outlined" size="small">
    <OutlinedInput
    sx={{fontsize:'12px'}}
        id="outlined-adornment"
        type='text'
        value={searchValue}
        onChange={handleChange}
        placeholder="Search"
        endAdornment={
            <InputAdornment position="end">
                <IconButton disabled
                    sx={{
                        backgroundColor: 'white', color: 'black', height: '25px',
                        width: "25px",
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
    />
</FormControl>
    )
}
export default FormularySearch;