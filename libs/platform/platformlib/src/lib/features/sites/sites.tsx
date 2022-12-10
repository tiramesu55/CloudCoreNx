import { useEffect, useMemo, useContext } from 'react';
import { Grid, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { platformStore } from '@cloudcore/redux-store';
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
  UseClaimsAndSignout,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import TitleAndCloseIcon from '../../components/TitleAndClose/TitleAndClose';
import { IAlert, IAlertData } from '@cloudcore/common-lib';

const { useAppDispatch, useAppSelector } = platformStore;
interface Props {
  handleOpenAlert: (payload: IAlert) => void;
  handleCloseAlert: () => void;
  alertData: IAlertData;
}
export const Sites = (props: Props) => {
  const { handleOpenAlert, handleCloseAlert, alertData } = props;
  const config: IConfig = useContext(ConfigCtx) as IConfig;
  const path = useMemo(() => {
    return `${config.isMainApp ? '/platform/' : '/'}`;
  }, [config.isMainApp]);
  const { platformBaseUrl } = config;
  const { token, permissions } = useClaimsAndSignout() as UseClaimsAndSignout;
  const theme = useTheme();
  const selectedSiteId = useAppSelector(selectSelectedId);
  const selectSiteByID = useSelector((state: any) =>
    siteSelector.selectById(state, selectedSiteId)
  );
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

  const setSelectedId = (id: string) => {
    dispatch(selectedIdSite(id));
  };
  const addSiteButtonEnabled = (permissions.get('admin') ?? []).includes(
    'global'
  );

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
            handleOpenAlert({
              content: reason.message,
              type: 'error',
            });
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
    <Grid>
      <Snackbar
        open={alertData.openAlert}
        type={alertData.type}
        content={alertData.content}
        onClose={handleCloseAlert}
        duration={3000}
      />
      <Grid xs={12} item>
        <TitleAndCloseIcon
          onClickButton={closeSites}
          breadCrumbOrigin={`Dashboard / ${storedOrgData?.orgName} Organization `}
          breadCrumbTitle={'Edit Sites'}
          addBtn={addSiteButtonEnabled}
          onClickAddBtn={addNewSite}
          addBtnText="Add New Site"
        />
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
  );
};

export default Sites;
