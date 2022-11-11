import { useContext, useEffect, useMemo, useState } from 'react';
import { platformStore } from '@cloudcore/redux-store';
import { Grid, useTheme } from '@mui/material';
import { InfoCard, Card, List, Snackbar } from '@cloudcore/ui-shared';
import sites_img from '../../../../../ui-shared/src/lib/assets/sites.svg';
import users_img from '../../../../../ui-shared/src/lib/assets/users.svg';
import organizations_img from '../../../../../ui-shared/src/lib/assets/organizations.svg';
import { useHistory } from 'react-router-dom';
import { OrganizationDataProfile } from '../features/organizations/organizationsProfile/organizationDataProfile';
import {
  getAllOrgCount,
  getAllSitesCount,
  getAllUsersCount,
  getDashboardStats,
  selectedId,
  selectedIdOrganization,
  selectOrganizations,
  getOrganizationsAsync,
} from '@cloudcore/redux-store';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import TitleAndCloseIcon from '../components/TitleAndClose/TitleAndClose';
import DisplayMiantenance from 'libs/ui-shared/src/lib/DisplayMaintenance/displayMaintenance';
const { useAppDispatch, useAppSelector } = platformStore;

export const Dashboard = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const config: IConfig = useContext(ConfigCtx)!;
  const path = useMemo(() => {
    return `${config.isMainApp ? '/platform/' : '/'}`;
  }, [config.isMainApp]);
  const { token, permissions } = useClaimsAndSignout(
    config.logoutSSO,
    config.postLogoutRedirectUri
  );
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const history = useHistory();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { platformBaseUrl } = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarType, setSnackBarType] = useState('');
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [displayMaintenance, setDisplayMaintenance] = useState(false);
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
    if (platformBaseUrl) {
      dispatch(
        getOrganizationsAsync({
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
      dispatch(
        getDashboardStats({
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
  }, [dispatch, platformBaseUrl, token]);

  const handleClickAddOrg = () => {
    history.replace(`${path}organization/addOrganization`, {
      title: 'Add Organization',
      task: 'addOrganization',
      from: 'addOrganization',
    });
  };

  const handleDisplayMaintenanceDialog = (value: boolean) => {
    setDisplayMaintenance(value);
  };

  return (
    <Grid>
      {snackbar && <Snackbar type={snackbarType} content={snackBarMsg} />}
      {
        <DisplayMiantenance
          open={displayMaintenance}
          handleDisplayMaintenanceDialog={handleDisplayMaintenanceDialog}
        />
      }
      <Grid item xs={12}>
        <TitleAndCloseIcon
          breadCrumbOrigin={'DASHBOARD'}
          breadCrumbTitle={''}
          addBtn={newOrgButton}
          onClickAddBtn={handleClickAddOrg}
          addBtnText="ADD NEW ORG"
        />
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
      </Grid>
      <Grid item xs={12} sx={{ margin: theme.spacing(2.5) }}>
        <Grid container spacing={3}>
          <Grid item xs={6} md={4}>
            <InfoCard
              image={organizations_img}
              title="Organizations"
              count={orgsCount}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <InfoCard image={sites_img} title="Sites" count={sitesCount} />
          </Grid>
          <Grid item xs={6} md={4}>
            <InfoCard image={users_img} title="Users" count={usersCount} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ margin: theme.spacing(2.5) }}>
        <Card
          sx={{
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
