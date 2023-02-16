import React, { useState } from 'react';
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
  FormHelperText,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useTheme, Theme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { Option } from '../../components/select-sites/select-sites';
interface Application {
  appCode: string;
  name: string;
}

interface Props {
  application?: string;
  inputList?: Option[];
  totalList?: Option[];
  customSelectLabel: string;
  title?: any;
  appsList?: Application[];
  invalid?: boolean;
  helperText?: string;
  inputAppList?: Application[];
  handleChange?: (app: string, ent: string, updatedList: Option[]) => void;
  handleAppChange?: (updatedList: any) => void;
  handleOrgAppChange?: (updatedList: Option[]) => void;
}

const SelectInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.secondary.main,
    border: `1px solid ${theme.palette.inputBorder.main}`,
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    '&:focus': {
      /* borderRadius: 4,
        borderColor: "#80bdff",
        boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)", */
    },
  },
  '& .MuiSelect-icon': {
    color: theme.palette.inputBorder.main,
  },
}));

const styles = (theme: Theme) => ({
  formControl: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: '94% !important',
  },
  indeterminateColor: {
    color: '#fffff',
  },
  selectAllText: {
    fontWeight: 500,
  },
  selectedAll: {
    //backgroundColor: "rgba(0, 0, 0, 0.08)",
    '&:hover': {
      //backgroundColor: "rgba(0, 0, 0, 0.08)",
    },
  },
  dropdownStyle: {
    backgroundColor: theme.palette.common.white,
  },
  defaultChip: {
    color: `${theme.palette.primary.main} !important`,
    border: `1px solid ${theme.palette.primary.main} !important`,
    marginRight: `${theme.spacing(1)} !important`,
    marginBottom: `${theme.spacing(1)} !important`,
  },
  warningChip: {
    color: `${theme.palette.warning.main} !important`,
    border: `1px solid ${theme.palette.warning.main} !important`,
    marginRight: `${theme.spacing(1)} !important`,
    marginBottom: `${theme.spacing(1)} !important`,
  },
});

