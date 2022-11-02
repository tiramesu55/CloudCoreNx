import { Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import { Address } from '@cloudcore/redux-store';

interface Props {
  address: Address | undefined;
  sitePhone: string | undefined;
  siteEmail: string | undefined;
}

export const SiteContactDetails = (props: Props) => {
  const theme = useTheme();
  return (
    <>
      <Typography
        sx={{
          fontSize: theme.typography.h5.fontSize,
          my: 3,
          fontWeight: 'bold',
        }}
      >
        Site Contact Details:
      </Typography>
      <Grid item container>
        <Grid item xs={6}>
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
            {props.address?.street}
          </Typography>
        </Grid>
        <Grid item xs={3}>
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
            {props.address?.city}
          </Typography>
        </Grid>
        <Grid item xs={3}>
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
            {props.address?.zip}
          </Typography>
        </Grid>
        <Grid item xs={6} sx={{ paddingTop: theme.spacing(4) }}>
          <Typography
            sx={{
              paddingBottom: theme.spacing(1.5),
              fontSize: theme.typography.subtitle1.fontSize,
              fontWeight: 'bold',
            }}
          >
            Site Phone
          </Typography>
          <Typography
            sx={{
              fontSize: theme.typography.subtitle1.fontSize,
            }}
          >
            {props.sitePhone}
          </Typography>
        </Grid>
        <Grid item xs={6} sx={{ paddingTop: theme.spacing(4) }}>
          <Typography
            sx={{
              paddingBottom: theme.spacing(1.5),
              fontSize: theme.typography.subtitle1.fontSize,
              fontWeight: 'bold',
            }}
          >
            Site Email ID
          </Typography>
          <Typography
            sx={{
              fontSize: theme.typography.subtitle1.fontSize,
            }}
          >
            {props.siteEmail}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};
