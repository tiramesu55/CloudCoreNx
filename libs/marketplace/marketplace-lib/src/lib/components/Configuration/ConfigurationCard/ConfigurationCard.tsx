import { Card, CardHeader, Typography, Avatar, Divider } from "@mui/material"

interface IConfigurationCard {
    name: string,
    initials: string,
    color?: string,
    children?: React.ReactNode,

}

const ConfigurationCard = (props: IConfigurationCard) => {
    const { name, initials, color, children } = props

    function stringToColor(string: string): string {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }

    const avatarColor = color ?? stringToColor(name)

    return (
        < Card raised sx={{ borderRadius: '4px' }}>
            <Typography sx={{ fontWeight: "bold", fontSize: "15pt", marginTop: "1em", marginLeft: "1em", marginBottom: "1em", }}>Orlando, Florida</Typography>

            {/* // title={<Typography component={'span'} sx={{ padding: '5px', fontSize: 16, fontWeight: 600, }}>{name}</Typography>} avatar={<Avatar data-testid={`${name}-avatar`} sx={{ bgcolor: avatarColor, width: '32px', height: '32px', fontSize: '12px' }}>{initials}</Avatar>} /> */}
            <Divider variant='fullWidth' sx={{ width: '100%', color: '#F8F8F8' }} />
            {children}
        </Card >
    )
}

export default ConfigurationCard