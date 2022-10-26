import { Grid, Box, Typography, Button, useTheme } from '@mui/material';
import { platformStore } from '@cloudcore/redux-store';
import locationIcon from '../../../images/location.svg';
import { OrgContactDetails } from './orgContactDetails';
import { useSelector } from 'react-redux';
import {
  organizationSelector,
  selectedId,
  selectOrganizations,
} from '@cloudcore/redux-store';
import { useHistory } from 'react-router-dom';
import { ConfigCtx, IConfig } from '@cloudcore/okta-and-config';
import { useContext, useMemo } from 'react';
import {} from '@cloudcore/ui-shared';

const { useAppSelector } = platformStore;

export const OrganizationDataProfile = () => {
  const config: IConfig = useContext(ConfigCtx)!;
  const path = useMemo(() => {
    return `${config.isMainApp ? '/platform/' : '/'}`;
  }, [config.isMainApp]);

  const theme = useTheme();
  const organizations = useAppSelector(selectOrganizations);
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
                  src={locationIcon}
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
                onClick={handleEditSiteClick}
                sx={{
                  fontSize: theme.typography.subtitle1.fontSize,
                  fontWeight: 'bold',
                  paddingX: theme.spacing(6),
                  paddingY: theme.spacing(1.1),
                }}
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
