import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { useState } from "react";
import MockInventorySettings, { IPartnerInventorySetting } from "../../../mocks/InventorySettings";

const FormularyDropdown = ({ sendSelectedDataToParent }: any) => {
    const [partner, setPartner] = useState("Green Pharmacy")
    const element1 = document.getElementById('test-select');
    //sendSelectedDataToParent(element1?.innerText);
    //setPartner(element1?.innerText as string);
    //const testing=MockInventorySettings.data.map((data: IPartnerInventorySetting, index) => { return data.name });
    console.log(element1?.innerText);
    const changePartner = (event: SelectChangeEvent) => {
        setPartner(event.target.value);
        sendSelectedDataToParent(event.target.value);
    };

    return (
        <FormControl sx={{
            "& .MuiInputBase-root": {
                height: '30px',
                borderRadius: '2px',
                fontSize: '14px',
                backgroundColor: 'white',
            }, ml: '0px !important',
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
                        color: 'black',
                        fontSize: '14px'
                    },
                }}
            >
                {
                    MockInventorySettings.data.map((data: IPartnerInventorySetting, index) => {
                        return (
                            <MenuItem sx={{ fontSize: '14px' }} value={data.name}>
                                {data.name}
                            </MenuItem>
                        )
                    })}
            </Select>
        </FormControl>
    )
}
export default FormularyDropdown;