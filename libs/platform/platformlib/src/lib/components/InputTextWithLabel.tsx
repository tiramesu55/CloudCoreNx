/* eslint-disable @typescript-eslint/ban-types */
import React from "react";
import { styled } from "@mui/material/styles";
import { InputLabel, FormControl, TextField } from "@mui/material";
import theme from "../themes";

interface Props {
  label?: string;
  defaultValue?: any;
  id?: string;
  formWidth?: string;
  type?: string;
  value?: string | number;
  fieldName: string;
  changeHandler?: (val: any) => void;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  focusHandler?: (val: any) => void;
  orgChangeHandler?: (key: string, event: any) => void;
  siteChangeHandler?: (key: string, event: any) => void;
  InputProps?: any;
  params?: {};
}

const BootstrapInput = styled(TextField)(() => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.secondary.main,
    fontSize: "18px",
    width: "100%",
    padding: "10px 12px",
    height: "24px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    "&:focus": {
      // boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      //borderColor: theme.palette.primary.main,
    },
    border: theme.palette.inputBorder.main,
  },
  "& .Mui-disabled": {
    backgroundColor: theme.palette.text.disabled,
    color: theme.palette.blackFont.main,
    WebkitTextFillColor: "black !important",
  },
}));

export const InputTextWithLabel = (props: Props) => {
  const required = props.required ? true : false;
  return (
    <FormControl variant="standard" sx={{ width: props.formWidth }}>
      <InputLabel
        htmlFor={props.id}
        sx={{
          fontSize: "24px",
          fontWeight: "bold",
          paddingBottom: "24px",
          "& .MuiInputLabel-asterisk": {
            color: "#FE3F3F",
          },
        }}
        shrink
        required={required}
      >
        {props.label}
      </InputLabel>
      <BootstrapInput
        defaultValue={props.defaultValue}
        error={props.error}
        type={props.type}
        id={props.id}
        inputProps={{
          maxLength: 100,
        }}
        value={props.value}
        disabled={props.disabled}
        required={required}
        onChange={
          props.orgChangeHandler
            ? (e: React.ChangeEvent<HTMLInputElement>) =>
                props.orgChangeHandler!(props.fieldName!, e.target.value)
            : props.siteChangeHandler
            ? (e: React.ChangeEvent<HTMLInputElement>) =>
                props.siteChangeHandler!(props.fieldName!, e.target.value)
            : (event: React.ChangeEvent<HTMLInputElement>) =>
                props.changeHandler!(event.target.value)
        }
        helperText={props.helperText}
        onFocus={(
          event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => props.focusHandler?.(event.target)}
        InputProps={props.InputProps}
        {...props.params}
      />
    </FormControl>
  );
};
