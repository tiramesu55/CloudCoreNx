/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useContext, useMemo } from 'react';
import { Grid, Box, Typography, IconButton, Button } from '@mui/material';
import { useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { platformStore } from '@cloudcore/redux-store';
import CloseIcon from '@mui/icons-material/Close';
import { useHistory, useLocation } from 'react-router-dom';
import { Card } from '@cloudcore/ui-shared';
import { List } from '@cloudcore/ui-shared';
import { SiteDetailByOrg } from './siteDetailByOrg';
import {
  setOrganization,
  selectOrgByOrgCode,
  resetSite,
  selectSelectedId,
  setSite,
  siteSelector,
  selectedIdSite,
  selectAllSites,
} from '@cloudcore/redux-store';
import {
  ConfigCtx
} from '@cloudcore/okta-and-config';

const { useAppDispatch, useAppSelector } = platformStore;
export const Sites = () => {
  const theme = useTheme();
  const selectedSiteId = useAppSelector(selectSelectedId);
  const selectSiteByID = useSelector((state: any) =>
    siteSelector.selectById(state, selectedSiteId)
  );
  const { isMainApp } = useContext(ConfigCtx)!; // at this point config is not null (see app)

  const path = useMemo(() => {
      return `${isMainApp ? '/platform' : ''}`;
  }, [isMainApp]);

  const siteList = useAppSelector(selectAllSites);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const location: any = useLocation();
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

  const organization = useAppSelector((state: any) =>
    selectOrgByOrgCode(state, orgData.orgCode)
  );

  const setSelectedId = (id: string) => {
    dispatch(selectedIdSite(id));
  };

  useEffect(() => {
    if (selectSiteByID !== undefined) {
      dispatch(setSite(selectSiteByID));
    }
  }, [selectSiteByID]);

  useEffect(() => {
    if (
      location.state !== undefined &&
      location?.state?.orgCode !== undefined
    ) {
      window.localStorage.removeItem('orgData');
      window.localStorage.removeItem('orgCode');
      window.localStorage.setItem('orgData', JSON.stringify(orgData));
    }
  }, []);
  const closeSites = () => {
    history.push(`${path}/organization/editOrganization`, {
      title: 'Edit Organization',
      task: 'editOrganization',
      from: 'editOrganization',
      orgCode: storedOrgData.orgCode,
      orgName: storedOrgData.orgName,
    });

    dispatch(setOrganization(organization));
  };
  const storedOrgData = JSON.parse(
    window.localStorage.getItem('orgData') as any
  );

  const addNewSite = () => {
    history.push(`${path}/organization/addSite`, {
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
