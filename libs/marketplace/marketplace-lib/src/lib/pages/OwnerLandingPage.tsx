import { Stack, Typography, Box } from "@mui/material"
import { blue, deepOrange, green, purple } from "@mui/material/colors"
import { AvailbleRxsCard, ContractedRxsCard, FilledRxsCard, PartnersListCard } from "../components/Dashboard/PartnersCard"
import { useEffect, useState, useContext } from 'react';
import { marketplaceStore, getDashboardDetails } from '@cloudcore/redux-store';
import { IDashboardDetails } from "../interfaces/IResponses";
import {
    ConfigCtx,
    IConfig,
    useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
const { useAppDispatch } = marketplaceStore;

function OwnerLandingPage() {
    const config: IConfig = useContext(ConfigCtx)!;
    const [dasboardDetailsState, setDasboardDetails] = useState<IDashboardDetails>();
    //const dashboardDetails = useAppSelector(getDashboardInfo);

    const okt = useClaimsAndSignout();
    const dispatch = useAppDispatch();
    const params = {
        FacilityId: 100,
        PharmacyId: 100
    };

    useEffect(() => {
        const token = okt?.token;
        if (config.functionAppBaseUrl) {
            dispatch(
                getDashboardDetails({
                    url: config.functionAppBaseUrl,
                    token: token,
                    params: params
                })
            )
                .unwrap()
                .then(
                    (res: any) => {
                        setDasboardDetails(res.data.data);
                    }
                )
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [config.functionAppBaseUrl, dispatch, okt?.token]);

    return (
        <Box marginLeft={1.5} marginRight={1.5} sx={{ width: '95%' }}>
            <Stack direction="row" spacing={.5} sx={{ mt: 2, mb: 2 }}>
                <Typography component={'span'} sx={{ textTransform: "uppercase", fontWeight: 'bold', color: 'rgb(88, 89, 91)' }}>Operations Dashboard</Typography>
                <Typography variant="body2" component={'span'} sx={{ textTransform: "capitalize", mb: 'auto !important', color: 'rgb(88, 89, 91)', mt: 'auto !important' }}>(Current Date / Time)</Typography>
            </Stack>
            <Stack direction="row" spacing={4}>
                <PartnersListCard dashboardData={dasboardDetailsState} color={blue[500]} helpText="testing" backgroundColor={blue[500]} icon={<img width={'40px'} height={'40px'} src={require("../assets/Partner.png")} alt="card" />}>
                </PartnersListCard>
                <ContractedRxsCard dashboardData={dasboardDetailsState} color={'#25AD36'} helpText="testing" backgroundColor={green[800]} icon={<img width={'40px'} height={'40px'} src={require("../assets/RxOrder_Green.png")} alt="card" />}>
                </ContractedRxsCard>

                <FilledRxsCard dashboardData={dasboardDetailsState} color={'#6513F0'} helpText="testing" backgroundColor={purple[800]} icon={<img width={'40px'} height={'40px'} src={require("../assets/Target_purple.png")} alt="card" />} >
                </FilledRxsCard>
                <AvailbleRxsCard dashboardData={dasboardDetailsState} color={'#D3793B'} helpText="testing" backgroundColor={deepOrange[500]} icon={<img src={require("../assets/WaveAsset.png")} alt="card" />}>
                </AvailbleRxsCard>
            </Stack>
        </Box>
    );
}

export default OwnerLandingPage;