export const CustomMultiSelectBox = (props: Props) => {
  const theme = useTheme();

  const deactivatedSites = new Map<string, string>();

  const [currentList, setCurrentList] = useState<string[]>(
    props.inputAppList
      ? props.inputAppList.map((ele) => {
          return ele['name'];
        })
      : props.inputList
      ? props.inputList.map((site) => {
          site.inactiveDate !== null &&
            deactivatedSites.set(site.name, 'Deactivated Site!');
          site.applications &&
            site.applications.forEach((app) => {
              if (
                app.subscriptionEnd &&
                new Date(app.subscriptionEnd) < new Date()
              ) {
                deactivatedSites.set(site.name, 'Subscription Expired!');
              }
            });
          return site['name'];
        })
      : []
  );

  const permissions = new Map<string, string>();

  const [totalList, setTotalList] = useState<string[]>(
    props.totalList
      ? props.totalList.map((el) => {
          permissions.set(
            el.name,
            el.permissions === undefined ? '' : el.permissions.toString()
          );
          return el['name'];
        })
      : props.appsList
      ? props.appsList.map((ele) => {
          return ele['name'];
        })
      : []
  );
  const isAllSelected =
    totalList.length > 0 && currentList.length === totalList.length;

  const handleAppchange = (event: SelectChangeEvent<typeof currentList>) => {
    const onChangeList = event.target.value;
    if (onChangeList[onChangeList.length - 1] === 'all') {
      setCurrentList(currentList.length === totalList.length ? [] : totalList);
      props.appsList &&
        props.handleAppChange &&
        props.handleAppChange(
          currentList.length === totalList.length ? [] : props.appsList
        );
      return;
    }
    setCurrentList(
      typeof onChangeList === 'string' ? onChangeList.split(',') : onChangeList
    );
    props.appsList &&
      props.handleAppChange &&
      props.handleAppChange(
        props.appsList.filter((el) => {
          return onChangeList.indexOf(el.name) > -1;
        })
      );
  };

  const handleChange = (event: SelectChangeEvent<typeof currentList>) => {
    const onChangeList = event.target.value;
    if (onChangeList[onChangeList.length - 1] === 'all') {
      setCurrentList(currentList.length === totalList.length ? [] : totalList);

      props.totalList &&
        props.application &&
        props.handleChange &&
        props.handleChange(
          props.application,
          props.customSelectLabel,
          currentList.length === totalList.length ? [] : props.totalList
        );

      props.totalList &&
        props.handleOrgAppChange &&
        props.handleOrgAppChange(
          currentList.length === totalList.length ? [] : props.totalList
        );
      return;
    }
    setCurrentList(
      typeof onChangeList === 'string' ? onChangeList.split(',') : onChangeList
    );
    props.totalList &&
      props.application &&
      props.handleChange &&
      props.handleChange(
        props.application,
        props.customSelectLabel,
        props.totalList.filter((el) => {
          return onChangeList.indexOf(el.name) > -1;
        })
      );

    props.totalList &&
      props.handleOrgAppChange &&
      props.handleOrgAppChange(
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
    props.totalList &&
      props.application &&
      props.handleChange &&
      props.handleChange(
        props.application,
        props.customSelectLabel,
        props.totalList.filter((el) => {
          return filterList.indexOf(el.name) > -1;
        })
      );

    props.totalList &&
      props.handleOrgAppChange &&
      props.handleOrgAppChange(
        props.totalList.filter((el) => {
          return filterList.indexOf(el.name) > -1;
        })
      );
  };

  return (
    <>
      <FormControl sx={styles(theme).formControl} error={props.invalid}>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={[...currentList]}
          onChange={props.appsList ? handleAppchange : handleChange}
          input={<SelectInput placeholder="input" error={props.invalid} />}
          renderValue={(selected) => {
            const selectedArr: string[] = [];
            selected.map((ele) => {
              selectedArr.push(ele);
            });
            return selectedArr.length
              ? selectedArr.join(', ')
              : props.customSelectLabel;
          }}
          inputProps={{
            MenuProps: {
              MenuListProps: {
                sx: { backgroundColor: theme.palette.common.white },
              },
            },
          }}
          // MenuProps={MenuProps}
          displayEmpty={true}
        >
          <MenuItem value="all" sx={styles(theme).selectedAll}>
            <ListItemIcon>
              <Checkbox
                sx={styles(theme).indeterminateColor}
                checked={isAllSelected}
                indeterminate={
                  currentList.length > 0 &&
                  currentList.length < totalList.length
                }
              />
            </ListItemIcon>
            <ListItemText
              sx={styles(theme).indeterminateColor}
              primary="Select All"
            />
          </MenuItem>
          {totalList?.map((element, index) => {
            return (
              <MenuItem key={index} value={element as any}>
                <ListItemIcon>
                  <Checkbox
                    sx={styles(theme).indeterminateColor}
                    checked={currentList.indexOf(element) > -1}
                  />
                </ListItemIcon>
                <ListItemText primary={element} />
              </MenuItem>
            );
          })}
          Apply
        </Select>
        {props.invalid && <FormHelperText>{props.helperText}</FormHelperText>}
      </FormControl>
      {props.totalList && (
        <Box component="div">
          <>
            {currentList.map((value, index) => {
              return (
                <Chip
                  sx={
                    deactivatedSites.get(value) && !permissions.get(value)
                      ? styles(theme).warningChip
                      : styles(theme).defaultChip
                  }
                  key={index}
                  variant="outlined"
                  label={value}
                  title={permissions.get(value) || deactivatedSites.get(value)}
                  clickable
                  deleteIcon={
                    deactivatedSites.get(value) && !permissions.get(value) ? (
                      <CloseIcon
                        sx={{
                          color: `${theme.palette.warning.main} !important`,
                        }}
                      />
                    ) : (
                      <CloseIcon
                        sx={{
                          color: `${theme.palette.primary.main} !important`,
                        }}
                      />
                    )
                  }
                  onDelete={(e) => handleDelete(e, value)}
                />
              );
            })}
          </>
        </Box>
      )}
    </>
  );
};
