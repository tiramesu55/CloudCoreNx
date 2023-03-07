import { Box, Button, Grid } from '@mui/material';

interface Props {
  onClickButton: () => void;
  buttonName: string;
}

const LowerButton = (props: Props) => {
  return (
    <Grid item xs={12} my={2}>
      <Box
        sx={{
          alignItems: 'flex-end',
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <Button variant="outlined" onClick={props.onClickButton}>
          {props.buttonName}
        </Button>
      </Box>
    </Grid>
  );
};
export default LowerButton;
