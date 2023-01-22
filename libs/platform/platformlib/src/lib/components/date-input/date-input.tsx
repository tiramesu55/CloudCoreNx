import * as React from 'react';
import { TextField, styled } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { parseISO } from 'date-fns';
import moment from 'moment';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

interface Props {
  label: string;
  value: Date;
  width?: string;
  disabled?: boolean;
  minDate?: Date;
  handleStartDate?: (value: any) => void;
  handleEndDate?: (value: any) => void;
  handleError?: (value: boolean) => void;
}

const StyledDesktopDatePicker = styled(DesktopDatePicker)(({ theme }) => ({
  '& .MuiButtonBase-root': {
    color: theme.palette.primary.main,
    '&.Mui-disabled': { opacity: 0.5 },
  },
}));

const LeftArrowButton = () => {
  return <KeyboardArrowLeftIcon sx={{ color: '#646264' }} />;
};

const RightArrowButton = () => {
  return <KeyboardArrowRightIcon sx={{ color: '#646264' }} />;
};

export const DateInput = (props: Props) => {
  const [value, setValue] = React.useState<Date | null>(props.value);
  const [currentError, setCurrentError] = React.useState('');
  const [errorDate, setErrorDate] = React.useState(false);

  React.useEffect(() => {
    setValue(props.value);
    //setErrorDate(errorDate);
  }, [props.value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StyledDesktopDatePicker
        label={props.label}
        value={value}
        onError={(reason: any, value: any) => {
          if (reason) {
            // reason is the error , which it will be displayed as
            // default error message ,you can also  pass your own error
            // message depending on the error

            setCurrentError('Invalid Date');
            setErrorDate(true);
          } else {
            setCurrentError('');
            setErrorDate(false);
          }
        }}
        onChange={(newValue: any) => {
          if (newValue === null) {
            setValue(newValue);
            setErrorDate(errorDate);
          } else {
            setValue(parseISO(moment(newValue).format('YYYY-MM-DD')));
            props.handleStartDate && props.handleStartDate(newValue);
            props.handleEndDate && props.handleEndDate(newValue);
            props.handleError && props.handleError(errorDate);
          }
        }}
        renderInput={(params: any) => {
          return (
            <TextField
              {...params}
              fullWidth={true}
              sx={{ width: props.width }}
              required={true}
              error={errorDate}
              helperText={currentError ?? currentError}
            />
          );
        }}
        inputFormat="MM/dd/yyyy"
        disabled={props.disabled}
        minDate={props.minDate}
        className={'date$$$$$'}
        components={{
          LeftArrowIcon: LeftArrowButton,
          RightArrowIcon: RightArrowButton,
        }}
      />
    </LocalizationProvider>
  );
};
