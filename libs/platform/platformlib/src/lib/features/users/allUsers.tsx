/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { useEffect, useState, useContext } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { Box, Grid, Button } from "@mui/material";
import theme from "../../themes";
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { withStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";
import { Snackbar, Card } from "../../components";
import Tooltip from "@mui/material/Tooltip";
import { applicationMapping,
  getApplications, selectOrganizations, selectUserID, Application, fetchUsers, allUsers } from '@cloudcore/redux-store';
import { ConfigCtx } from "@cloudcore/okta-and-config";
import { useOktaAuth } from "@okta/okta-react";

interface Props {}

const CustomTableCss = withStyles(() => ({
  "@global": {
    ".css-1ya7byf-MuiButtonBase-root-MuiIconButton-root": {
      color: "inherit !important",
    },
    ".tss-1f6q3ny-MUIDataTableToolbar-icon": {
      color: "inherit !important",
    },
    "*::-webkit-scrollbar-button": {
      height: "0px",
    },
    "*::-webkit-scrollbar": {
      width: "0.4em",
    },
    "*::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      borderRadius: "10px",
    },
    ".css-1m9da53-MuiButtonBase-root-MuiButton-root": {
      padding: "0px !important",
    },
    ".tss-1fbujeu-MUIDataTableHeadCell-toolButton": {
      fontWeight: "bold !important",
      fontSize: "18px !important",
      textTransform: "capitalize !important",
    },
    ".tss-tlx3x1-MUIDataTableToolbar-root": {
      backgroundColor: "#f6f5f7 !important",
      padding: "0px !important",
    },
    ".tss-1vsygk-MUIDataTableFilterList-root": {
      backgroundColor: "#f6f5f7 !important",
      margin: "0px !important",
      paddingBottom: theme.spacing(1),
    },
    ".MuiTablePagination-selectIcon": {
      color: "inherit !important",
    },
  },
}))(() => null);

export const ListUsers = (props: Props) => {
  const dispatch = useAppDispatch();
  const {platformBaseUrl} = useContext(ConfigCtx)!;   // at this point config is not null (see app)
  // const baseUrl = useAppSelector(selectBaseUrl);
  
  const users = useAppSelector(allUsers);
  const allApps = useAppSelector(applicationMapping);
  const orgData = useAppSelector(selectOrganizations);
  const { authState } = useOktaAuth();
  const usersWithOrg = users.map((user) => {
    const orgName = orgData.find((org) => {
      return user.orgCode === org.orgCode;
    });
    return {
      ...user,
      orgName: orgName?.name,
    };
  });
  const history = useHistory();
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarType, setSnackBarType] = useState("");
  const [snackBarMsg, setSnackBarMsg] = useState("");
  //const [error, setError] = useState(false);

  useEffect(() => {
    if (platformBaseUrl) {
      dispatch(getApplications({url: platformBaseUrl, token: authState?.accessToken?.accessToken}));
      dispatch(fetchUsers({url: platformBaseUrl, token: authState?.accessToken?.accessToken}));
    }
  }, [platformBaseUrl, dispatch, authState]);

  const { error } = useAppSelector((state) => state.user);
  useEffect(() => {
    if (error) {
      setSnackbar(true);
      setSnackBarType("fetchError");
      setSnackBarMsg("editUserFailure");
    }
  }, [error]);

  const columns = [
    {
      name: "firstName",
      label: "First Name",
      options: {
        display: false,
      },
    },
    {
      name: "lastName",
      label: "Last Name",
      options: {
        display: false,
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        display: false,
      },
    },
    {
      name: "firstName",
      label: "User Name",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string, tableMeta: any) => {
          const tableData = tableMeta.tableData;
          const index = tableMeta.rowIndex;
          const rowData = tableData[index];
          return (
            <Tooltip
              title={
                <Box sx={{ fontSize: theme.typography.body2.fontSize }}>
                  {" "}
                  {tableMeta.rowData[2]}
                </Box>
              }
              placement="bottom-start"
            >
              <Button
                variant="text"
                disableRipple={true}
                style={{
                  textDecoration: "none",
                  color: theme.palette.primary.main,
                  cursor: "pointer",
                  fontStyle: "capitalize",
                  fontWeight: "normal",
                  textTransform: "capitalize",
                  fontSize: theme.typography.subtitle1.fontSize,
                }}
                onClick={() => {
                  dispatch(selectUserID(tableMeta.rowData[2]));
                  history.replace("/user/editUser", {
                    title: "Edit User",
                    task: "editUser",
                    from: "editUser",
                  });
                }}
              >
                {tableMeta.rowData[0]} {tableMeta.rowData[1]}
              </Button>
            </Tooltip>
          );
        },
      },
    },
    {
      name: "title",
      label: "Title",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "orgName",
      label: "Organization",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "applications",
      label: "Applications",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value: any) => {
          const appCodeArray: any = [];
          value?.forEach((app: Application) => {
            if (app.roles && app.roles.length > 0) {
              appCodeArray.push(allApps.get(app.appCode));
            }
          });

          const apps = appCodeArray.flat();

          return <>{apps && apps.length ? apps.join(", ") : "--"}</>;
        },
      },
    },
    {
      name: "inactiveDate",
      label: "Status",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value: Date) => (
          <div>
            {value === null || new Date(value) >= new Date()
              ? "Active"
              : "Not Active"}
          </div>
        ),
      },
    },
  ];

  const CustomToolbar = () => {
    return (
      <Button
          variant="text"
          disableRipple={true}
          sx={{
            textTransform: "capitalize",
            fontWeight: "bold",
            fontSize: "18px",

            textDecoration: "none",
            color: theme.palette.primary.main,
          }}
          onClick={() => {
            history.push("user/email", { title: "Add User", task: "addUser" });
          }}
        >
          Add New User
        </Button>
    );
  };

  const options: MUIDataTableOptions = {
    selectableRowsHideCheckboxes: true,
    selectableRowsOnClick: false,
    pagination: true,
    tableBodyMaxHeight: "75vh",
    filter: true,
    viewColumns: false,
    print: false,
    download: false,
    filterType: "multiselect",
    customToolbar: CustomToolbar,
    enableNestedDataAccess: ".",
    searchAlwaysOpen: true,

    /* onCellClick: async (
      colData: any,
      cellMeta: {
        colIndex: number;
        rowIndex: number;
        dataIndex: number;
      }
    ) => {
      console.log(colData, "colData");
      const email = users[cellMeta.rowIndex].email;
      if (email && cellMeta.colIndex === 3) {
        dispatch(selectUserID(email));
        history.replace("/user/editUser", {
          title: "Edit User",
          task: "editUser",
          from: "editUser",
        });
      }
    }, */
    rowHover: false,
  };

  return (
    <Grid container>
      <>
        {snackbar && <Snackbar type={snackbarType} content={error} />}
        <CustomTableCss />
        <Grid item xs={12} sx={{ paddingTop: theme.spacing(2) }}>
          <Card sx={{ margin: "0px 24px", border: "none" }}>
            <MUIDataTable
              title={
                <Box sx={{ fontSize: theme.typography.subtitle1.fontSize }}>
                  All Users
                </Box>
              }
              data={usersWithOrg}
              columns={columns}
              options={options}
            />
          </Card>
        </Grid>
      </>
    </Grid>
  );
};

