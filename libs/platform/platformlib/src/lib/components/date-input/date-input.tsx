import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { withStyles } from '@mui/styles';
import { parseISO } from 'date-fns';
import moment from 'moment';

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

const CustomSelectCss = withStyles(() => ({
  '@global': {
    '.css-sbxayt-MuiButtonBase-root-MuiIconButton-root-MuiPickersArrowSwitcher-button,.css-1ofniyl-MuiButtonBase-root-MuiIconButton-root':
      {
        color: `#646264 !important`,
      },
    '.css-1nydx7t-MuiButtonBase-root-MuiIconButton-root-MuiPickersArrowSwitcher-button':
      {
        color: `#646264 !important`,
      },
    '.css-sbxayt-MuiButtonBase-root-MuiIconButton-root-MuiPickersArrowSwitcher-button.Mui-disabled':
      {
        color: `#d3d3d3 !important`,
      },
    '.css-1ofniyl-MuiButtonBase-root-MuiIconButton-root.Mui-disabled': {
      color: '#d3d3d3 !important',
    },
    '.css-ymu73s-MuiFormLabel-root-MuiInputLabel-root.Mui-disabled': {
      color: '#d3d3d3 !important',
    },
    '.MuiPickersDay-dayWithMargin.Mui-disabled': {
      color: '#d3d3d3 !important',
    },
  },
}))(() => null);

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
      <CustomSelectCss />
      <DatePicker
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
      />
    </LocalizationProvider>
  );
};
