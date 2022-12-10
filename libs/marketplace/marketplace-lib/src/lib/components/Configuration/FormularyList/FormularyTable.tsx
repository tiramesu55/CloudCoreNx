import { Box, darken } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import mockFormularyList from '../../../mocks/FormularyList';

//TODO align vendor w/ center
//TODO style font for rows
//style search and partner

const columns: GridColDef[] = [
    {
        field: 'vendorId',
        headerName: 'Vendor',
        flex: 1,
        disableColumnMenu: true,
        headerAlign: 'center',
        align: 'center',
        headerClassName: 'super-app-theme--header',

    },
    {
        field: 'description',
        headerName: 'Description',
        flex: 6,
        editable: true,
        headerClassName: 'super-app-theme--header',
        disableColumnMenu: true,

    },
    {
        field: 'ndc',
        headerName: 'ndc',
        flex: 2,
        editable: true,
        headerClassName: 'super-app-theme--header',
        disableColumnMenu: true
    },
    {
        field: 'slot',
        headerName: 'Slot',
        flex: 2,
        editable: true,
        headerClassName: 'super-app-theme--header',
        disableColumnMenu: true
    },
    {
        field: 'stock',
        headerName: 'Stock',
        flex: 2,
        editable: true,
        headerClassName: 'super-app-theme--header',
        disableColumnMenu: true
    },
    {
        field: 'open',
        headerName: 'open/rts',
        flex: 1.5,
        editable: true,
        headerClassName: 'super-app-theme--header',
        disableColumnMenu: true
    },

];

const FormularyTable = () => {
    return (
        <Box sx={{
            width: '98%', padding: '18px',
            '& .super-app-theme--header': {
                backgroundColor: darken('#F8F8F8', .05), textTransform: 'uppercase',
                fontSize: '18px',
                marginTop: 'auto',
                marginBottom: 'auto',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold',
                width: '100%'
            },
            "& .MuiDataGrid-sortIcon": {
                color: 'black'
            },
            "& .MuiDataGrid-iconButtonContainer": {
                marginLeft: 'auto',
                visibility: 'visible !important',
                width: 'auto !important',
            },
            "& .MuiDataGrid-columnHeaderTitleContainerContent": {
                width: '100%'
            },
            "& .MuiDataGrid-columnHeader--alignCenter": {
                textAlign: 'center'
            }
        }}>
            <DataGrid
                autoHeight={true}
                sx={{ color: 'black' }}
                rows={mockFormularyList}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
            />
        </Box>)
}

export default FormularyTable