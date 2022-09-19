import React, { useState } from "react";
import {
  Box,
  MenuItem,
  ListItemText,
  FormControl,
  Checkbox,
  Chip,
  ListItemIcon,
  InputBase,
  Select,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import theme from "../themes";
import { withStyles, makeStyles } from "@mui/styles";
import CloseIcon from "@mui/icons-material/Close";
import { Theme } from "@mui/system";
import { styled } from "@mui/material/styles";
import { Option } from "../components/selectSites";

interface Props {
  application: string;
  inputList: Option[];
  totalList: Option[];
  customSelectLabel: string;
  handleChange: (app: string, ent: string, updatedList: Option[]) => void;
  title?: any;
}

const SelectInput = styled(InputBase)(() => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.secondary.main,
    border: `1px solid ${theme.palette.inputBorder.main}`,
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    "&:focus": {
      /* borderRadius: 4,
        borderColor: "#80bdff",
        boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)", */
    },
  },
}));

const CustomSelectCss = withStyles(() => ({
  "@global": {
    ".css-dtoucc-MuiSvgIcon-root-MuiSelect-icon": {
      color: `${theme.palette.common.black} !important`,
    },
    ".css-og9e4b-MuiSvgIcon-root-MuiSelect-icon": {
      color: `${theme.palette.common.black} !important`,
    },
  },
}))(() => null);

const useStyles = makeStyles(() => ({
  formControl: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: "94% !important",
  },
  indeterminateColor: {
    color: "#fffff",
  },
  selectAllText: {
    fontWeight: 500,
  },
  selectedAll: {
    //backgroundColor: "rgba(0, 0, 0, 0.08)",
    "&:hover": {
      //backgroundColor: "rgba(0, 0, 0, 0.08)",
    },
  },
  dropdownStyle: {
    backgroundColor: "white",
  },
  initialChip: {
    color: `${theme.palette["chipYellow"].main} !important`,
    border: `1px solid ${theme.palette["chipYellow"].main} !important`,
    marginRight: `${theme.spacing(1)} !important`,
    marginBottom: `${theme.spacing(1)} !important`,
  },
  newChip: {
    color: `${theme.palette["linkBlue"].main} !important`,
    border: `1px solid ${theme.palette["linkBlue"].main} !important`,
    marginRight: `${theme.spacing(1)} !important`,
    marginBottom: `${theme.spacing(1)} !important`,
  },
  yellowCloseIcon: {
    color: `1px solid ${theme.palette["chipYellow"].main} !important`,
  },
}));

export const CustomMultiSelectBox = (props: Props) => {
  const classes = useStyles();
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
        backgroundColor: "#fffff !important",
      },
    },
    classes: { paper: classes.dropdownStyle },
  };

  const [currentList, setCurrentList] = useState<string[]>(
    props.inputList.map((el) => {
      return el["name"];
    })
  );

  const permissions = new Map<string, string>();

  const [totalList, setTotalList] = useState<string[]>(
    props.totalList.map((el) => {
      permissions.set(
        el.name,
        el.permissions === undefined ? "" : el.permissions.toString()
      );
      return el["name"];
    })
  );

  const isAllSelected =
    totalList.length > 0 && currentList.length === totalList.length;

  const handleChange = (event: SelectChangeEvent<typeof currentList>) => {
    const onChangeList = event.target.value;
    if (onChangeList[onChangeList.length - 1] === "all") {
      setCurrentList(currentList.length === totalList.length ? [] : totalList);

      props.handleChange(
        props.application,
        props.customSelectLabel,
        currentList.length === totalList.length ? [] : props.totalList
      );
      return;
    }
    setCurrentList(
      typeof onChangeList === "string" ? onChangeList.split(",") : onChangeList
    );
    props.handleChange(
      props.application,
      props.customSelectLabel,
      props.totalList.filter((el) => {
        return onChangeList.indexOf(el.name) > -1;
      })
    );
  };

  const handleDelete = (e: React.MouseEvent, value: string) => {
    const filterList = currentList.filter((current) => {
      if (current === value) {
        return false;
      } else return true;
    });
    setCurrentList(filterList);
    props.handleChange(
      props.application,
      props.customSelectLabel,
      props.totalList.filter((el) => {
        return filterList.indexOf(el.name) > -1;
      })
    );
  };

  return (
    <>
      <CustomSelectCss />
      <FormControl sx={{ my: 1, width: 300 }} className={classes.formControl}>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={[...currentList]}
          onChange={handleChange}
          input={<SelectInput placeholder="input" />}
          renderValue={(selected) => {
            const selectedArr: string[] = [];
            selected.map((ele) => {
              selectedArr.push(ele);
            });
            return selectedArr.length
              ? selectedArr.join(", ")
              : props.customSelectLabel;
          }}
          MenuProps={MenuProps}
          displayEmpty={true}
        >
          <MenuItem
            value="all"
            classes={{
              root: isAllSelected ? classes.selectedAll : "",
            }}
          >
            <ListItemIcon>
              <Checkbox
                classes={{ indeterminate: classes.indeterminateColor }}
                checked={isAllSelected}
                indeterminate={
                  currentList.length > 0 &&
                  currentList.length < totalList.length
                }
              />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.selectAllText }}
              primary="Select All"
            />
          </MenuItem>
          {totalList?.map((element, index) => {
            return (
              <MenuItem key={index} value={element as any}>
                <ListItemIcon>
                  <Checkbox
                    classes={{ indeterminate: classes.indeterminateColor }}
                    checked={currentList.indexOf(element) > -1}
                  />
                </ListItemIcon>
                <ListItemText primary={element} />
              </MenuItem>
            );
          })}
          Apply
        </Select>
      </FormControl>
      <Box component="div">
        <>
          {currentList.map((value, index) => {
            return (
              <Chip
                key={index}
                variant="outlined"
                label={value}
                title={permissions.get(value)}
                clickable
                deleteIcon={
                  currentList.indexOf(value) > -1 ? (
                    <CloseIcon
                      sx={{
                        color: `${theme.palette.chipYellow.main} !important`,
                      }}
                    />
                  ) : (
                    <CloseIcon
                      sx={{
                        color: `${theme.palette.linkBlue.main} !important`,
                      }}
                    />
                  )
                }
                onDelete={(e) => handleDelete(e, value)}
                className={
                  currentList.indexOf(value) > -1
                    ? classes.initialChip
                    : classes.newChip
                }
              />
            );
          })}
        </>
      </Box>
    </>
  );
};

