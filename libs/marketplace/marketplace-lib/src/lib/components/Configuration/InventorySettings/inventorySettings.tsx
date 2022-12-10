//import styles from './component1.module.css';
import MockInventorySettings from '../../../mocks/InventorySettings';
import { IPartnerInventorySetting } from '../../../mocks/InventorySettings'
import { useContext, useEffect, useState } from 'react';
import { lighten, Stack, useTheme } from '@mui/material';
import { getConfiguration, marketplaceStore, selectConfiguration } from '@cloudcore/redux-store';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout
} from '@cloudcore/okta-and-config';
import InventorySettingsCard from './InventorySettingsCard';
import ConfigurationCard from '../ConfigurationCard/ConfigurationCard';
/* eslint-disable-next-line */
export interface Component1Props { }

const { useAppDispatch, useAppSelector } = marketplaceStore;

function InventorySettings(props: Component1Props) {
  const config: IConfig = useContext(ConfigCtx)!;
  const { token } = useClaimsAndSignout(
    config.logoutSSO,
    config.postLogoutRedirectUri
  );
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarType, setSnackBarType] = useState('');
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const inventoryConfig = useAppSelector(selectConfiguration);

  useEffect(() => {
    if (config.marketBaseUrl) {
      dispatch(
        getConfiguration({
          url: config.marketBaseUrl,
          token: token,
        })
      )
        .unwrap()
        .then(
          (value: any) => {
            //Do Nothing
          },
          (reason: any) => {
            setSnackbar(true);
            setSnackBarMsg('fetchError');
            setSnackBarType('failure');
          }
        );
    }
  }, [dispatch, config, token]);

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
            <InventorySettingsCard {...data} />
          </ConfigurationCard>)
      })}
    </Stack>
  );
}

export default InventorySettings
