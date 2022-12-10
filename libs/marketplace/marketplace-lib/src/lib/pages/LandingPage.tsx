
import { Stack, darken, Typography, Box } from "@mui/material"
import { blue, deepOrange, green, red, } from "@mui/material/colors"
import { DashboardCard, DashboardContent } from "../components/Dashboard/DashboardCard"

const LandingPage = () => {

    //TODO API call to get card colors

    return (
        <Box marginLeft={1.5} marginRight={1.5} sx={{ width: '95%' }}>
            <Stack direction="row" spacing={.5} sx={{ mt: 2, mb: 2 }}>
                <Typography component={'span'} sx={{ textTransform: "uppercase", fontWeight: 'bold', color: 'rgb(88, 89, 91)' }}>Operations Dashboard</Typography>
                <Typography variant="body2" component={'span'} sx={{ textTransform: "capitalize", mb: 'auto !important', color: 'rgb(88, 89, 91)', mt: 'auto !important' }}>(Current Date / Time)</Typography>
            </Stack>
            <Stack direction="row" spacing={4}>
                <DashboardCard color={blue[500]} helpText="testing" backgroundColor={blue[50]} icon={<img src={require("../assets/AIMAsset.png")} alt="card" />}>
                    <DashboardContent sectionTitle="Owner Name" value="AIM" />
                </DashboardCard>
                <DashboardCard color={darken(red[500], .25)} backgroundColor={red[500]} helpText="testing" icon={<img src={require("../assets/RxAsset.png")} alt="card" />}>
                    <DashboardContent valueProps={{ color: darken(red[500], .25) }} sectionTitle="Contracted Rxs" value="1500" />
                </DashboardCard>
                <DashboardCard color={darken(green[500], .25)} helpText="testing" backgroundColor={green[800]} icon={<img src={require("../assets/TargetAsset.png")} alt="card" />}>
                    <DashboardContent valueProps={{ color: darken(green[500], .25) }} sectionTitle="No. Of Rxs Filled" value="343" />
                </DashboardCard>
                <DashboardCard color={deepOrange[500]} backgroundColor={deepOrange[500]} helpText="testing" icon={<img src={require("../assets/WaveAsset.png")} alt="card" />} >
                    <DashboardContent sectionTitle="Daily Utilization" value="29%" sectionTitle2="Total Pending Rxs" value2="1157" />
                </DashboardCard>
            </Stack>

        </Box >

    )
}

export default LandingPage