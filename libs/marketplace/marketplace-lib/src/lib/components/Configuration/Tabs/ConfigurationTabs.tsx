import { Tab, Box, Tabs, lighten, Stack, Typography, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, InputBase, styled } from "@mui/material"
import { useMemo, useState } from "react"
import LabelSettings from "../LabelSettings/LabelSettings"
import TabPanel from "./TabPanel"
import BusinessRules from "../BusinessRules/BuisnessRules"
import FormularyList from "../FormularyList/FormularyList"
import GeneralSettings from "../GeneralSettings/GeneralSettingsCard"

const tabPadding = { paddingBottom: '5px', }
export interface IConfigurationPermissions {
    inventory?: boolean;
    general?: boolean;
    label?: boolean;
    formulary?: boolean;
    business?: boolean
}
export interface ConfigurationTabsProps {
    permissions: IConfigurationPermissions
}

const ConfigurationTabs = (props: ConfigurationTabsProps) => {
    const { permissions } = props
    const [tab, setTab] = useState(0)

    const checkedPermissions = {
        inventory: permissions?.inventory !== undefined ? permissions?.inventory : true,
        general: permissions?.general !== undefined ? permissions?.general : true,
        label: permissions?.label !== undefined ? permissions?.label : true,
        formulary: permissions?.formulary !== undefined ? permissions?.formulary : true,
        business: permissions?.business !== undefined ? permissions?.business : true,
    }

    useMemo(() => {
        let set = false
        Object.values(checkedPermissions).forEach((value, i) => {
            if (value === true && set === false) {
                console.log(i)
                setTab(i)
                set = true
            }
        })
    }, [])

    const changeTab = (event: React.SyntheticEvent, index: number) => {
        setTab(index);
    }

    const [age, setAge] = useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value as string);
    };


    return (
        <Box marginLeft={1.5} marginRight={1.5} sx={{ width: '95%' }}>
            <Stack direction="row" spacing={.5} sx={{ mt: 2 }}>
                <Typography component={'span'} sx={{ textTransform: "uppercase", fontWeight: 'bold', color: 'rgb(88, 89, 91)' }}>Operations Dashboard</Typography>
                <Typography variant="body2" component={'span'} sx={{ textTransform: "capitalize", mb: 'auto !important', color: 'rgb(88, 89, 91)', mt: 'auto !important' }}>(Configuration)</Typography>
            </Stack>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={changeTab} aria-label="basic tabs example">
                    {/* <Tab disabled={!checkedPermissions.inventory} data-testid="inventorySettingsTab" sx={tabPadding} label={<Typography variant="tabLabel">Inventory Settings</Typography>} /> */}
                    <Tab disabled={!checkedPermissions.general} data-testid="generalSettingsTab" sx={tabPadding} label={<Typography variant="tabLabel">General Settings</Typography>} />
                    <Tab disabled={!checkedPermissions.label} data-testid="labelSettingsTab" sx={tabPadding} label={<Typography variant="tabLabel">Label Settings</Typography>} />
                    <Tab disabled={!checkedPermissions.formulary} data-testid="formularyListTab" sx={tabPadding} label={<Typography variant="tabLabel">Formulary List</Typography>} />
                    <Tab disabled={!checkedPermissions.business} data-testid="businessRulesTab" sx={tabPadding} label={<Typography variant="tabLabel">Business Rules</Typography>} />
                    {tab < 3 && (
                        <FormControl sx={{
                            "& .MuiInputBase-root": {
                                height: '70%',
                                borderRadius: '2px',
                                backgroundColor: 'white'
                            }, ml: 'auto !important', m: 1, minWidth: 120, width: '15%', marginBottom: '5px !important'
                        }} size="small">
                            <Select
                                id="test-select"
                                value={age}
                                onChange={handleChange}
                                displayEmpty
                                sx={{
                                    "& .MuiSvgIcon-root": {
                                        color: 'black'
                                    },

                                }}
                            >
                                <MenuItem value="">
                                    All Sites
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                </Tabs>
            </Box>
            {/* <TabPanel value={tab} index={0}>
                <InventorySettings />
            </TabPanel> */}
            <TabPanel value={tab} index={0}>
                <GeneralSettings />
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <LabelSettings />
            </TabPanel>
            <TabPanel value={tab} index={2}>
                <FormularyList />
            </TabPanel>
            <TabPanel value={tab} index={3}>
                <BusinessRules />
            </TabPanel>
        </Box>
    )

}

export default ConfigurationTabs