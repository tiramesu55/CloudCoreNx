import moment from 'moment';
import { DateInput } from '../../components';
import {
  Grid,
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  FormControl,
  Switch,
} from '@mui/material';
import { useTheme } from '@mui/material';

import { useEffect, useState } from 'react';
import { parseISO } from 'date-fns';
import { platformStore } from '@cloudcore/redux-store';
import {
  applicationMapping,
  selectAllApplications,
} from '@cloudcore/redux-store';

interface Application {
  appCode: string;
  subscriptionStart: Date | null;
  subscriptionEnd: Date | null;
  status?: boolean;
}
const { useAppSelector } = platformStore;
interface Props {
  siteApplications: Application[];
  siteApplicationsHandler: (value: any) => void;
  disableEditApp: boolean;
}

export const ApplicationSiteForm = (props: Props) => {
  const theme = useTheme();
  const allApplications = useAppSelector(selectAllApplications);
  const allApps = useAppSelector(applicationMapping);
  const [applications, setApplications] = useState<any[]>([]);
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    appCode: string,
    status: boolean
  ) => {
    const updatedApps = applications.map((app) => {
      if (app.appCode === appCode) {
        return {
          ...app,
          status: !status,
        };
      } else {
        return { ...app };
      }
    });
    setApplications(updatedApps);
    const updatedSiteApps = updatedApps
      .filter((app) => app.status === true)
      .map((app) => ({
        appCode: app.appCode,
        subscriptionStart: app.subscriptionStart,
        subscriptionEnd: app.subscriptionEnd,
      }));
    props.siteApplicationsHandler(updatedSiteApps);
  };

  const modifiedSiteApps = props.siteApplications
    ? props.siteApplications.map((app) => {
        return { ...app, status: true };
      })
    : [];

  const allModifiedApps = allApplications
    .map((app) => ({
      appCode: app.appCode,
      subscriptionStart: moment(new Date()).format('YYYY-MM-DD'),
      subscriptionEnd: moment(new Date()).format('YYYY-MM-DD'),
      status: false,
    }))
    .map((app) => {
      return {
        ...app,
        ...modifiedSiteApps.find((siteApp) => siteApp.appCode === app.appCode),
      };
    });

  useEffect(() => {
    setApplications(allModifiedApps);
  }, [allApplications]);

  const handleStartDateChange = (value: any, appCode: string) => {
    const updatedApps = applications.map((app) => {
      if (app.appCode === appCode) {
        return {
          ...app,
          subscriptionStart: moment(value).format('YYYY-MM-DD'),
        };
      } else {
        return {
          ...app,
        };
      }
    });
    setApplications(updatedApps);
    const updatedSiteApps = updatedApps
      .filter((app) => app.status === true)
      .map((app) => ({
        appCode: app.appCode,
        subscriptionStart: app.subscriptionStart,
        subscriptionEnd: app.subscriptionEnd,
      }));
    props.siteApplicationsHandler(updatedSiteApps);
  };

  const handleEndDateChange = (value: any, appCode: string) => {
    const updatedApps = applications.map((app) => {
      if (app.appCode === appCode) {
        return {
          ...app,
          subscriptionEnd: moment(value).format('YYYY-MM-DD'),
        };
      } else {
        return {
          ...app,
        };
      }
    });
    setApplications(updatedApps);
    const updatedSiteApps = updatedApps
      .filter((app) => app.status === true)
      .map((app) => ({
        appCode: app.appCode,
        subscriptionStart: app.subscriptionStart,
        subscriptionEnd: app.subscriptionEnd,
      }));
    props.siteApplicationsHandler(updatedSiteApps);
  };

  return (
    <Grid py={3}>
      <Grid item xs={12} display="flex" pb={2}>
        <Box
          component="span"
          sx={{ alignSelf: 'self-end', textTransform: 'capitalize' }}
        >
          <Typography
            fontSize={theme.typography.h3.fontSize}
            fontWeight="bold"
            color={theme.palette.blackFont.main}
          >
            Applications
          </Typography>
        </Box>
      </Grid>
      {applications.map(
        (app, index) =>
          app.appCode !== 'admin' && (
            <Grid
              container
              item
              xs={12}
              sx={{ paddingY: theme.spacing(2) }}
              key={index}
            >
              <Grid item xs={3}>
                <FormControl component="fieldset">
                  <FormGroup aria-label="position" row>
                    <FormControlLabel
                      checked={app.status}
                      control={
                        <Switch
                          color="primary"
                          inputProps={{ 'aria-label': 'controlled' }}
                          checked={app.status}
                          disabled={props.disableEditApp}
                          onChange={(e) =>
                            handleChange(e, app.appCode, app.status)
                          }
                        />
                      }
                      label={allApps.get(app.appCode)}
                      labelPlacement="end"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                {/* date format we need provide is yyyy-mm-dd */}
                <DateInput
                  label="Start Date"
                  value={parseISO(app.subscriptionStart)}
                  width="90%"
                  disabled={!app.status || props.disableEditApp}
                  handleStartDate={(value: any) =>
                    handleStartDateChange(value, app.appCode)
                  }
                />
              </Grid>
              <Grid item xs={3}>
                {/* date format we need provide is yyyy-mm-dd */}
                <DateInput
                  label="End Date"
                  value={parseISO(app.subscriptionEnd)}
                  width="90%"
                  disabled={!app.status || props.disableEditApp}
                  minDate={parseISO(
                    moment(app.subscriptionStart).format('YYYY-MM-DD')
                  )}
                  handleEndDate={(value: any) =>
                    handleEndDateChange(value, app.appCode)
                  }
                />
              </Grid>
            </Grid>
          )
      )}
    </Grid>
  );
};
