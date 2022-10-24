import {
  Box,
  Button,
  Card,
  Grid,
  MobileStepper,
  Paper,
  Typography,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import LowerButton from '../../components/LowerButtons';
import { theme } from '@cloudcore/ui-shared';
import { platformStore } from '@cloudcore/redux-store';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { useEffect, useState, useContext, useMemo } from 'react';
import TitleAndCloseIcon from '../../components/TitleAndClose';
import { ConfigCtx, IConfig } from '@cloudcore/okta-and-config';

const style = {
  Card: {
    width: '100%',
    justifyContent: 'center',
    overflow: 'auto',
    paddingBottom: '10px',
  },
  Grid: {
    justifyContent: 'center',
  },
};

const steps = [
  {
    label: 'Step 1',
    description: `Download template and fill in with user information. Please ensure there are no empty rows or column values.`,
  },
  {
    label: 'Step 2',
    description: `Once file is saved hit the "NEXT" button.`,
  },
  {
    label: 'Step 3',
    description: `On the following screen select from the drop down the organization to upload users for. 
                    Note, only one organization can be uploaded for at a time.`,
  },
  {
    label: 'Step 4',
    description: `Select the file to upload by clicking the '...' button. 
                    Note, only .csv files are allowed.`,
  },
  {
    label: 'Step 5',
    description: `Click 'Import Data' button and wait for success, warning or failure alert.
                    If successful new users will be viewable on the main users page.`,
  },
];

const UserOnboardingInstructions = () => {
  const config: IConfig = useContext(ConfigCtx)!;
  const path = useMemo(() => {
    return `${config.isMainApp ? '/platform/' : '/'}`;
  }, [config.isMainApp]);
  const history = useHistory();
  const { useAppDispatch } = platformStore;
  const dispatch = useAppDispatch();

  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = steps.length;
  useEffect(() => {
    if (activeStep) {
      setActiveStep(activeStep);
    }
  }, [activeStep]);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const closeInstructions = () => {
    history.push(`${path}user/`);
  };

  const moveUserOnboarding = () => {
    history.push(`${path}user/onboarding`, { from: 'onboarding' });
  };

  const download = (data: string) => {
    // Creating a Blob for having a csv file format
    // and passing the data with type
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8' });
    // Creating an object for downloading url
    const url = window.URL.createObjectURL(blob);
    // Creating an anchor(a) tag of HTML
    const a = document.createElement('a');
    // Passing the blob downloading url
    a.setAttribute('href', url);
    // Setting the anchor tag attribute for downloading
    // and passing the download file name
    a.setAttribute('download', 'template.csv');
    // Performing a download with click
    a.click();
  };

  //columns for template csv download
  const columns = 'email,firstname,lastname,phone,title,city,street,zip,state';

  return (
    <Grid container>
      <TitleAndCloseIcon
        breadCrumbOrigin="ALL USERS"
        breadCrumbTitle="Import Users"
        onClickButton={closeInstructions}
      ></TitleAndCloseIcon>
      <Grid item xs={12}>
        <Grid container style={style.Grid} paddingX={3}>
          <Card style={style.Card}>
            <Grid py={4} px={2}>
              <Typography
                fontSize={theme.typography.h3.fontSize}
                fontWeight="bold"
                color={theme.palette.blackFont.main}
              >
                Import User Instructions
              </Typography>
              <Grid container item sx={{ marginBottom: '6.75%' }}>
                <Grid item xs={3}></Grid>
                <Grid item xs={6} sx={{ textAlign: 'center' }}>
                  <Paper
                    square
                    elevation={0}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      height: 50,
                      pl: 2,
                      bgcolor: 'background.default',
                    }}
                  >
                    <Typography>{steps[activeStep].label}</Typography>
                  </Paper>
                  <Box sx={{ width: '100%', height: '40px', p: 2 }}>
                    {steps[activeStep].description}
                  </Box>
                  <MobileStepper
                    variant="text"
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    nextButton={
                      <Button
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === maxSteps - 1}
                      >
                        Next
                        {theme.direction === 'rtl' ? (
                          <KeyboardArrowLeft />
                        ) : (
                          <KeyboardArrowRight />
                        )}
                      </Button>
                    }
                    backButton={
                      <Button
                        size="small"
                        onClick={handleBack}
                        disabled={activeStep === 0}
                      >
                        {theme.direction === 'rtl' ? (
                          <KeyboardArrowRight />
                        ) : (
                          <KeyboardArrowLeft />
                        )}
                        Back
                      </Button>
                    }
                  />
                  <br></br>
                  <Button
                    color="primary"
                    variant="outlined"
                    component="span"
                    sx={{
                      marginRight: theme.spacing(2),
                    }}
                    onClick={() => {
                      download(columns);
                    }}
                  >
                    Get Template
                  </Button>
                </Grid>
                <Grid item xs={3}></Grid>
              </Grid>
            </Grid>
          </Card>
          <LowerButton
            buttonName="NEXT"
            onClickButton={moveUserOnboarding}
          ></LowerButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UserOnboardingInstructions;
