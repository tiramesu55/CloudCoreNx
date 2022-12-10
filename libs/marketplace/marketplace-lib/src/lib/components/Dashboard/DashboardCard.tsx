import { Card, CardContent, Typography, CardActions, Button, Tooltip, CardHeader, Avatar, Icon, lighten, SxProps } from "@mui/material"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Stack } from "@mui/system";

interface IDashboardCard {
    color?: string
    backgroundColor?: string
    icon?: React.ReactNode
    helpText: string
    children?: React.ReactNode
}

interface IDashboardContent {
    sectionTitle: string,
    value: string,
    sectionTitle2?: string,
    value2?: string
    valueProps?: SxProps
}

const DashboardContent = (props: IDashboardContent) => {
    const { sectionTitle, value, sectionTitle2, value2, valueProps } = props

    return (
        <Stack sx={{ minWidth: '35%' }}>
            <Typography variant="body2">{sectionTitle}</Typography>
            <Typography variant="h3" sx={{ ...valueProps }} >{value}</Typography>
            <Typography variant="body2">{sectionTitle2}</Typography>
            <Typography variant="h3" sx={{ ...valueProps }}>{value2}</Typography>
        </Stack >
    )
}


const DashboardCard = (props: IDashboardCard) => {
    const { helpText, color, icon, children, backgroundColor } = props

    console.log(icon)

    return (
        <Card sx={{ flex: 12, borderBottom: `5px solid ${color}`, minHeight: '165px', borderRadius: '5px' }}>
            <Tooltip title={helpText} placement="top-end" sx={{
                marginLeft: "auto",
                marginRight: '5px',
                marginTop: '5px',
                display: "block"
            }}>
                <InfoOutlinedIcon fontSize="small" />
            </Tooltip>
            <CardContent sx={{ paddingTop: 0 }}>
                <Stack direction="row" >
                    {children}

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
            </CardContent>
        </Card >
    )
}

export { DashboardCard, DashboardContent }