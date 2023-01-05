/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { useEffect, useState, useContext, useMemo } from 'react';
import { platformStore } from '@cloudcore/redux-store';

import { Box, Grid, Button, Chip, useTheme } from '@mui/material';
import MUIDataTable, {
  MUIDataTableOptions,
  TableFilterList,
} from 'mui-datatables';
import { withStyles } from '@mui/styles';
import { useHistory, useLocation } from 'react-router-dom';
import { Card, Snackbar } from '@cloudcore/ui-shared';
import Tooltip from '@mui/material/Tooltip';
import {
  selectOrganizations,
  selectUserID,
  fetchUsers,
  allUsers,
  applicationMapping,
} from '@cloudcore/redux-store';
import {
  ConfigCtx,
  IConfig,
  UseClaimsAndSignout,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import { IAlert, IAlertData } from '@cloudcore/common-lib';

const { useAppDispatch, useAppSelector } = platformStore;

interface Props {
  handleOpenAlert: (payload: IAlert) => void;
  handleCloseAlert: () => void;
  alertData: IAlertData;
}
const CustomChip = ({ label, onDelete }: { label: any; onDelete: any }) => {
  return (
    <Chip
      variant="outlined"
      color="primary"
      label={label}
      onDelete={onDelete}
    />
  );
};

const CustomFilterList = (props: any) => {
  return <TableFilterList {...props} ItemComponent={CustomChip} />;
};

export const ListUsers = (props: Props) => {
  const { handleOpenAlert, handleCloseAlert, alertData } = props;
  const config: IConfig = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const path = useMemo(() => {
    return `${config.isMainApp ? '/platform/' : '/'}`;
  }, [config.isMainApp]);
  const { token } = useClaimsAndSignout() as UseClaimsAndSignout;
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { platformBaseUrl } = useContext(ConfigCtx)!; // at this point config is not null (see app)
  const allApps = useAppSelector(applicationMapping);
  const users = useAppSelector(allUsers);
  console.log(users, 'dsgdfg');
  const orgData = useAppSelector(selectOrganizations);
  const usersWithOrg = users.map((user) => {
    const orgName = orgData.find((org) => {
      return user.orgCode === org.orgCode;
    });
    return {
      ...user,
      orgName: orgName?.name,
      userName: `${user.firstName} ${user.lastName}`,
      applications:
        user.applications !== null
          ? user.applications.map((app) => allApps && allApps.get(app.appCode))
          : '--',
      status:
        user.inactiveDate === null || new Date(user.inactiveDate) >= new Date()
          ? 'Active'
          : 'Not Active',
    };
  });
  const history = useHistory();
  const location: any = useLocation();
  const [currentPage, setCurrentPage] = useState(
    location.state?.currentPage ? location.state?.currentPage : 0
  );
  const [rowsPerPage, setRowsPerPage] = useState(
    location.state?.rowsPerPage ? location.state?.rowsPerPage : 10
  );
  //const [error, setError] = useState(false);

  useEffect(() => {
    if (platformBaseUrl) {
      dispatch(
        fetchUsers({
          url: platformBaseUrl,
          token: token,
        })
      )
        .unwrap()
        .then(
          (value: any) => {
            //Do Nothing
          },
          (reason: any) => {
            handleOpenAlert({
              content: reason.message,
              type: 'error',
            });
          }
        );
    }
  }, [platformBaseUrl, dispatch, token]);

  const columns = [
    {
      name: 'firstName',
      label: 'First Name',
      options: {
        display: false,
      },
    },
    {
      name: 'lastName',
      label: 'Last Name',
      options: {
        display: false,
      },
    },
    {
      name: 'email',
      label: 'Email',
      options: {
        display: false,
      },
    },
    {
      name: 'userName',
      label: 'User Name',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string, tableMeta: any) => {
          console.log(value, 'user');
          return (
            <Tooltip
              title={
                <Box sx={{ fontSize: theme.typography.body2.fontSize }}>
                  {' '}
                  {tableMeta.rowData[2]}
                </Box>
              }
              placement="bottom-start"
            >
              <Button
                variant="text"
                disableRipple={true}
                style={{
                  textDecoration: 'none',
                  color: theme.palette.primary.main,
                  cursor: 'pointer',
                  fontStyle: 'capitalize',
                  fontWeight: 'normal',
                  textTransform: 'capitalize',
                  fontSize: theme.typography.subtitle1.fontSize,
                }}
                onClick={() => {
                  dispatch(selectUserID(tableMeta.rowData[2]));
                  history.replace(`${path}user/editUser`, {
                    title: 'Edit User',
                    task: 'editUser',
                    from: 'editUser',
                    currentPage,
                    rowsPerPage,
                  });
                }}
              >
                {value}
              </Button>
            </Tooltip>
          );
        },
      },
    },
    {
      name: 'title',
      label: 'Title',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: 'orgName',
      label: 'Organization',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: 'applications',
      label: 'Applications',
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value: any) => {
          if (value === '--') {
            return <>{'--'}</>;
          } else {
            return <>{value.join(', ')}</>;
          }
        },
      },
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: true,
        sort: false,
      },
    },
  ];
  const CustomToolbar = () => {
    return (
      <>
        <Button
          variant="text"
          disableRipple={true}
          sx={{
            textTransform: 'capitalize',
            fontWeight: 'bold',
            fontSize: '18px',

            textDecoration: 'none',
            color: theme.palette.primary.main,
          }}
          onClick={() => {
            history.push(`${path}user/email`, {
              title: 'Add User',
              task: 'addUser',
            });
          }}
        >
          Add New User
        </Button>
        <Button
          variant="text"
          disableRipple={true}
          sx={{
            textTransform: 'capitalize',
            fontWeight: 'bold',
            fontSize: '18px',

            textDecoration: 'none',
            color: theme.palette.primary.main,
          }}
          onClick={() => {
            history.push(`${path}user/onboarding`);
          }}
        >
          Import Users
        </Button>
      </>
    );
  };

  const options: MUIDataTableOptions = {
    selectableRowsHideCheckboxes: true,
    selectableRowsOnClick: false,
    pagination: true,
    page: currentPage,
    rowsPerPage,
    tableBodyMaxHeight: '72vh',
    filter: true,
    viewColumns: false,
    print: false,
    download: false,
    filterType: 'multiselect',
    customToolbar: CustomToolbar,
    enableNestedDataAccess: '.',
    searchAlwaysOpen: true,
    sortOrder: {
      name: 'userName',
      direction: 'asc',
    },
    onChangePage(currentPage) {
      setCurrentPage(currentPage);
    },
    onChangeRowsPerPage(numberOfRows) {
      setRowsPerPage(numberOfRows);
    },
    rowHover: false,
  };

  const CustomTableCss = withStyles(() => ({
    '@global': {
      '.css-1ya7byf-MuiButtonBase-root-MuiIconButton-root': {
        color: 'inherit !important',
      },
      '.tss-1f6q3ny-MUIDataTableToolbar-icon': {
        color: 'inherit !important',
      },
      '*::-webkit-scrollbar-button': {
        height: '0px',
      },
      '*::-webkit-scrollbar': {
        width: '0.4em',
      },
      '*::-webkit-scrollbar-track': {
        '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,.1)',
        borderRadius: '10px',
      },
      '.css-1m9da53-MuiButtonBase-root-MuiButton-root': {
        padding: '0px !important',
      },
      '.tss-1fbujeu-MUIDataTableHeadCell-toolButton': {
        fontWeight: 'bold !important',
        fontSize: '18px !important',
        textTransform: 'capitalize !important',
      },
      '.tss-tlx3x1-MUIDataTableToolbar-root': {
        backgroundColor: '#f6f5f7 !important',
        padding: '0px !important',
      },
      '.tss-1vsygk-MUIDataTableFilterList-root': {
        backgroundColor: '#f6f5f7 !important',
        margin: '0px !important',
        paddingBottom: theme.spacing(1),
      },
      '.MuiTablePagination-selectIcon': {
        color: 'inherit !important',
      },
    },
  }))(() => null);

  return (
    <Grid container>
      <>
        <Snackbar
          open={alertData.openAlert}
          type={alertData.type}
          content={alertData.content}
          onClose={handleCloseAlert}
          duration={3000}
        />
        <CustomTableCss />
        <Grid item xs={12} sx={{ margin: theme.spacing(2.5) }}>
          <Card sx={{ border: 'none' }}>
            <MUIDataTable
              title={
                <Box sx={{ fontSize: theme.typography.subtitle1.fontSize }}>
                  All Users
                </Box>
              }
              data={usersWithOrg}
              columns={columns}
              options={options}
              components={{
                TableFilterList: CustomFilterList,
              }}
            />
          </Card>
        </Grid>
      </>
    </Grid>
  );
};
