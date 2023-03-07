import { Grid, Typography, Divider } from '@mui/material';
import { useTheme } from '@mui/material';

interface Address {
  street: string;
  city: string;
  zip: string;
  state: string;
}
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
        component="div"
        sx={{
          fontSize: theme.typography.subtitle1.fontSize,
          paddingTop: theme.spacing(4),
          paddingBottom: theme.spacing(2),
          fontWeight: 'bold',
        }}
      >
        Site Contact Details:
        <Divider />
      </Typography>
      <Grid item container>
        <Grid item xs={4}>
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
        <Grid item xs={2.5}>
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
        <Grid item xs={2.5}>
          <Typography
            sx={{
              paddingBottom: theme.spacing(1.5),
              fontSize: theme.typography.subtitle1.fontSize,
              fontWeight: 'bold',
            }}
          >
            State/Prov
          </Typography>
          <Typography
            sx={{
              fontSize: theme.typography.subtitle1.fontSize,
            }}
          >
            {props.address?.state}
          </Typography>
        </Grid>
        <Grid item xs={2.5}>
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
        <Grid item xs={4} sx={{ paddingTop: theme.spacing(4) }}>
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
        <Grid item xs={4} sx={{ paddingTop: theme.spacing(4) }}>
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
export default SiteContactDetails;
