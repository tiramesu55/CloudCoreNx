import { useState, useEffect, useMemo, useContext } from 'react';
import {
  Grid,
  Box,
  Typography,
  IconButton,
  Button,
  useTheme,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { platformStore } from '@cloudcore/redux-store';
import CloseIcon from '@mui/icons-material/Close';
import { useHistory, useLocation } from 'react-router-dom';
import { Card, List, Snackbar } from '@cloudcore/ui-shared';
import { SiteDetailByOrg } from './siteDetailByOrg';
import {
  resetSite,
  selectSelectedId,
  setSite,
  siteSelector,
  selectedIdSite,
  selectAllSites,
  getSites,
} from '@cloudcore/redux-store';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';

const { useAppDispatch, useAppSelector } = platformStore;
export const Sites = () => {
  const config: IConfig = useContext(ConfigCtx)!;
  const path = useMemo(() => {
    return `${config.isMainApp ? '/platform/' : '/'}`;
  }, [config.isMainApp]);
  const { platformBaseUrl } = useContext(ConfigCtx)!;
  const { token } = useClaimsAndSignout(
    config.logoutSSO,
    config.postLogoutRedirectUri
  );
  const theme = useTheme();
  const selectedSiteId = useAppSelector(selectSelectedId);
  const selectSiteByID = useSelector((state: any) =>
    siteSelector.selectById(state, selectedSiteId)
  );
  const siteList = useAppSelector(selectAllSites);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const location: any = useLocation();
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarType, setSnackBarType] = useState('');
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const getOrgData = () => {
    const retrieveData = window.localStorage.getItem('orgData');
    const updatedorgData = JSON.parse(retrieveData as any);
    return updatedorgData;
  };
  const orgData: any = location?.state
    ? {
        orgCode: location?.state?.orgCode,
        orgName: location?.state?.orgName,
      }
    : getOrgData();

  const setSelectedId = (id: string) => {
    dispatch(selectedIdSite(id));
  };

  useEffect(() => {
    if (selectSiteByID !== undefined) {
      dispatch(setSite(selectSiteByID));
    }
  }, [selectSiteByID]);

  useEffect(() => {
    if (location?.state?.orgCode) {
      dispatch(
        getSites({
          orgCode: location?.state?.orgCode,
          url: platformBaseUrl,
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

    if (
      location.state !== undefined &&
      location?.state?.orgCode !== undefined
    ) {
      window.localStorage.removeItem('orgData');
      window.localStorage.removeItem('orgCode');
      window.localStorage.setItem('orgData', JSON.stringify(orgData));
    }
  }, [dispatch, token]);

  const closeSites = () => {
    history.push(`${path}`);
  };
  const storedOrgData = JSON.parse(
    window.localStorage.getItem('orgData') as any
  );

  const addNewSite = () => {
    history.push(`${path}organization/addSite`, {
      title: 'Add Site',
      task: 'addSite',
      from: 'addSite',
      orgCode: orgData.orgCode,
      orgName: orgData.orgName,
    });
    dispatch(resetSite());
  };

  return (
    <>
      <Grid container spacing={1}>
        {snackbar && <Snackbar type={snackbarType} content={snackBarMsg} />}
        <Grid xs={12} item>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingX: theme.spacing(3),
              paddingY: theme.spacing(2),
            }}
          >
            <Typography variant="subtitle1" color={theme.breadcrumLink.primary}>
              <>
                {' '}
                DASHBOARD / {storedOrgData?.orgName?.toUpperCase()} ORG / ORG /
                <Typography component={'span'} fontWeight="bold">
                  {' '}
                  EDIT SITES
                </Typography>
              </>
            </Typography>
            <Box>
              <Button
                variant="contained"
                sx={{ marginRight: theme.spacing(2) }}
                onClick={addNewSite}
              >
                Add New Site
              </Button>
              <IconButton sx={{ color: '#000000' }} onClick={closeSites}>
                <CloseIcon fontSize="large" />
              </IconButton>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sx={{ paddingRIght: '20px' }}>
          <Card
            sx={{
              marginBottom: theme.spacing(3),
              marginLeft: theme.spacing(2.5),
              marginRight: theme.spacing(3),
              borderColor: theme.palette.cardBorder.main,
              minHeight: '75vh',
            }}
          >
            <Grid container direction="row">
              <Grid item xs={12} md={6}>
                <List
                  label="Sites"
                  name="siteName"
                  idSelected={selectedSiteId}
                  data={siteList}
                  changeSelectedId={setSelectedId}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                {siteList.length > 0 && <SiteDetailByOrg />}
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      )
    </>
  );
};

export default Sites;
