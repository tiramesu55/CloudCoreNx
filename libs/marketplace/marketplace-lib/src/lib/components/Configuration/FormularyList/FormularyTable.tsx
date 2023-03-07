import { Box, darken } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
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
import { IFormularyDetails } from 'libs/redux-store/src/lib/marketplace/formulary/FormularySlice';
import columns from './FormularyListDef';
import { useCallback } from 'react';

//TODO align vendor w/ center
//TODO style font for rows
//style search and partner

export interface ICustomPagination {
    pageHandler: React.Dispatch<React.SetStateAction<number>>
}

const CustomPagination = (props: ICustomPagination) => {

    const { pageHandler } = props

    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
        <Pagination
            color="primary"
            count={pageCount}
            page={page + 1}
            onChange={(event, value) => {
                pageHandler(value - 1)
                apiRef.current.setPage(value - 1)
            }}
        />
    );
}

export interface IFormularyTable {
    data?: IFormularyDetails[]
    recordCount?: number
    setPage: React.Dispatch<React.SetStateAction<number>>
    setSort: React.Dispatch<React.SetStateAction<GridSortModel>>
    setStartSearch: React.Dispatch<React.SetStateAction<boolean>>;
    pageSize: number
}

const FormularyTable = (props: IFormularyTable) => {

    const { data, recordCount, setPage, setSort, setStartSearch, pageSize } = props

    const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
        // Here you save the data you need from the sort model
        //setQueryOptions({ sortModel: [...sortModel] });
        setSort(sortModel)
        setStartSearch(true)
    }, []);


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

            {data && (<DataGrid
                pagination={true}
                autoHeight={true}
                getRowId={(row) => row.ndc}
                sx={{ color: 'black' }}
                rows={data}
                columns={columns}
                pageSize={pageSize}
                rowsPerPageOptions={[pageSize]}
                disableSelectionOnClick
                rowCount={recordCount}
                sortingMode="server"
                onSortModelChange={handleSortModelChange}
                components={{
                    Pagination: CustomPagination,
                }}
                componentsProps={{
                    pagination: {
                        pageHandler: setPage
                    }
                }}
            />)

            }

        </Box>
    )

}

export default FormularyTable