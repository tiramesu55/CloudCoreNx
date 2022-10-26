import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { Box } from '@mui/material';
import theme from '../themes';
import { withStyles } from '@mui/styles';

/* eslint-disable-next-line */
export interface ListProps {
  label: string;
  name: string;
  idSelected: string;
  data: any;
  changeSelectedId: (e: string) => void;
}

const CustomTableCss = withStyles((theme) => ({
  '@global': {
    '.css-1ya7byf-MuiButtonBase-root-MuiIconButton-root': {
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
      backgroundColor: `${theme.palette.secondary.main} !important`,
      padding: '0px !important',
      paddingLeft: '16px !important',
    },
    '.tss-1vsygk-MUIDataTableFilterList-root': {
      backgroundColor: '#f6f5f7 !important',
      margin: '0px !important',
      paddingBottom: theme.spacing(1),
    },
  },
}))(() => null);

export const List = (props: ListProps) => {
  const id = props.idSelected === '' ? props.data[0]?.id : props.idSelected;

  const columns = [
    {
      name: 'id',
      label: 'id',
      options: {
        display: false,
      },
    },
    {
      name: props.name,
      label: props.label,
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: 'address',
      label: 'Address',
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value: any) => (
          <div>{`${value?.street}, ${value?.city}`}</div>
        ),
      },
    },
    {
      name: 'inactiveDate',
      label: 'Status',
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value: boolean) => (
          <div>{value ? 'Not Active' : 'Active'}</div>
        ),
      },
    },
  ];
  const options: MUIDataTableOptions = {
    selectableRowsHideCheckboxes: true,
    pagination: false,
    tableBodyMaxHeight: '444px',
    filter: true,
    viewColumns: false,
    print: false,
    download: false,
    filterType: 'multiselect',
    onRowClick: (
      rowData: string[],
      rowMeta: { dataIndex: number; rowIndex: number }
    ) => {
      props.changeSelectedId(props.data[rowMeta.rowIndex]?.id);
    },
    setRowProps: (row) => {
      if (row[0] === id) {
        return {
          style: {
            backgroundColor: '#d6c4f5',
          },
        };
      } else {
        return {
          style: {
            cursor: 'pointer',
          },
        };
      }
    },
    rowHover: false,
    responsive: 'vertical',
  };
  return (
    props.data && (
      <>
        <CustomTableCss />
        <MUIDataTable
          title={
            <Box
              sx={{
                fontSize: theme.typography.h3.fontSize,
                fontWeight: 'bold',
              }}
            >
              Listed {props.label}
            </Box>
          }
          data={props.data}
          columns={columns}
          options={options}
        />
      </>
    )
  );
};

export default List;
