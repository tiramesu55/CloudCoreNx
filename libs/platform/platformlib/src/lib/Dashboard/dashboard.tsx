import { useContext, useEffect, useMemo, useState } from 'react';
import { platformStore } from '@cloudcore/redux-store';
import { Grid, useTheme } from '@mui/material';
import {
  InfoCard,
  Card,
  List,
  Snackbar,
  sites_img,
  users_img,
  organizations_img,
} from '@cloudcore/ui-shared';
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
  UseClaimsAndSignout,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import TitleAndCloseIcon from '../components/TitleAndClose/TitleAndClose';
import DisplayMiantenance from 'libs/ui-shared/src/lib/DisplayMaintenance/displayMaintenance';
import { IAlert, IAlertData } from '@cloudcore/common-lib';
const { useAppDispatch, useAppSelector } = platformStore;

interface Props {
  handleOpenAlert: (payload: IAlert) => void;
  handleCloseAlert: () => void;
  alertData: IAlertData;
}

export const Dashboard = (props: Props) => {
  const { handleOpenAlert, handleCloseAlert, alertData } = props;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const config: IConfig = useContext(ConfigCtx) as IConfig;
  const path = useMemo(() => {
    return `${config.isMainApp ? '/platform/' : '/'}`;
  }, [config.isMainApp]);
  const { token, permissions } = useClaimsAndSignout() as UseClaimsAndSignout;
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const history = useHistory();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { platformBaseUrl } = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const [displayMaintenance, setDisplayMaintenance] = useState(false);
  const orgsCount = useAppSelector(getAllOrgCount);
  const sitesCount = useAppSelector(getAllSitesCount);
  const usersCount = useAppSelector(getAllUsersCount);
  const orgsList = useAppSelector(selectOrganizations);
  const idSelected = useAppSelector(selectedId);
  const addOrgButtonEnabled = (permissions.get('admin') ?? []).includes(
    'global'
  );
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
            handleOpenAlert({
              content: reason.message,
              type: 'error',
            });
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
            handleOpenAlert({
              content: reason.message,
              type: 'error',
            });
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
      <Snackbar
        open={alertData.openAlert}
        type={alertData.type}
        content={alertData.content}
        onClose={handleCloseAlert}
        duration={3000}
      />
      {
        <DisplayMiantenance
          open={displayMaintenance}
          handleDisplayMaintenanceDialog={handleDisplayMaintenanceDialog}
        />
      }
      <Grid item xs={12}>
        <TitleAndCloseIcon
          breadCrumbOrigin={'Dashboard'}
          breadCrumbTitle={''}
          addBtn={addOrgButtonEnabled}
          onClickAddBtn={handleClickAddOrg}
          addBtnText="ADD NEW ORG"
        />
      </Grid>
      <Grid item xs={12} sx={{ mx: 3, mb: 3 }}>
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
      <Grid
        item
        xs={12}
        sx={{ px: theme.spacing(2.5), pb: theme.spacing(2.5) }}
      >
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
