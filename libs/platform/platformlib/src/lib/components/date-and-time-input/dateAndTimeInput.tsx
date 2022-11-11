import React, { useState } from 'react';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { withStyles } from '@mui/styles';
import { TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

interface Props {
    value : Date |null;
    label?: string;
    minDateAndTime?:  Date;
    maxDateAndTime ?: Date | null;
    handleMaintStartDate?: (value: any) => void;
    handleMaintEndDate?: (value: any) => void;
    handleAnnounceStartDate?: (value: any) => void;
    handleAnnounceEndDate?: (value: any) => void;
    invalidDate : (value : boolean) => void 
}

const CustomSelectCss = withStyles(() => ({
    "@global": {
        ".css-l7vlnl-MuiButtonBase-root-MuiIconButton-root": {
            color: `#646264 !important`,
        },
        ".css-1ofniyl-MuiButtonBase-root-MuiIconButton-root": {
            color: `#646264 !important`,
        },
        ".css-1bs6ja2-MuiButtonBase-root-MuiIconButton-root-MuiClock-amButton": {
            color: "#646264 !important"
        },
        ".css-qlzw82-MuiButtonBase-root-MuiIconButton-root-MuiClock-pmButton": {
            color: "#646264 !important"
        },
        // ".css-i4bv87-MuiSvgIcon-root": {
        //     color: `#646264`,
        // }
    }
}))(() => null);

const LeftArrowButton = ()=>{
    return (
        <KeyboardArrowLeftIcon sx={{color : "#646264"}} />
    )
}

const RightArrowButton = ()=>{
    return(
        <KeyboardArrowRightIcon sx={{color : "#646264"}} />
    )
}


export const DateAndTimeInput = (props: Props) => {
    const [value, setValue] = React.useState<Date | null >(props.value);
    const [err, setErr] = useState(false);
    const [currentErr, setCurrentErr] = useState("");

    React.useEffect(() => {
        setValue(props.value);
      }, [props.value]);
    
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CustomSelectCss />
            <DateTimePicker
                label={props.label}
                renderInput={(params) => <TextField
                    fullWidth={true}
                    {...params} 
                    error = {err}
                    helperText = {currentErr ?? currentErr}
                    />}
                value={value}
                onError = {(reason : any)=>{
                    if(reason){
                        setErr(true);
                        setCurrentErr("Inavlid Date")
                        props?.invalidDate(true)
                    }else{
                        setErr(false);
                        setCurrentErr("");
                        props?.invalidDate(false)
                    }
                }}
                onChange={(newValue : any) => {
                    if(newValue === null){
                        setValue(newValue);
                        setErr(err);
                    }else{
                        setValue(newValue);
                        props.handleAnnounceStartDate && props.handleAnnounceStartDate(newValue);
                        props.handleAnnounceEndDate && props.handleAnnounceEndDate(newValue);
                        props.handleMaintStartDate && props.handleMaintStartDate(newValue);
                        props.handleMaintEndDate && props.handleMaintEndDate(newValue);
                    }
                }}
                minDateTime = {props.minDateAndTime}
                maxDateTime = {props.maxDateAndTime}
                components={{
                    LeftArrowIcon: LeftArrowButton,
                    RightArrowIcon: RightArrowButton,
                  }}
            />
        </LocalizationProvider>
    )
}