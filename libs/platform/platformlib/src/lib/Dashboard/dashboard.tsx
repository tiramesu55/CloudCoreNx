import { useContext, useEffect, useState } from 'react';
import { platformStore } from '@cloudcore/redux-store';
import { Grid, Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material';
import { InfoCard, Card } from '@cloudcore/ui-shared';
import sites from '../images/sites.svg';
import users from '../images/users.svg';
import organizations from '../images/organizations.svg';
import { useHistory } from 'react-router-dom';
import { List } from '@cloudcore/ui-shared';
import { OrganizationDataProfile } from '../features/organizations/organizationsProfile/organizationDataProfile';
import {
  getAllOrgCount,
  getAllSitesCount,
  getAllUsersCount,
  getDashboardStats,
  selectedId,
  selectedIdOrganization,
  selectOrganizations,
} from '@cloudcore/redux-store';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
const { useAppDispatch, useAppSelector } = platformStore;

export const Dashboard = () => {
  const config: IConfig = useContext(ConfigCtx)!;
  const { token, permissions } = useClaimsAndSignout(
    config.logoutSSO,
    config.postLogoutRedirectUri
  );
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const history = useHistory();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { platformBaseUrl } = useContext(ConfigCtx)!; // at this point config is not null (see app)

  const baseUrl = platformBaseUrl;
  // console.log(baseUrl)
  const orgsCount = useAppSelector(getAllOrgCount);
  const sitesCount = useAppSelector(getAllSitesCount);
  const usersCount = useAppSelector(getAllUsersCount);
  const orgsList = useAppSelector(selectOrganizations);
  const idSelected = useAppSelector(selectedId);
  const newOrgButton =
    permissions.admin && permissions.admin?.includes('global') ? true : false;

  const setSelectedId = (id: string) => {
    dispatch(selectedIdOrganization(id));
  };

  useEffect(() => {
    if (baseUrl) {
      dispatch(
        getDashboardStats({
          url: baseUrl,
          token: token,
        })
      );
    }
  }, [dispatch, baseUrl, token]);

  const handleClickAddOrg = () => {
    history.replace('/organization/addOrganization', {
      title: 'Add Organization',
      task: 'addOrganization',
      from: 'addOrganization',
    });
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingX: theme.spacing(3),
            paddingY: theme.spacing(2),
          }}
        >
          <Typography
            variant="subtitle1"
            fontSize={theme.typography.subtitle1.fontSize}
            color={theme.breadcrumLink.primary}
          >
            DASHBOARD
          </Typography>
          <Box>
            <Box
              display="flex"
              alignItems="center"
              sx={{ '&:hover': { cursor: 'pointer' } }}
            >
              {/* <img src={excelLogo} alt="excelLogo" style={{ paddingRight: "10px" }} />
                            <Typography component={"span"}
                                fontSize={theme.typography.subtitle1.fontSize}
                                color={theme.palette.primary.main}
                                style={{ paddingRight: "10px" }}>
                                Download onboarding template
                            </Typography>
                            <InfoTooltip title={
                                <>
                                    <Typography fontWeight={"bold"} sx={{ textAlign: "center", paddingBottom: "5px" }}>
                                        NEXIA Onboarding
                                    </Typography>
                                    <Typography fontSize={theme.typography.body2.fontSize} sx={{ textAlign: "center", }}>
                                        Download Org onboarding sample spreadsheet templet here, Please modify this
                                        file as per org requirement and upload it to start setup.
                                    </Typography>
                                </>
                            } placement="bottom-end" >
                                <img src={info} alt="information"/>
                            </InfoTooltip> */}
              {newOrgButton && (
                <Button
                  variant="contained"
                  onClick={handleClickAddOrg}
                  sx={{
                    marginTop: theme.spacing(3),
                  }}
                >
                  ADD NEW ORG
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ paddingRight: '20px' }}>
        <Grid container spacing={3} paddingLeft="20px">
          <Grid item xs={6} md={4}>
            <InfoCard
              image={organizations}
              title="Organizations"
              count={orgsCount}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <InfoCard image={sites} title="Sites" count={sitesCount} />
          </Grid>
          <Grid item xs={6} md={4}>
            <InfoCard image={users} title="Users" count={usersCount} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ paddingRIght: '20px' }}>
        <Card
          sx={{
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(3),
            marginLeft: theme.spacing(2.5),
            marginRight: theme.spacing(2),
            borderColor: theme.palette.cardBorder.main,
          }}
        >
          <Grid container direction="row">
            <Grid item xs={12} md={6}>
              <List
                label="Organizations"
                name="name"
                idSelected={idSelected}
                data={orgsList}
                changeSelectedId={setSelectedId}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <OrganizationDataProfile />
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};
