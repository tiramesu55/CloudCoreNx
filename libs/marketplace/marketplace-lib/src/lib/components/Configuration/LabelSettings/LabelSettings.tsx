import { Stack, lighten } from "@mui/material";
import MockInventorySettings, { IPartnerInventorySetting } from "../../../mocks/InventorySettings";
import ConfigurationCard from "../ConfigurationCard/ConfigurationCard";
import InventorySettingsCard from "../InventorySettings/InventorySettingsCard";
import LabelSettingsContent from "./LabelSettingsContent";

const LabelSettings = () => {

    return (
        // <Grid container spacing={1} marginTop={4} marginLeft={10}>
        //   {snackbar && <Snackbar type={snackbarType} content={snackBarMsg} />}
        //   <Grid item xs={4}>
        //   Borrowing:  {inventoryConfig.borrowing}
        //   </Grid>
        //   <Grid item xs={4}>
        //   Inventory Capacity: {inventoryConfig.capacity}
        //   </Grid>
        //   <Grid item xs={4}>
        //   Partner Orders Accepted: {inventoryConfig.partnerOrders? 'Yes': 'No' }
        //   </Grid>
        // </Grid>

        <Stack spacing={2.5} marginTop={1.5} marginLeft={1.5} marginRight={1.5} sx={{ backgroundColor: lighten('#A7A9AC', 0.90) }}>
            {MockInventorySettings.data.map((data: IPartnerInventorySetting) => {
                return (
                    <ConfigurationCard color={data.color} initials={data.initials} name={data.name}>
                        <LabelSettingsContent />
                    </ConfigurationCard>)
            })}
        </Stack>
    );
}

export default LabelSettings
