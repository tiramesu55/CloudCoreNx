import { Card, CardHeader, Typography, Divider, Stack, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { SetStateAction, useContext, useEffect, useMemo, useState } from "react";
import FormularyTable from "./FormularyTable";
import Avatar from '@mui/material/Avatar';
import { deepOrange, deepPurple } from '@mui/material/colors';
import { getFormularyList, IFormularyDetails } from "libs/redux-store/src/lib/marketplace/formulary/FormularySlice";
import { ConfigCtx, useClaimsAndSignout, IConfig } from "@cloudcore/okta-and-config";
import { useAppDispatch } from "libs/redux-store/src/lib/store-platform";
import { uniq, filter } from 'lodash'
import { debounce } from 'throttle-debounce';
import { GridSortModel } from "@mui/x-data-grid";


export interface IFormularyListHeader {
    searchValue: string;
    paginationValue: string;
    setSearchValue: React.Dispatch<React.SetStateAction<string>>;
    setStartSearch: React.Dispatch<React.SetStateAction<boolean>>;
    setPagination: React.Dispatch<React.SetStateAction<string>>;

}

const FormularyListHeader = (props: IFormularyListHeader) => {
    const { setSearchValue, setStartSearch, paginationValue, setPagination } = props

    const changePageSize = (event: SelectChangeEvent) => {
        setPagination(event.target.value as string);
        setStartSearch(true)
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        setStartSearch(true)
    };

    const handleSearch = () => {
        setStartSearch(true)
    }

    const debounceFunc = debounce(300, (e) => {
        handleChange(e)
    });


    useEffect(() => {
        return () => {
            debounceFunc.cancel();
        };
    });

    return (
        <Stack direction="row">
            {/* <Typography component={'span'} sx={{ padding: '5px', fontSize: 16, fontWeight: 600, }}>Formulary List</Typography> */}
            <FormControl sx={{
                "& .MuiInputBase-root": {
                    height: '65%',
                    borderRadius: '2px',
                    paddingRight: '13px',
                    backgroundColor: 'white'
                }, m: 0, marginTop: '2px', width: '30ch'
            }} variant="outlined" size="small">
                <OutlinedInput
                    id="outlined-adornment-password"
                    type='text'
                    onChange={debounceFunc}
                    sx={{
                        '& legend': { display: 'none' },
                        '& fieldset': { top: 0 },
                    }}
                    placeholder="Search"
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                sx={{
                                    backgroundColor: '#6513F0', color: 'white',
                                    height: '28px',
                                    width: "28px",
                                    marginLeft: "35px",
                                    borderRadius: "4px"
                                }}
                                aria-label="toggle password visibility"
                                onClick={handleSearch}
                                onMouseDown={handleSearch}
                                edge="end"
                            >
                                <SearchIcon sx={{ backgroundColor: "#6513F0" }} />
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Search"
                />
            </FormControl>

            <Typography component={'span'} sx={{ padding: '5px', fontSize: 16, fontWeight: 600, ml: 'auto !important', }}>Per Page</Typography>
            <FormControl sx={{
                "& .MuiInputBase-root": {
                    height: '70%',
                    borderRadius: '2px',
                    width: "75px"
                },

                width: "75px",
                marginBottom: '5px !important',
                marginTop: '0px !important'
            }} size="small">
                <Select
                    id="test-select"
                    value={paginationValue}
                    onChange={changePageSize}
                    displayEmpty
                    sx={{
                        "& .MuiSvgIcon-root": {
                            color: 'black'
                        },

                    }}
                >
                    <MenuItem value={15}>15</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                </Select>
            </FormControl>
        </Stack>
    )
}

const FormularyList = () => {

    const [page, setPage] = useState(0)
    const [oldPage, setOldPage] = useState<number>(-1)
    const [formularyData, setFormularyData] = useState<IFormularyDetails[]>([]);
    const [recordCount, setRecordCount] = useState(0)
    const [searchValue, setSearchValue] = useState("")
    const [searching, setStartSearch] = useState(false)
    const [sort, setSort] = useState<GridSortModel>([])
    const [paginationValue, setPagination] = useState("15")

    const config: IConfig = useContext(ConfigCtx)!;
    const okt = useClaimsAndSignout();
    const dispatch = useAppDispatch();

    useMemo(() => {

        let params = {
            FacilityId: 100,
            PharmacyId: 100,
            PageNumber: page + 1,
            SearchText: searchValue,
            sortColumn: (sort?.length > 0 ? sort[0].field : ""),
            sortOrder: (sort?.length > 0 ? sort[0].sort : ""),
            PageSize: paginationValue
        };

        const token = okt?.token;

        if (page !== oldPage) {
            dispatch(getFormularyList({
                url: `${config.functionAppBaseUrl}`,
                token: token,
                params: params
            }))
                .unwrap()
                .then((res: any) => {
                    const data = res.data.data.formularyList
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        const check = filter(formularyData, { ndc: element.ndc })
                        if (check.length < 1) {
                            setFormularyData((oldArray) => [...oldArray, element])
                        }
                    }
                    setOldPage(page)
                    setRecordCount(res.data.data.recordCount)
                })
                .catch((err) => {
                    console.error(err)
                })

            setStartSearch(false)
        } if (searching) {
            dispatch(getFormularyList({
                url: `${config.functionAppBaseUrl}`,
                token: token,
                params: params
            }))
                .unwrap()
                .then((res: any) => {
                    const data = res.data.data.formularyList
                    setFormularyData(data)
                    setRecordCount(res.data.data.recordCount)
                })
                .catch((err) => {
                    console.error(err)
                })

            setStartSearch(false)
        }
    }, [page, searching]);

    return (
        <>
            {<FormularyListHeader setSearchValue={setSearchValue} searchValue={searchValue} setStartSearch={setStartSearch} paginationValue={paginationValue} setPagination={setPagination} />}
            < Card raised sx={{ borderRadius: '4px' }}>
                <Stack direction="row" sx={{ marginLeft: "2em", marginTop: "1em", marginBottom: '1em' }}>
                    <Typography sx={{ color: "black", fontWeight: "bold", marginLeft: "-.5em", marginTop: ".2em", fontSize: "15pt" }}>Orlando, Florida</Typography>
                    {/* <Avatar sx={{ bgcolor: "#c0ca33", width: 45, height: 45, fontSize: "14px", fontWeight: "bold" }}>GP</Avatar>
                    <Typography sx={{ color: "black", fontWeight: "bold", marginLeft: "1em", marginTop: ".4em" }}>Green Pharmacy</Typography> */}
                </Stack>
                <Divider variant='fullWidth' sx={{ width: '100%', color: '#F8F8F8' }} />
                <FormularyTable data={formularyData} recordCount={recordCount} setPage={setPage} setSort={setSort} setStartSearch={setStartSearch} pageSize={parseInt(paginationValue, 10)} />
            </Card >
        </>
    )
}

export default FormularyList