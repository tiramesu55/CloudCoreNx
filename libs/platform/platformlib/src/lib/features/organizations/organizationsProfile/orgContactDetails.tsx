import { Grid, Typography, Box, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import { platformStore } from '@cloudcore/redux-store';
import { useTheme } from '@mui/material';
import {
  organizationSelector,
  selectedId,
  selectOrganizations,
} from '@cloudcore/redux-store';
import Tooltip from '@mui/material/Tooltip';

const { useAppSelector } = platformStore;
export const OrgContactDetails = () => {
  const theme = useTheme();
  const organizations = useAppSelector(selectOrganizations);
  const selectId = useAppSelector(selectedId);
  const testId = selectId === '' ? organizations[0]?.id : selectId;
  const organization = useSelector((state: any) =>
    organizationSelector.selectById(state, testId)
  );
  const orgDomains = organization?.orgDomains;
  return (
    <Box>
      <Grid container>
        <Grid item xs={12}>
          <Typography
            component={'div'}
            sx={{
              fontSize: theme.typography.subtitle1.fontSize,
              fontWeight: 'bold',
              paddingY: theme.spacing(2),
              paddingRight: theme.spacing(4),
            }}
          >
            Organization Contact Details
            <Divider />
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography
            sx={{
              fontSize: theme.typography.subtitle1.fontSize,
              fontWeight: 'bold',
            }}
          >
            Org Domains
          </Typography>
          <Box sx={{ display: 'inline-flex' }}>
            <Typography
              sx={{
                fontSize: theme.typography.subtitle1.fontSize,
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                maxWidth: '200px',
              }}
            >
              {<Box component={'span'}>{orgDomains && orgDomains[0]}</Box>}
            </Typography>

            <Typography component={"div"}>
              {orgDomains && orgDomains.length > 1 ? (
                <Tooltip
                  sx={{ cursor: 'default' }}
                  title={
                    <Box>
                      {orgDomains.slice(1).map((domain, index) => (
                        <Box
                          sx={{
                            fontSize: theme.typography.subtitle1.fontSize,
                            p: 1,
                          }}
                          key = {index}
                        >
                          {domain}
                        </Box>
                      ))}
                    </Box>
                  }
                >
                  <Box pl={1} fontWeight={'bold'}>{`+${
                    organization?.orgDomains?.length - 1
                  }`}</Box>
                </Tooltip>
              ) : (
                <Box></Box>
              )}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Typography
            sx={{
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
        <Grid item xs={4}>
          <Typography
            sx={{
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
        <Grid item xs={4} sx={{ pt: 4 }}>
          <Typography
            sx={{
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
            {`${organization?.address?.state}`}
          </Typography>
        </Grid>
        <Grid item xs={4} sx={{ pt: 4 }}>
          <Typography
            sx={{
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
        <Grid item xs={4} sx={{ pt: 4 }}>
          <Typography
            sx={{
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
        <Grid item xs={4} sx={{ pt: 4, mb: 4 }}>
          <Typography
            sx={{
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
