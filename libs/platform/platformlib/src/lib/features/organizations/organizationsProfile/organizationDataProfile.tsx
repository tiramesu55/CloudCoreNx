import { Grid, Box, Typography, Button } from '@mui/material';
import { platformStore } from '@cloudcore/redux-store';
import { useTheme } from '@mui/material';
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

  const handleClick = () => {
    history.replace(`${path}organization/editOrganization`, {
      title: 'Edit Organization',
      task: 'editOrganization',
      from: 'editOrganization',
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
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ mr: 2 }}>
                <Typography component={'span'} variant="h3" fontWeight={'bold'}>
                  {organization?.name}
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
                  {`${organization?.address?.street}, ${organization?.address?.city}`}
                </Typography>
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
              {/* <Button
                                type="submit"
                                variant="outlined"
                                size="large"
                                color="primary"
                                aria-haspopup="true"
                                aria-controls="error"
                                aria-label="error"
                                sx={{
                                    fontSize: theme.typography.subtitle1.fontSize,
                                    fontWeight: "bold",
                                    paddingX: theme.spacing(5),
                                    paddingY: theme.spacing(1.1),
                                    marginRight: theme.spacing(2),
                                }}
                            >
                                ADD SUB ORG
                            </Button> */}
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
                }}
              >
                EDIT
              </Button>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
