import { Box, Grid, IconButton, Typography } from '@mui/material';
import { theme } from '@cloudcore/ui-shared';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  onClickButton: () => void;
  breadCrumbOrigin: string;
  breadCrumbTitle: string;
}

const TitleAndCloseIcon = (props: Props) => {
  return (
    <Grid item xs={12}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingX: theme.spacing(3),
          paddingY: theme.spacing(2),
        }}
      >
        <Typography
          variant="subtitle1"
          fontSize="18px"
          color={theme.breadcrumLink.primary}
        >
          {props.breadCrumbOrigin}/{' '}
          <Box component={'span'} sx={{ fontWeight: 'bold' }}>
            {props.breadCrumbTitle}
          </Box>
        </Typography>
        <IconButton sx={{ color: '#000000' }} onClick={props.onClickButton}>
          <CloseIcon fontSize="large" />
        </IconButton>
      </Box>
    </Grid>
  );
};
export default TitleAndCloseIcon;
