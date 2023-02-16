import { Box, darken } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import mockFormularyList from '../../../mocks/FormularyList';
import Pagination from '@mui/material/Pagination';
import {
    gridPageCountSelector,
    gridPageSelector,
    useGridApiContext,
    useGridSelector,
} from '@mui/x-data-grid';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { flexbox } from '@mui/system';
import Stack from '@mui/material/Stack';


//TODO align vendor w/ center
//TODO style font for rows
//style search and partner

const columns: GridColDef[] = [
    {
        field: 'Name',
        headerName: 'NAME',
        flex: 3,
        disableColumnMenu: true,
        // headerAlign: 'center',
        headerClassName: 'super-app-theme--header',

    },
    {
        field: 'NDC',
        headerName: 'NDC',
        flex: 3,
        editable: true,
        headerClassName: 'super-app-theme--header',
        disableColumnMenu: true,

    },
    {
        field: 'QuantityPerPackage',
        headerName: 'Quantity Per Package',
        flex: 5,
        editable: true,
        headerClassName: 'super-app-theme--header',
        disableColumnMenu: true
    },
    {
        field: 'Strength',
        headerName: 'Strength',
        flex: 3,
        editable: true,
        headerClassName: 'super-app-theme--header',
        disableColumnMenu: true
    },
    {
        field: 'Dosage',
        headerName: 'Dosage Form',
        flex: 3,
        editable: true,
        headerClassName: 'super-app-theme--header',
        disableColumnMenu: true
    },
    {
        field: 'Vendor',
        headerName: 'Vendor',
        flex: 3,
        editable: true,
        headerClassName: 'super-app-theme--header',
        disableColumnMenu: true
    },

];

function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (

        <Pagination
            color="primary"
            count={pageCount} shape="rounded"
            defaultPage={1} siblingCount={0}
            page={page + 1}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
            renderItem={(item) => (
                <PaginationItem
                    sx={{ border: ".3pt solid lightgray" }}
                    slots={{ previous: ArrowBackIosNewIcon, next: ArrowForwardIosIcon }}
                    {...item}

                />

            )}
        />


    );
}
const FormularyTable = () => {

    return (
        <Box sx={{
            width: '98%', padding: '18px',
            '& .super-app-theme--header': {
                backgroundColor: '#E0E2E5', textTransform: 'uppercase',
                fontSize: '14px',
                marginTop: 'auto',
                marginBottom: 'auto',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold',
                width: '100%'
            },
            "& .MuiDataGrid-sortIcon": {
                color: 'black',

            },
            "& .MuiDataGrid-iconButtonContainer": {
                marginLeft: 'auto',
                visibility: 'visible !important',
                width: 'auto !important',
            },
            "& .MuiDataGrid-columnSeparator": {
                color: "#FFFFFF",


            },
            "& .MuiDataGrid-columnHeaderTitleContainerContent": {
                width: '100%'
            },
            "& .MuiDataGrid-columnHeader--alignCenter": {
                textAlign: 'center'

            },
            '& .MuiDataGrid-footerContainer': {
                display: 'flex',
                justifyContent: 'center'

            },
        }}>

            <DataGrid
                pagination
                autoHeight={true}
                sx={{ color: 'black' }}
                rows={mockFormularyList}
                columns={columns}
                pageSize={8}
                rowsPerPageOptions={[8]}
                disableSelectionOnClick
                components={{
                    Pagination: CustomPagination,
                }}

            />
        </Box>
    )

}

export default FormularyTable