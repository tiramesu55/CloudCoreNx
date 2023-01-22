import { forwardRef } from 'react';
import { FormControl, InputLabel, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

interface Props {
  error?: boolean;
  helperText?: string;
  inputProps?: any;
  id?: string;
  label?: string;
  required?: boolean;
  field : any;
  meta : any;
}

const BootstrapInput = styled(TextField)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    border: '1px yellow',
    position: 'relative',
    backgroundColor: theme.palette.secondary.main,
    fontSize: '18px',
    width: '100%',
    padding: '10px 12px',
    height: '24px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:focus': {
      borderColor: theme.palette.secondary.main,
    },
  },
  '& .Mui-disabled': {
    backgroundColor: theme.palette.text.disabled,
    color: theme.palette.blackFont.main,
    WebkitTextFillColor: 'black !important',
  },
}));

export const PhoneInput = forwardRef((props: Props, ref: any) => {
  const error = props.inputProps.error === 'true' ? true : false;
  const required = props.inputProps.required ? true : false;
  return (
    <FormControl variant="standard" sx={{ width: props.inputProps.width }}>
      <InputLabel
        htmlFor={props.id}
        sx={{
          fontSize: '24px',
          fontWeight: 'bold',
          paddingBottom: '24px',
          '& .MuiInputLabel-asterisk': {
            color: '#FE3F3F',
          },
        }}
        shrink
        required={required}
      >
        {props.inputProps.name}
      </InputLabel>
      <BootstrapInput
        {...props}
        {...props.field}
        inputRef={ref}
        fullWidth
        helperText={error ? props.inputProps.label : ''}
        error={error}
        required={required}
        name={props.inputProps.name}
      />
    </FormControl>
  );
});
