//import styles from './component1.module.css';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Grid, useTheme } from '@mui/material';

import { getConfiguration, marketplaceStore, selectConfiguration } from '@cloudcore/redux-store';
import { Snackbar } from '@cloudcore/ui-shared';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout
} from '@cloudcore/okta-and-config';
/* eslint-disable-next-line */
export interface Component1Props {}
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
  console.log(inventoryConfig);
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
    <Grid container spacing={1} marginTop={4} marginLeft={10}>
      {snackbar && <Snackbar type={snackbarType} content={snackBarMsg} />}
      <Grid item xs={4}>
      Borrowing:  {inventoryConfig.borrowing}
      </Grid>
      <Grid item xs={4}>
      Inventory Capacity: {inventoryConfig.capacity}
      </Grid>
      <Grid item xs={4}>
      Partner Orders Accepted: {inventoryConfig.partnerOrders? 'Yes': 'No' }
      </Grid>
    </Grid>
  );
}

export default InventorySettings
