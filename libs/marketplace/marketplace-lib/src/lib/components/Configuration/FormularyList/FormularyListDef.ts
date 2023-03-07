import { GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'NAME',
    flex: 3,
    disableColumnMenu: true,
    //headerAlign: 'center',
    headerClassName: 'super-app-theme--header',
  },
  {
    field: 'ndc',
    headerName: 'NDC',
    flex: 3,
    editable: true,
    headerClassName: 'super-app-theme--header',
    disableColumnMenu: true,
  },
  {
    field: 'qtyPerPkg',
    headerName: 'Quantity Per Package',
    flex: 5,
    headerClassName: 'super-app-theme--header',
    disableColumnMenu: true,
  },
  {
    field: 'strength',
    headerName: 'Strength',
    flex: 3,
    headerClassName: 'super-app-theme--header',
    disableColumnMenu: true,
  },
  {
    field: 'dosageForm',
    headerName: 'Dosage Form',
    flex: 3,
    headerClassName: 'super-app-theme--header',
    disableColumnMenu: true,
  },
];

export default columns;
