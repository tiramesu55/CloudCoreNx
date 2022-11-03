import { styled } from '@mui/material/styles';
import { InputLabel, FormControl } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { withStyles } from '@mui/styles';
import { useState } from 'react';
import { getSuiteFormModified, platformStore } from '@cloudcore/redux-store';

interface Props {
  label?: string;
  defaultValue?: any;
  id: string;
  formWidth?: string;
  type?: string;
  value: string;
  fieldName?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  InputProps?: any;
  placeholder?: string;
  options?: string[];
  changeHandler?: (val: any) => void;
  orgChangeHandler?: (event: any) => void;
  domainChangeHandler?: (event: any) => void;
  permissionChangeHandler?: (event: any) => void;
  unsavedDataHandler?: (open: boolean) => void;
  handleDomainReset?: (flag: boolean) => void;
  handlePermissionReset?: (flag: boolean) => void;
}

const CustomSelect = styled(Select)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    fontSize: '18px',
    width: '100%',
    padding: '6px 10px',
    height: '20px',
    /* transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]), */
    '&:focus': {
      // boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      //borderColor: theme.palette.primary.main,
    },
    border: `1px solid ${theme.palette.inputBorder.main}`,
  },
  '& .Mui-disabled': {
    backgroundColor: theme.palette.text.disabled,
    color: theme.palette.blackFont.main,
    WebkitTextFillColor: 'black !important',
  },
}));

const CustomSelectCss = withStyles((theme) => ({
  '@global': {
    '.css-16bw062-MuiSvgIcon-root-MuiSelect-icon': {
      color: `${theme.palette.common.black} !important`,
    },
    '.css-yacrg0-MuiSvgIcon-root-MuiSelect-icon': {
      color: `${theme.palette.common.black} !important`,
    },
    '.css-14e1qvh-MuiSelect-select-MuiInputBase-input-MuiInput-input:focus': {
      backgroundColor: `${theme.palette.secondary.main} !important`,
    },
    '.css-1ooztp-MuiPaper-root-MuiMenu-paper-MuiPaper-root-MuiPopover-paper': {
      backgroundColor: `${theme.palette.secondary.main} !important`,
    },
  },
}))(() => null);

const InputSelectWithLabel = (props: Props) => {
  const [value, setValue] = useState<string>(props.value);
  const { useAppSelector } = platformStore;
  const suiteFormModified = useAppSelector(getSuiteFormModified);
  const handleChange = (event: SelectChangeEvent) => {
    if (!suiteFormModified) {
      props.orgChangeHandler?.(event.target.value);
      props.domainChangeHandler?.(event.target.value);
      props.permissionChangeHandler?.(event.target.value);
    }
  };

  const handleUnsavedData = () => {
    if (suiteFormModified) {
      props?.unsavedDataHandler && props?.unsavedDataHandler(true);
      if (props.handleDomainReset && props.id === 'domain') {
        props.handleDomainReset(true);
      }
      if (props.handlePermissionReset && props.id === 'permission') {
        props.handlePermissionReset(true);
      }
    }
  };

  const required = props.required ? true : false;
  return (
    <>
      <CustomSelectCss />

      <FormControl variant="standard" sx={{ width: '90%' }}>
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
          {props.label}
        </InputLabel>
        <Select
          labelId="select-label"
          id="simple-select"
          value={props.value}
          label="Age"
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          input={<CustomSelect />}
          disabled={props.disabled}
        >
          <MenuItem value="" disabled>
            {props.placeholder}
          </MenuItem>
          {props.options &&
            props.options?.map((option, i) => {
              return (
                <MenuItem key={i} value={option} onClick={handleUnsavedData}>
                  {option}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>
    </>
  );
};

export default InputSelectWithLabel;
