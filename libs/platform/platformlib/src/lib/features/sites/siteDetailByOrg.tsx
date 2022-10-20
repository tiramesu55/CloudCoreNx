/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Grid, Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material';
import locationIcon from '../../images/location.svg';
import { ApplicationBySites } from './applicationBySites';
import { SiteContactDetails } from './siteContactDetails';
import { platformStore } from '@cloudcore/redux-store';
import {
  organizationSelector,
  selectedId,
  selectSelectedId,
  siteSelector,
} from '@cloudcore/redux-store';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useEffect, useContext, useMemo } from 'react';
import {
  ConfigCtx
} from '@cloudcore/okta-and-config';

const { useAppSelector } = platformStore
export const SiteDetailByOrg = () => {
  const theme = useTheme();
  const { isMainApp } = useContext(ConfigCtx)!; // at this point config is not null (see app)

  const path = useMemo(() => {
      return `${isMainApp ? '/platform' : ''}`;
  }, [isMainApp]);
  const idSelected = useAppSelector(selectSelectedId);
  const location: any = useLocation();
  const selected = useAppSelector(selectedId);
  const selectOrgByID = useSelector((state: any) =>
    organizationSelector.selectById(state, selected)
  );

  let orgData = {
    orgCode: location?.state?.orgCode,
    orgName: location?.state?.orgName,
  };
  useEffect(() => {
    const retrieveData = window.localStorage.getItem('orgData');
    orgData = JSON.parse(retrieveData as any);
  }, []);

  const selectedSite = useSelector((state: any) =>
    siteSelector.selectById(state, idSelected)
  );
  const history = useHistory();
  const handleClick = () => {
    history.push(`${path}/organization/editSite`, {
      title: 'Edit Site',
      task: 'editSite',
      from: 'editSite',
      orgCode: orgData.orgCode,
      orgName: orgData.orgName,
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
      <Grid item sm={12} md={12} lg={12} sx={{ mr: 4, minHeight: '68vh' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: '1 0 auto', width: 'auto' }} component="span">
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ mr: 2 }}>
                <Typography component={'span'} variant="h3" fontWeight={'bold'}>
                  {selectedSite?.siteName}
                </Typography>
              </Box>
              <Box>
                <Box
                  component={'img'}
                  src={locationIcon}
                  alt="location"
                  sx={{ mr: 1 }}
                  color="#808184"
                />
                <Typography component={'span'} variant="body2">
                  {`${selectedSite?.address?.street}, ${selectedSite?.address?.city}`}
                </Typography>
              </Box>
            </Box>
            <ApplicationBySites applications={selectedSite?.applications} />
            <SiteContactDetails
              address={selectedSite?.address}
              sitePhone={selectedSite?.phone}
              siteEmail={selectedSite?.serviceEmail}
            />
            {idSelected !== '' && (
              <Box
                sx={{
                  alignItems: 'flex-end',
                  display: 'flex',
                  //mx: 2.5,
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
                  onClick={handleClick}
                  sx={{
                    fontSize: theme.typography.subtitle1.fontSize,
                    fontWeight: 'bold',
                    paddingX: theme.spacing(6),
                    paddingY: theme.spacing(1.1),
                    mx: 1,
                    mt: 3,
                  }}
                >
                  EDIT
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
