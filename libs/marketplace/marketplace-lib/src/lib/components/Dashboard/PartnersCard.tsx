import { Stack,Card, CardContent, Typography, Divider, Tooltip, CardHeader, Avatar, lighten} from "@mui/material"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {initialSelection,stringToColor} from '../../helpers/util';
import {IDashboardDetails,IDashboardDetailsPartner,IDashboardAvailableRx,IDashboardRXFilled,IDashboardContractedRX} from "../../interfaces/IResponses";

interface IDashboardCard {
    color?: string
    backgroundColor?: string
    icon?: React.ReactNode|React.ReactNode[]
    helpText: string
    children?: React.ReactNode|React.ReactNode[],
    dashboardData?:IDashboardDetails
}

function PartnersListCard(props: IDashboardCard) {
    const { helpText, color, icon, backgroundColor, dashboardData } = props;
    return (
        <Card sx={{flex: 12, minHeight: '165px', borderRadius: '5px' }}>
            <Tooltip title={helpText} placement="top-end" sx={{
                marginLeft: "auto",
                marginRight: '5px',
                marginTop: '5px',
                display: "block"
            }}>
                <InfoOutlinedIcon fontSize="small" />
            </Tooltip>
            <CardContent sx={{ paddingTop: 0 }}>
                <Stack direction="row">
                    <Stack sx={{ minWidth: '35%' }}>
                        <Typography sx={{ fontWeight: 'bold' }} variant="body2">{'Partners'}</Typography>
                        <Typography variant="h3" sx={{ color: backgroundColor }}>
                            {dashboardData?.association.totalAssociatedPharmacies}
                        </Typography>
                    </Stack>
                    <Stack sx={{ marginLeft: 'auto' }}>
                        {color !== undefined && icon === undefined && (
                            <Avatar sx={{ height: '82px', width: '82px', backgroundColor: lighten(color, .75) }}>
                                {icon}
                            </Avatar>
                        )}
                        {icon !== undefined && backgroundColor !== undefined && (
                            <Avatar sx={{ height: '82px', width: '82px', backgroundColor: lighten(backgroundColor, .9) }}>
                                {icon}
                            </Avatar>
                        )}
                    </Stack>
                </Stack>
                {dashboardData?.association.assocPharmacies.map((data: IDashboardDetailsPartner, index) => {
                    return (
                        <div key={index}>
                            <CardHeader sx={{ padding: '5px' }}
                                title={<Stack direction={'column'}>
                                    <Typography component={'span'} sx={{ padding: '0px', fontSize: 13, fontWeight: 600, lineHeight: '25px' }}>{data.assocPharmacyName}</Typography>
                                </Stack>}
                                avatar={<Avatar data-testid={`${'name'}-avatar`} sx={{ bgcolor: stringToColor(data.assocPharmacyName), width: '25px', height: '25px', fontSize: '12px' }}>{initialSelection(data.assocPharmacyName)}</Avatar>}>
                            </CardHeader>
                            <Divider variant='fullWidth' sx={{ display: (dashboardData?.association.assocPharmacies.length - 1) === index ? "none" : "block", width: '100%', color: '#E8E8E8' }} />
                        </div>);
                })}
            </CardContent>
        </Card>
    );
}
function ContractedRxsCard(props: IDashboardCard) {

    const { helpText, color, icon, backgroundColor, dashboardData } = props;
    return (
        <Card sx={{ flex: 12, minHeight: '165px', borderRadius: '5px' }}>
            <Tooltip title={helpText} placement="top-end" sx={{
                marginLeft: "auto",
                marginRight: '5px',
                marginTop: '5px',
                display: "block"
            }}>
                <InfoOutlinedIcon fontSize="small" />
            </Tooltip>
            <CardContent sx={{ paddingTop: 0 }}>
                <Stack direction="row">
                    <Stack sx={{ minWidth: '35%' }}>
                        <Typography sx={{ fontWeight: 'bold' }} variant="body2">{'Contracted Rxs/Day'}</Typography>
                        <Typography variant="h3" sx={{ color: '#25AD36' }}>{dashboardData?.contractedRx.totalContractedRxs}</Typography>
                    </Stack>
                    <Stack sx={{ marginLeft: 'auto' }}>
                        {color !== undefined && icon === undefined && (
                            <Avatar sx={{ height: '82px', width: '82px', backgroundColor: lighten(color, .75) }}>
                                {icon}
                            </Avatar>
                        )}
                        {icon !== undefined && backgroundColor !== undefined && (
                            <Avatar sx={{ height: '82px', width: '82px', backgroundColor: lighten(backgroundColor, .9) }}>
                                {icon}
                            </Avatar>
                        )}
                    </Stack>
                </Stack>
                {dashboardData?.contractedRx.contractedRxs.map((data: IDashboardContractedRX, index) => {
                    return (
                        <div key={index}>
                            {(dashboardData?.contractedRx.contractedRxs.length)>1 &&(
                            <CardHeader sx={{ padding: '5px' }}
                                title={<Stack direction={'column'}>
                                    <Typography component={'span'} sx={{ padding: '0px', fontSize: 12, fontWeight: 600, lineHeight: '15px' }}>{data.assocPharmacyName}</Typography>
                                    <Typography component={'span'} sx={{ padding: '0px', fontSize: 12, fontWeight: 600, lineHeight: '15px' }}>{data.contractedRx}</Typography>
                                </Stack>}
                                avatar={<Avatar data-testid={`${'name'}-avatar`} sx={{ bgcolor: stringToColor(data.assocPharmacyName), width: '25px', height: '25px', fontSize: '12px' }} key={index}>{initialSelection(data.assocPharmacyName)}</Avatar>}>
                            </CardHeader>)
                            }
                            <Divider variant='fullWidth' sx={{ display: (dashboardData?.contractedRx.contractedRxs.length - 1) === index ? "none" : "block", width: '100%', color: '#E8E8E8' }} />
                        </div>);
                })}
            </CardContent>
        </Card>
    );
}
function FilledRxsCard(props: IDashboardCard) {
    const { helpText, color, icon, backgroundColor, dashboardData } = props;
    return (
        <Card sx={{ flex: 12, minHeight: '165px', borderRadius: '5px' }}>
            <Tooltip title={helpText} placement="top-end" sx={{
                marginLeft: "auto",
                marginRight: '5px',
                marginTop: '5px',
                display: "block"
            }}>
                <InfoOutlinedIcon fontSize="small" />
            </Tooltip>
            <CardContent sx={{ paddingTop: 0 }}>
                <Stack direction="row">
                    <Stack sx={{ minWidth: '35%' }}>
                        <Typography sx={{ fontWeight: 'bold' }} variant="body2">{'No. Of Rxs Filled/Day'}</Typography>
                        <Typography variant="h3" sx={{ color: '#6525F0' }}>{dashboardData?.filledRx.totalRxsFilled}</Typography>
                    </Stack>
                    <Stack sx={{ marginLeft: 'auto' }}>
                        {color !== undefined && icon === undefined && (
                            <Avatar sx={{ height: '82px', width: '82px', backgroundColor: lighten(color, .75) }}>
                                {icon}
                            </Avatar>
                        )}
                        {icon !== undefined && backgroundColor !== undefined && (
                            <Avatar sx={{ height: '82px', width: '82px', backgroundColor: lighten(backgroundColor, .9) }}>
                                {icon}
                            </Avatar>
                        )}
                    </Stack>
                </Stack>
                {dashboardData?.filledRx.filledRxs.map((data: IDashboardRXFilled, index) => {
                    return (
                        <div key={index}>
                            {(dashboardData?.filledRx.filledRxs.length)>1 &&(
                            <CardHeader sx={{ padding: '5px' }}
                                title={<Stack direction={'column'}>
                                    <Typography component={'span'} sx={{ padding: '0px', fontSize: 12, fontWeight: 600, lineHeight: '15px' }}>{data.assocPharmacyName}</Typography>
                                    <Typography component={'span'} sx={{ color: '#2CA1FA', padding: '0px', fontSize: 12, fontWeight: 600, lineHeight: '15px' }}>{data.filledRx}</Typography>
                                </Stack>}
                                avatar={<Avatar data-testid={`${'name'}-avatar`} sx={{ bgcolor: stringToColor(data.assocPharmacyName), width: '25px', height: '25px', fontSize: '12px' }}>{initialSelection(data.assocPharmacyName)}</Avatar>}>
                            </CardHeader>
                            )}
                            <Divider variant='fullWidth' sx={{ display: (dashboardData?.filledRx.filledRxs.length - 1) === index ? "none" : "block", width: '100%', color: '#E8E8E8' }} />
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
function AvailbleRxsCard(props: IDashboardCard) {
    const { helpText, color, icon, backgroundColor, dashboardData } = props;

    return (
        <Card sx={{ flex: 12, minHeight: '165px', borderRadius: '5px' }}>
            <Tooltip title={helpText} placement="top-end" sx={{
                marginLeft: "auto",
                marginRight: '5px',
                marginTop: '5px',
                display: "block"
            }}>
                <InfoOutlinedIcon fontSize="small" />
            </Tooltip>
            <CardContent sx={{ paddingTop: 0 }}>
                <Stack direction="row">
                    <Stack sx={{ minWidth: '35%' }}>
                        <Typography sx={{ fontWeight: 'bold' }} variant="body2">{'Available Rxs/Day'}</Typography>
                        <Typography variant="h3" sx={{ color: '#333333' }}>{dashboardData?.availableRx.totalRxsAvailable}</Typography>
                    </Stack>
                    <Stack sx={{ marginLeft: 'auto' }}>
                        {color !== undefined && icon === undefined && (
                            <Avatar sx={{ height: '82px', width: '82px', backgroundColor: lighten(color, .75) }}>
                                {icon}
                            </Avatar>
                        )}
                        {icon !== undefined && backgroundColor !== undefined && (
                            <Avatar sx={{ height: '82px', width: '82px', backgroundColor: lighten(backgroundColor, .9) }}>
                                {icon}
                            </Avatar>
                        )}
                    </Stack>
                </Stack>
                {dashboardData?.availableRx.availableRxs.map((data: IDashboardAvailableRx, index) => {
                    return (
                        <div key={index}>
                            {(dashboardData?.availableRx.availableRxs.length)>1 &&(
                            <CardHeader direction={'row'} sx={{padding: '5px' }}
                                title={<Stack direction={'column'}>
                                    <Typography component={'span'} sx={{ padding: '0px', fontSize: 12, fontWeight: 600, lineHeight: '15px' }}>{data.assocPharmacyName}</Typography>
                                    <Typography component={'span'} sx={{ color: '#2CA1FA', padding: '0px', fontSize: 12, fontWeight: 600, lineHeight: '15px' }}>{data.availableRx}</Typography>
                                </Stack>}
                                avatar={<Avatar data-testid={`${'name'}-avatar`} sx={{ bgcolor: stringToColor(data.assocPharmacyName), width: '25px', height: '25px', fontSize: '12px' }}>{initialSelection(data.assocPharmacyName)}</Avatar>}>
                            </CardHeader>
                            )}
                            <Divider variant='fullWidth' sx={{ display: (dashboardData?.availableRx.availableRxs.length - 1) === index ? "none" : "block", width: '100%', color: '#E8E8E8' }} />
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
//export { PartnersListCard}
export { PartnersListCard,ContractedRxsCard,FilledRxsCard,AvailbleRxsCard }