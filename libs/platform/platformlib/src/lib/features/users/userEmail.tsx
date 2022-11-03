import { useEffect, useState, useMemo, useContext } from 'react';
import { platformStore } from '@cloudcore/redux-store';
import {
  Button,
  Box,
  Grid,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Card } from '@cloudcore/ui-shared';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  selectOrganizationByDomain,
  selectUserByIdEntity,
  selectUserID,
} from '@cloudcore/redux-store';
import { useTheme } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { ConfigCtx, IConfig } from '@cloudcore/okta-and-config';
import TitleAndCloseIcon from '../../components/TitleAndClose/TitleAndClose';

const { useAppDispatch, useAppSelector } = platformStore;

export const AddUserForm = () => {
  const config: IConfig = useContext(ConfigCtx)!;
  const path = useMemo(() => {
    return `${config.isMainApp ? '/platform/' : '/'}`;
  }, [config.isMainApp]);
  const theme = useTheme();
  const [emailID, setEmailID] = useState('');
  const dispatch = useAppDispatch();

  const org = useAppSelector((state) =>
    selectOrganizationByDomain(state, emailID.toLowerCase())
  );
  const usr = useAppSelector(selectUserByIdEntity(emailID));

  const style = {
    Card: {
      minHeight: '70vh',
    },
  };

  const history = useHistory();

  const closeAddUser = () => {
    history.push(`${path}user`);
  };

  useEffect(() => {
    dispatch(selectUserID(emailID.toLowerCase()));
  }, [dispatch, emailID]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <TitleAndCloseIcon
          onClickButton={closeAddUser}
          breadCrumbOrigin={'Add New User'}
          breadCrumbTitle={''}
        />
        {/* <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingX: theme.spacing(3),
            paddingY: theme.spacing(2),
          }}
        >
          <Typography
            variant="subtitle1"
            fontSize="18px"
            color={theme.breadcrumLink.primary}
          >
            Add New User
          </Typography>
          <IconButton sx={{ color: '#000000' }} onClick={closeAddUser}>
            <CloseIcon fontSize="large" />
          </IconButton>
        </Box> */}
      </Grid>
      <Grid item xs={12}>
        <Grid container paddingX={3}>
          <Card style={style.Card}>
            <Grid py={4} px={2}>
              {/* <Stepper /> 
              {stage === 1 ? ( */}
              <Grid container item>
                <Grid item xs={4}></Grid>
                <Grid
                  item
                  xs={4}
                  sx={{ textAlign: 'center', marginTop: '10%' }}
                >
                  <Typography sx={{ marginBottom: 2 }}>
                    Please input the user email ID to fetch the user Data
                  </Typography>
                  <TextField
                    value={emailID}
                    id="outlined-basic"
                    type="email"
                    fullWidth={true}
                    label="Email ID"
                    variant="outlined"
                    inputProps={{ maxLength: 100 }}
                    onChange={(e) => setEmailID(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {emailID.match(
                            /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                          ) ? (
                            <CheckIcon color="primary" />
                          ) : null}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={4}></Grid>
              </Grid>
            </Grid>
          </Card>
          <Grid item xs={12} my={2}>
            <Box
              sx={{
                alignItems: 'flex-end',
                display: 'flex',
                justifyContent: 'end',
                paddingX: theme.spacing(0),
              }}
            >
              <Button
                variant="outlined"
                disabled={!org}
                onClick={() => {
                  if (usr) {
                    history.push(`${path}user/editUser`, {
                      title: 'Edit User',
                      task: 'editUser',
                      from: 'editUser',
                    });
                  } else {
                    history.push(`${path}user/addUser`, {
                      from: 'addUser',
                      task: 'addUser',
                    });
                  }
                }}
                sx={{
                  fontSize: theme.typography.subtitle1.fontSize,
                  fontWeight: 'bold',
                  paddingX: theme.spacing(5),
                }}
              >
                NEXT
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
