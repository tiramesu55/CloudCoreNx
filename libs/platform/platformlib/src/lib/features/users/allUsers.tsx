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
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

const { useAppDispatch, useAppSelector } = platformStore;

interface FilterList {
  title?: any[];
  userName?: any[];
  firstName?: any[];
  lastName?: any[];
  email?: any[];
  applications?: any[];
  orgName?: any[];
  status?: any[];
}

interface Props {
  handleOpenAlert: (payload: IAlert) => void;
  handleCloseAlert: () => void;
  alertData: IAlertData;
}

interface FilterList {
  title?: any[];
  userName?: any[];
  firstName?: any[];
  lastName?: any[];
  email?: any[];
  applications?: any[];
  orgName?: any[];
  status?: any[];
}

const CustomChip = ({ label, onDelete }: { label: any; onDelete: any }) => {
  return (
    <Chip
      variant="outlined"
      color="primary"
      label={label}
      onDelete={onDelete}
      deleteIcon={<CloseIcon />}
      sx={{ mr: 1, mb: 1 }}
    />
  );
};

const MUIStyledDataTable = styled(MUIDataTable)(({ theme }) => ({
  '.MuiChip-label,.MuiChip-deleteIcon': {
    color: `${theme.palette.primary.main} !important`,
  },
  '& .MuiIconButton-root': {
    color: 'inherit !important',
  },
  '& .MUIDataTableToolbar-icon': {
    color: 'inherit',
  },
  '& .MUIDataTableHeadCell-toolButton': {
    fontWeight: 'bold',
    fontSize: theme.typography.subtitle1.fontSize,
    textTransform: 'capitalize !important',
  },
  '& .MUIDataTableFilterList-root': {
    backgroundColor: '#f6f5f7',
    margin: theme.spacing(0),
    paddingBottom: theme.spacing(1),
  },
  '& .MuiTablePagination-selectIcon': {
    color: 'inherit !important',
  },
  '& .MuiToolbar-root': {
    backgroundColor: `${theme.palette.secondary.main} !important`,
    padding: `${theme.spacing(0)} !important`,
    paddingLeft: `${theme.spacing(2)} !important`,
  },
}));

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
  const [filters, setFilters] = useState<FilterList>(
    location.state?.filters
      ? location.state.filters
      : {
          firstName: [],
          lastName: [],
          userName: [],
          title: [],
          applications: [],
          email: [],
          orgName: [],
          status: [],
        }
  );
  const [selectedEmail, setSelectedEmail] = useState(
    location.state?.selectedId ? location.state.selectedId : ''
  );

  window.history.replaceState(
    {
      from: 'dashboard',
      currentPage,
      rowsPerPage,
      selectedId: selectedEmail,
      filters,
    },
    document.title
  );

  const handleFilterChange = (
    column: any,
    value: any,
    type: any,
    index: any,
    displayData: any
  ) => {
    if (location?.state?.filters !== undefined) {
      history.replace({
        title: 'Edit User',
        task: 'editUser',
        from: 'editUser',
        currentPage,
        rowsPerPage,
        selectedId: selectedEmail,
      });
    }
    if (type === 'reset') {
      setFilters({
        firstName: [],
        lastName: [],
        userName: [],
        title: [],
        applications: [],
        email: [],
        orgName: [],
        status: [],
      });
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [column]: value[index],
      }));
    }
  };

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
        filterList: filters?.firstName,
      },
    },
    {
      name: 'lastName',
      label: 'Last Name',
      options: {
        display: false,
        filterList: filters?.lastName,
      },
    },
    {
      name: 'email',
      label: 'Email',
      options: {
        display: false,
        filterList: filters?.email,
      },
    },
    {
      name: 'userName',
      label: 'User Name',
      options: {
        filter: true,
        sort: true,
        filterList: filters?.userName,
        customBodyRender: (value: string, tableMeta: any) => {
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
                    filters,
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
        filterList: filters?.title,
      },
    },
    {
      name: 'orgName',
      label: 'Organization',
      options: {
        filter: true,
        sort: false,
        filterList: filters?.orgName,
      },
    },
    {
      name: 'applications',
      label: 'Applications',
      options: {
        filter: true,
        sort: false,
        filterList: filters?.applications,
        customBodyRender: (value: any) => {
          if (value === '--' || value.length < 1) {
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
        filterList: filters?.status,
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
          data-testid="addnewuser"
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
    onFilterChange: (
      column,
      filterList,
      type,
      changedColumnIndex,
      displayData
    ) =>
      handleFilterChange(
        column,
        filterList,
        type,
        changedColumnIndex,
        displayData
      ),
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
    setRowProps: (row) => {
      if (row[2] === selectedEmail) {
        return {
          style: {
            backgroundColor: '#d6c4f5',
          },
        };
      } else {
        return {};
      }
    },
    onChangePage(currentPage) {
      setCurrentPage(currentPage);
      history.replace({
        title: 'Edit User',
        task: 'editUser',
        from: 'editUser',
        rowsPerPage,
        filters,
        selectedId: selectedEmail,
      });
    },
    onChangeRowsPerPage(numberOfRows) {
      setRowsPerPage(numberOfRows);
      history.replace({
        title: 'Edit User',
        task: 'editUser',
        from: 'editUser',
        currentPage,
        filters,
        selectedId: selectedEmail,
      });
    },
    rowHover: false,
  };

  const CustomTableCss = withStyles(() => ({
    '@global': {
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

      '#mui-component-select-name': {
        marginRight: theme.spacing(6),
      },
      '.MuiPopover-paper': {
        '& .MuiSvgIcon-root': {
          color: `${theme.palette.text.primary}`,
        },
        '& .MuiCheckbox-root.Mui-checked': {
          '& .MuiSvgIcon-root': {
            color: `${theme.palette.primary.main} !important`,
          },
        },
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
            <MUIStyledDataTable
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
export default ListUsers;
