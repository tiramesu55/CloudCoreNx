import MUIDataTable, {
  MUIDataTableOptions,
  TableFilterList,
} from 'mui-datatables';
import { Box, FormControlLabel, Chip } from '@mui/material';
import theme from '../themes';
import { withStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

/* eslint-disable-next-line */
export interface ListProps {
  label: string;
  name: string;
  idSelected: string;
  data: any;
  changeSelectedId: (e: string) => void;
}

const MUIStyledDataTable = styled(MUIDataTable)(({ theme }) => ({
  '& .MuiButtonBase-root': {
    color: `${theme.palette.text.primary} !important`,
  },
  '& .MuiButton-root': {
    padding: theme.spacing(0),
    fontSize: theme.spacing(2),
  },
  '& .MUIDataTableHeadCell-toolButton': {
    fontWeight: 'bold',
    fontSize: `${theme.typography.subtitle1.fontSize} !important`,
    textTransform: 'capitalize !important',
  },
  '& .MuiToolbar-root': {
    backgroundColor: `${theme.palette.secondary.main} !important`,
    padding: `${theme.spacing(0)} !important`,
    paddingLeft: `${theme.spacing(2)} !important`,
  },
  '& .MUIDataTableFilterList-root': {
    backgroundColor: '#f6f5f7',
    margin: theme.spacing(0),
    paddingBottom: theme.spacing(1),
  },
  '.MuiChip-label,.MuiChip-deleteIcon': {
    color: `${theme.palette.primary.main} !important`,
  },
}));

const CustomTableCss = withStyles((theme) => ({
  '@global': {
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
    '#mui-component-select-name': {
      marginRight: theme.spacing(6),
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
  },
}))(() => null);

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

const CustomFilterList = (props: any) => {
  return <TableFilterList {...props} ItemComponent={CustomChip} />;
};

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
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => (
          <FormControlLabel
            label=""
            value={`${value?.street}, ${value?.city}`}
            control={
              <Box component={'span'}>{`${value?.street}, ${value?.city}`}</Box>
            }
            onChange={(event: any) =>
              updateValue(
                `${event.target.value?.street}, ${event.target.value?.city}`
              )
            }
            sx={{ m: 0 }}
          />
        ),
      },
    },
    {
      name: 'inactiveDate',
      label: 'Status',
      options: {
        filter: true,
        sort: false,
        customBodyRender: (
          value: boolean,
          tableMeta: any,
          updateValue: any
        ) => (
          <FormControlLabel
            label=""
            value={`${value ? 'Not Active' : 'Active'}`}
            control={
              <Box component={'span'}>{`${
                value ? 'Not Active' : 'Active'
              }`}</Box>
            }
            onChange={(event: any) =>
              updateValue(`${value ? 'Not Active' : 'Active'}`)
            }
            sx={{ m: 0 }}
          />
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
      props.changeSelectedId(props.data[rowMeta.dataIndex]?.id);
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
        <MUIStyledDataTable
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
          components={{
            TableFilterList: CustomFilterList,
          }}
        />
      </>
    )
  );
};

export default List;
