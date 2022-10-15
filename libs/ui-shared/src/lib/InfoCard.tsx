import { Box, Button, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Card } from './Card';
import { useTheme } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import { useHistory } from 'react-router-dom';

interface Props {
  title: string;
  count: number;
  image: string;
  editSites?: boolean;
  orgCode?: string;
  orgName?: string;
}

const style = {
  queueImage: {
    height: '100%',
    width: '51px',
  },
  displayFlex: {
    display: 'flex',
  },
};

export const InfoCard = (props: Props) => {
  const theme = useTheme();
  const history = useHistory();
  const redirectToEditSites = () => {
    history.push('/organization/sites', {
      from: '/organization/editSite',
      orgCode: props.orgCode,
      orgName: props.orgName,
    });
  };
  return (
    <Card style={style.displayFlex}>
      <Grid container component="div">
        <Box
          component="img"
          style={style.queueImage}
          src={props.image}
          sx={{
            [theme.breakpoints.between(350, 1270)]: {
              marginLeft: '15px',
            },
            [theme.breakpoints.between(1270, 1470)]: {
              marginLeft: '30px',
            },
            [theme.breakpoints.up(1470)]: {
              marginLeft: '40px',
            },
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <CardContent sx={{ flex: '1 0 auto', width: 'auto' }}>
            <Box
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                [theme.breakpoints.down(700)]: {
                  width: '170px',
                },
                [theme.breakpoints.between(1350, 1430)]: {
                  width: '190px',
                },
                [theme.breakpoints.between(1150, 1350)]: {
                  width: '150px',
                },
                [theme.breakpoints.between(1000, 1150)]: {
                  width: '115px',
                },
              }}
            >
              <Typography
                noWrap
                component="span"
                sx={{ fontSize: '18px', textAlign: 'inherit' }}
                align="center"
              >
                {props.title}
              </Typography>
            </Box>
            <Typography
              component="div"
              variant="h2"
              sx={{ fontWeight: 'bold' }}
            >
              {props.count}
            </Typography>
          </CardContent>
        </Box>
        {props.editSites && props.count > 0 && (
          <Button
            variant="text"
            disableRipple={true}
            focusRipple={false}
            onClick={redirectToEditSites}
            sx={{
              display: 'flex',
              alignItems: 'center',
              paddingRight: theme.spacing(2),
            }}
          >
            <Typography
              sx={{
                color: theme.palette.primary.main,
                fontSzie: theme.typography.subtitle1.fontSize,
                cursor: 'pointer',
              }}
            >
              Edit Sites
            </Typography>
          </Button>
        )}
      </Grid>
    </Card>
  );
};
