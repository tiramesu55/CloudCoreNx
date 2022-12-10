//import styles from './component1.module.css';
import { useContext, useEffect, useState } from 'react';
import { Grid, useTheme } from '@mui/material';
import {
  getConfiguration,
  marketplaceStore,
  selectConfiguration,
} from '@cloudcore/redux-store';
import { Snackbar } from '@cloudcore/ui-shared';
import { IAlert, IAlertData } from '@cloudcore/common-lib';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
/* eslint-disable-next-line */
const { useAppDispatch, useAppSelector } = marketplaceStore;

interface Props {
  handleOpenAlert: (payload: IAlert) => void;
  handleCloseAlert: () => void;
  alertData: IAlertData;
}

function InventorySettings(props: Props) {
  const { handleOpenAlert, handleCloseAlert, alertData } = props;
  const config: IConfig = useContext(ConfigCtx)!;

  const dispatch = useAppDispatch();
  const inventoryConfig = useAppSelector(selectConfiguration);
  const okt = useClaimsAndSignout();

  console.log(inventoryConfig);
  useEffect(() => {
    const token = okt?.token;
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
            handleOpenAlert({
              content: reason.message,
              type: 'error',
            });
          }
        );
    }
  }, [config.marketBaseUrl, dispatch, okt?.token]);
  return (
    <Grid container spacing={1} marginTop={4} marginLeft={10}>
      <Snackbar
        open={alertData.openAlert}
        type={alertData.type}
        content={alertData.content}
        onClose={handleCloseAlert}
        duration={3000}
      />
      <Grid item xs={4}>
        Borrowing: {inventoryConfig.borrowing}
      </Grid>
      <Grid item xs={4}>
        Inventory Capacity: {inventoryConfig.capacity}
      </Grid>
      <Grid item xs={4}>
        Partner Orders Accepted: {inventoryConfig.partnerOrders ? 'Yes' : 'No'}
      </Grid>
    </Grid>
  );
}

export default InventorySettings;
