/* eslint-disable react/jsx-no-useless-fragment */
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { Box } from "@mui/material";
import theme from "../../themes";
import {
  getOrganizationsAsync,
  selectedId,
  selectedIdOrganization,
  selectOrganizations,
  selectBaseUrl
} from '@cloudcore/redux-store';
import { withStyles } from "@mui/styles";
import { useEffect } from "react";
console.log(theme)
const CustomTableCss = withStyles(() => ({
  "@global": {
    ".css-1ya7byf-MuiButtonBase-root-MuiIconButton-root": {
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
      backgroundColor: `${theme.palette.secondary.main} !important`,
      padding: "0px !important",
      paddingLeft: "16px !important",
    },
    ".tss-1vsygk-MUIDataTableFilterList-root": {
      backgroundColor: "#f6f5f7 !important",
      margin: "0px !important",
      paddingBottom: theme.spacing(1),
    },
  },
}))(() => null);

export const OrganizationList = () => {
  const data = useAppSelector(selectOrganizations);
  const baseUrl = useAppSelector(selectBaseUrl);
  const idSelected = useAppSelector(selectedId);
  const dispatch = useAppDispatch();
  const id = idSelected === "" ? data[0]?.id : idSelected;

  useEffect(() => {
    if (baseUrl) {
      dispatch(getOrganizationsAsync(baseUrl));
    }
  }, [dispatch, baseUrl]);

  useEffect(() => {
    if (data.length > 0 && idSelected === "") {
      dispatch(selectedIdOrganization(data[0]?.id));
    }
  }, [data]);

  const columns = [
    {
      name: "id",
      label: "id",
      options: {
        display: false,
      },
    },
    {
      name: "name",
      label: "Organizations",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "address",
      label: "Address",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value: any) => (
          <div>{`${value?.street}, ${value?.city}`}</div>
        ),
      },
    },
    {
      name: "inactiveDate",
      label: "Status",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value: boolean) => (
          <div>{value ? "Not Active" : "Active"}</div>
        ),
      },
    },
  ];
  const options: MUIDataTableOptions = {
    selectableRowsHideCheckboxes: true,
    pagination: false,
    tableBodyMaxHeight: "444px",
    filter: true,
    viewColumns: false,
    print: false,
    download: false,
    filterType: "multiselect",
    onRowClick: (
      rowData: string[],
      rowMeta: { dataIndex: number; rowIndex: number }
    ) => {
      dispatch(selectedIdOrganization(data[rowMeta.rowIndex].id));
    },
    setRowProps: (row: any) => {
      if (row[0] === id) {
        return {
          style: {
            backgroundColor: "#d6c4f5",
          },
        };
      } else {
        return {
          style: {
            cursor: "pointer",
          },
        };
      }
    },
    rowHover: false,
    responsive: "vertical",
  };
  return (
    <>
      {data !== null && (
        <>
          <CustomTableCss />
          <MUIDataTable
            title={
              <Box
                sx={{
                  fontSize: theme.typography.h3.fontSize,
                  fontWeight: "bold",
                }}
              >
                Listed Organizations
              </Box>
            }
            data={data}
            columns={columns}
            options={options}
          />
        </>
      )}
    </>
  );
};

