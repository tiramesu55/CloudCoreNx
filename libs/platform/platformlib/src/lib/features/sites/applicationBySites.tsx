import { Divider, Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material';
import { ApplicationSite } from '@cloudcore/redux-store';
import dateFormat from 'dateformat';

interface Props {
  applications: ApplicationSite[] | undefined;
}

export const ApplicationBySites = (props: Props) => {
  const theme = useTheme();
  const [applications, setApplications] = useState<ApplicationSite[]>([]);

  useEffect(() => {
    if (props.applications) {
      setApplications(props.applications);
    } else {
      setApplications([]);
    }
  }, [props.applications]);

  return (
    <>
      <Grid
        item
        container
        xs={12}
        sx={{
          fontSize: theme.typography.h6.fontSize,
          fontWeight: theme.typography.h6.fontWeight,
          mt: theme.spacing(2),
        }}
      >
        <Grid item xs={6}>
          Applications
        </Grid>
        <Grid item xs={3}>
          Start Date
        </Grid>
        <Grid item xs={3}>
          End Date
        </Grid>
      </Grid>
      <Divider sx={{ color: theme.palette.cardBorder.main }} />

      {applications.map((app, key) => {
        return (
          <Grid
            item
            container
            xs={12}
            sx={{
              fontSize: theme.typography.h5.fontSize,
              mt: theme.spacing(2),
            }}
            key={key}
          >
            <Grid item xs={6}>
              {app.appCode}
            </Grid>
            <Grid item xs={3}>
              {dateFormat(app.subscriptionStart?.toString(), 'dd mmmm yyyy')}
            </Grid>
            <Grid item xs={3}>
              {dateFormat(app.subscriptionEnd?.toString(), 'dd mmmm yyyy')}
            </Grid>
          </Grid>
        );
      })}
    </>
  );
};
