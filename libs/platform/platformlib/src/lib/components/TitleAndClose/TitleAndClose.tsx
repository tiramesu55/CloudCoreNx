import { Box, Grid, IconButton, Typography, Button } from '@mui/material';
import { theme } from '@cloudcore/ui-shared';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  onClickButton?: () => void;
  breadCrumbOrigin: string;
  breadCrumbTitle: string;
  addBtn?: boolean;
  addBtnText?: string;
  onClickAddBtn?: () => void;
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
          paddingY: theme.spacing(3),
        }}
      >
        <Typography
          variant="subtitle1"
          fontSize="18px"
          color={theme.breadcrumLink.primary}
        >
          {props.breadCrumbOrigin}
          {props.breadCrumbTitle ? (
            <Box component={'span'} sx={{ fontWeight: 'bold' }}>
              {` / ${props.breadCrumbTitle}`}
            </Box>
          ) : (
            <Box></Box>
          )}
        </Typography>
        <Box>
          {props.addBtn && (
            <Button
              variant="contained"
              sx={{ marginRight: theme.spacing(0) }}
              onClick={props.onClickAddBtn}
            >
              {props.addBtnText}
            </Button>
          )}
          {props.onClickButton && (
            <IconButton sx={{ color: '#000000' }} onClick={props.onClickButton}>
              <CloseIcon fontSize="large" />
            </IconButton>
          )}
        </Box>
      </Box>
    </Grid>
  );
};
export default TitleAndCloseIcon;
