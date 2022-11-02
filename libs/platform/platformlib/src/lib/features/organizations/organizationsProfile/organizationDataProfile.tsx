import { Grid, Box, Typography, Button, useTheme } from '@mui/material';
import {
  getOrganizationStatsAsync,
  organizationStats,
  platformStore,
  resetSite,
} from '@cloudcore/redux-store';
import { location_img } from '@cloudcore/ui-shared';
import { OrgContactDetails } from './orgContactDetails';
import { useSelector } from 'react-redux';
import {
  organizationSelector,
  selectedId,
  selectOrganizations,
} from '@cloudcore/redux-store';
import { useHistory } from 'react-router-dom';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import { useContext, useEffect, useMemo } from 'react';
import {} from '@cloudcore/ui-shared';

const { useAppDispatch, useAppSelector } = platformStore;

export const OrganizationDataProfile = () => {
  const config: IConfig = useContext(ConfigCtx)!;
  const { platformBaseUrl } = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const { token } = useClaimsAndSignout(
    config.logoutSSO,
    config.postLogoutRedirectUri
  );
  const path = useMemo(() => {
    return `${config.isMainApp ? '/platform/' : '/'}`;
  }, [config.isMainApp]);

  const theme = useTheme();
  const dispatch = useAppDispatch();
  const organizations = useAppSelector(selectOrganizations);
  const selectedOrgStats = useAppSelector(organizationStats);
  const selectId = useAppSelector(selectedId);
  const id = selectId === '' ? organizations[0]?.id : selectId;
  const organization = useSelector((state: any) =>
    organizationSelector.selectById(state, id)
  );
  const history = useHistory();
  const handleEditOrgClick = () => {
    history.replace(`${path}organization/editOrganization`, {
      title: 'Edit Organization',
      task: 'editOrganization',
      from: 'editOrganization',
    });
  };

  const handleEditSiteClick = () => {
    history.push(`${path}organization/sites`, {
      from: `${path}`,
      orgCode: organization?.orgCode,
      orgName: organization?.name,
    });
  };

  const handleAddSiteClick = () => {
    history.push(`${path}organization/editOrg/addSite`, {
      from: 'dashboard',
      orgCode: organization?.orgCode,
      orgName: organization?.name,
    });
    dispatch(resetSite());
  };

  useEffect(() => {
    dispatch(
      getOrganizationStatsAsync({
        orgCode: organization?.orgCode,
        url: platformBaseUrl,
        token: token,
      })
    );
  }, [selectId]);

  return (
    <Grid
      container
      sx={{
        display: 'flex',
        paddingLeft: '30px',
        paddingRight: '0px',
        [theme.breakpoints.between(1000, 1200)]: {
          paddingLeft: '5px',
        },
        [theme.breakpoints.between(1200, 1400)]: {
          paddingLeft: '15px',
        },
        paddingY: '30px',
        border: `1px solid ${theme.palette.cardBorder.main}`,
      }}
    >
      <Grid item sm={12} md={12} lg={12}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: '1 0 auto', width: 'auto' }} component="span">
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ mr: 2 }}>
                <Typography component={'span'} variant="h3" fontWeight={'bold'}>
                  {organization?.name}
                </Typography>
                <Box
                  component={'img'}
                  src={location_img}
                  alt="location"
                  sx={{ mx: 1 }}
                  color="#808184"
                />
                <Typography component={'span'} variant="body2">
                  {`${organization?.address?.street}, ${organization?.address?.city}`}
                </Typography>
              </Box>
              <Box
                sx={{
                  alignItems: 'flex-end',
                  mx: 4.5,
                  justifyContent: 'end',
                }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  color="primary"
                  aria-haspopup="true"
                  aria-controls="confirmation"
                  aria-label="confirmation"
                  onClick={handleEditOrgClick}
                  sx={{
                    fontSize: theme.typography.subtitle1.fontSize,
                    fontWeight: 'bold',
                    paddingX: theme.spacing(6),
                    paddingY: theme.spacing(1.1),
                  }}
                >
                  EDIT
                </Button>
              </Box>
            </Box>
            <OrgContactDetails />
            <Box
              sx={{
                alignItems: 'flex-end',
                display: 'flex',
                mx: 4.5,
                justifyContent: 'end',
              }}
            >
              <Button
                variant="outlined"
                size="large"
                color="primary"
                aria-haspopup="true"
                aria-controls="confirmation"
                aria-label="confirmation"
                onClick={handleAddSiteClick}
                sx={{
                  fontSize: theme.typography.subtitle1.fontSize,
                  fontWeight: 'bold',
                  paddingX: theme.spacing(6),
                  paddingY: theme.spacing(1.1),
                  marginRight: theme.spacing(2),
                }}
              >
                ADD SITE
              </Button>
              <Button
                variant="outlined"
                size="large"
                color="primary"
                aria-haspopup="true"
                aria-controls="confirmation"
                aria-label="confirmation"
                onClick={handleAddSiteClick}
                sx={{
                  fontSize: theme.typography.subtitle1.fontSize,
                  fontWeight: 'bold',
                  paddingX: theme.spacing(6),
                  paddingY: theme.spacing(1.1),
                  marginRight: theme.spacing(2),
                }}
              >
                ADD SITE
              </Button>
              <Button
                variant="outlined"
                size="large"
                color="primary"
                aria-haspopup="true"
                aria-controls="confirmation"
                aria-label="confirmation"
                onClick={handleEditSiteClick}
                sx={{
                  fontSize: theme.typography.subtitle1.fontSize,
                  fontWeight: 'bold',
                  paddingX: theme.spacing(6),
                  paddingY: theme.spacing(1.1),
                }}
                disabled={selectedOrgStats.sites < 1 ? true : false}
              >
                EDIT SITES
              </Button>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
