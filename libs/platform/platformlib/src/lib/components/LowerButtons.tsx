import { Box, Button, Grid} from '@mui/material';
import theme from '../../../../../ui-shared/src/lib/themes'; 

  interface Props{
    onClickButton: ()=>void;
    buttonName:string;
  }

const LowerButton =(props:Props)=> {
    return (
      <Grid item xs={12} my={2}>
      <Box
          sx={{
          alignItems: "flex-end",
          display: "flex",
          justifyContent: "end",
          paddingX: theme.spacing(0),
          }}
      >
          <Button
           variant="outlined"
           sx={{ marginRight: theme.spacing(2) }}
          onClick={props.onClickButton}
          >
          {props.buttonName}
          </Button>
      </Box>
      </Grid>
  );
}
export default LowerButton;