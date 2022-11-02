import { Grid, Typography, Box, Divider } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { platformStore } from '@cloudcore/redux-store';
import { useTheme } from '@mui/material';
import {
  organizationSelector,
  selectedId,
  selectOrganizations,
} from '@cloudcore/redux-store';

const { useAppSelector } = platformStore;
export const OrgContactDetails = () => {
  const theme = useTheme();
  const organizations = useAppSelector(selectOrganizations);
  const selectId = useAppSelector(selectedId);
  const testId = selectId === '' ? organizations[0]?.id : selectId;
  const organization = useSelector((state: any) =>
    organizationSelector.selectById(state, testId)
  );
  return (
    <Box sx={{ minHeight: '370px' }}>
      <Grid container>
        <Grid item xs={12}>
          <Typography
            component={'div'}
            sx={{
              fontSize: theme.typography.subtitle1.fontSize,
              fontWeight: 'bold',
              paddingY: theme.spacing(2),
            }}
          >
            Organization Contact Details
            <Divider />
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <Typography
            sx={{
              paddingBottom: theme.spacing(1.5),
              fontSize: theme.typography.subtitle1.fontSize,
              fontWeight: 'bold',
            }}
          >
            Address
          </Typography>
          <Typography
            sx={{
              fontSize: theme.typography.subtitle1.fontSize,
            }}
          >
            {`${organization?.address?.street}`}
          </Typography>
        </Grid>
        <Grid item xs={3.5}>
          <Typography
            sx={{
              paddingBottom: theme.spacing(1.5),
              fontSize: theme.typography.subtitle1.fontSize,
              fontWeight: 'bold',
            }}
          >
            City
          </Typography>
          <Typography
            sx={{
              fontSize: theme.typography.subtitle1.fontSize,
            }}
          >
            {organization?.address?.city}
          </Typography>
        </Grid>
        <Grid item xs={3.5}>
          <Typography
            sx={{
              paddingBottom: theme.spacing(1.5),
              fontSize: theme.typography.subtitle1.fontSize,
              fontWeight: 'bold',
            }}
          >
            Zip/Postal
          </Typography>
          <Typography
            sx={{
              fontSize: theme.typography.subtitle1.fontSize,
            }}
          >
            {organization?.address?.zip}
          </Typography>
        </Grid>
        <Grid item xs={5} sx={{ paddingTop: theme.spacing(4) }}>
          <Typography
            sx={{
              paddingBottom: theme.spacing(1.5),
              fontSize: theme.typography.subtitle1.fontSize,
              fontWeight: 'bold',
            }}
          >
            Office Phone
          </Typography>
          <Typography
            sx={{
              fontSize: theme.typography.subtitle1.fontSize,
            }}
          >
            {organization?.officePhone ? organization?.officePhone : '-'}
          </Typography>
        </Grid>
        <Grid item xs={7} sx={{ paddingTop: theme.spacing(4) }}>
          <Typography
            sx={{
              paddingBottom: theme.spacing(1.5),
              fontSize: theme.typography.subtitle1.fontSize,
              fontWeight: 'bold',
            }}
          >
            Office Email ID
          </Typography>
          <Typography
            sx={{
              fontSize: theme.typography.subtitle1.fontSize,
            }}
          >
            {organization?.officeEmail ? organization?.officeEmail : '-'}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
