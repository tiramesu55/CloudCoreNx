import { Divider, Grid, useTheme } from '@mui/material';
import { platformStore } from '@cloudcore/redux-store';
import { applicationMapping, getAppsByOrgCode } from '@cloudcore/redux-store';
import dateFormat from 'dateformat';

interface Application {
  appCode: string;
  subscriptionStart: Date | null;
  subscriptionEnd: Date | null;
}

interface Props {
  orgCode: string;
  applications: Application[] | undefined;
}

const { useAppSelector } = platformStore;

export const ApplicationBySites = (props: Props) => {
  const theme = useTheme();
  const allApps = useAppSelector(applicationMapping);
  const accessibleAppsList = useAppSelector((state) =>
    getAppsByOrgCode(state, props.orgCode)
  );

  const applications = props.applications
    ? props.applications.filter((app) =>
        accessibleAppsList.includes(app.appCode)
      )
    : [];

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
          app.appCode !== 'admin' && (
            <Grid
              item
              container
              xs={12}
              sx={{
                fontSize: theme.typography.h6.fontSize,
                mt: theme.spacing(2),
              }}
              key={key}
            >
              <Grid item xs={6}>
                {allApps && allApps.get(app.appCode)}
              </Grid>
              <Grid item xs={3}>
                {dateFormat(app.subscriptionStart?.toString(), 'dd mmmm yyyy')}
              </Grid>
              <Grid item xs={3}>
                {dateFormat(app.subscriptionEnd?.toString(), 'dd mmmm yyyy')}
              </Grid>
            </Grid>
          )
        );
      })}
    </>
  );
};
export default ApplicationBySites;
