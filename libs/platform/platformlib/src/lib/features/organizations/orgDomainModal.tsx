import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Button,
  IconButton,
  Typography,
  Box,
  InputAdornment,
  DialogActions,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { InputTextWithLabel } from '../../components';
import { useTheme } from '@mui/material';
import { DeleteOrgDomain } from './delete-org-domain';
import { Tooltip } from '@cloudcore/ui-shared';

interface Props {
  open: boolean;
  handleDialog: (value: boolean) => void;
  orgDomains: string[];
  addOrgDomain: (value: string) => void;
  deleteOrgDomain: (value: number) => void;
  allOrganizationDomain: string[];
  usedDomains?: string[];
}

export const OrgDomainModal = (props: Props) => {
  const theme = useTheme();
  const [fullWidth, setFullWidth] = useState(true);
  const [inputValue, setInputValue] = useState<string>('');
  const [allOrgDomains, setAllOrgDomains] = useState<string[]>([]);
  const [orgDomainInvalid, setOrgDomainInvalid] = useState(false);
  const [orgDomainExits, setOrgDomainExist] = useState(false);
  const [index, setIndex] = useState<number>(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const handleDialogClose = () => {
    setInputValue('');
    setOrgDomainInvalid(false);
    setOrgDomainExist(false);
    props.handleDialog(false);
  };

  useEffect(() => {
    setAllOrgDomains(props.allOrganizationDomain.map((d) => d.toLowerCase()));
  }, [props.allOrganizationDomain]);

  //disable button
  const disableButton =
    inputValue.trim() === '' || orgDomainInvalid || orgDomainExits
      ? true
      : false;

  const handleDelete = () => {
    const orgDomain = props.orgDomains[index];
    props.deleteOrgDomain(index);
    const updateAllorgDomains =
      allOrgDomains !== null
        ? allOrgDomains.filter((domain) => domain !== orgDomain)
        : [];
    setAllOrgDomains(updateAllorgDomains);
    setInputValue('');
    setOrgDomainInvalid(false);
    setOrgDomainExist(false);
  };

  const handleAdd = () => {
    if (inputValue !== '' && !orgDomainInvalid && !orgDomainExits) {
      props.addOrgDomain(inputValue);
      allOrgDomains.push(inputValue);
      setInputValue('');
    }
  };

  const handleChangeInputValue = (event: any) => {
    event.trim().match(/[a-zA-Z\-0-9]+\.com$/)
      ? setOrgDomainInvalid(false)
      : setOrgDomainInvalid(true);
    allOrgDomains.includes(event.trim())
      ? setOrgDomainExist(true)
      : setOrgDomainExist(false);
    setInputValue(event.trim().toLowerCase());
  };

  const handleDeleteDialog = (value: boolean) => {
    setDeleteDialogOpen(value);
  };

  const title = (
    <>
      <Typography
        fontWeight={'bold'}
        fontSize={12}
        sx={{ textAlign: 'center' }}
      >
        Can't Delete
      </Typography>
      <Typography fontSize={12} sx={{ textAlign: 'center' }}>
        this domain is being used by users
      </Typography>
    </>
  );

  const styles = {
    tooltip: {
      maxWidth: '221px',
      maxHeight: '91px',
    },
  };

  return (
    <Dialog
      open={props.open}
      maxWidth={'md'}
      fullWidth={fullWidth}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        '& .MuiDialog-paper': {
          width: '40%',
          maxHeight: 435,
          backgroundColor: theme.palette.secondary.main,
        },
      }}
    >
      <DialogTitle>
        <Typography
          fontSize={theme.typography.h3.fontSize}
          sx={{ color: theme.breadcrumLink.primary }}
        >
          Organization Domains
        </Typography>
        <IconButton
          sx={{
            position: 'absolute',
            right: 8,
            top: 4,
            color: '#000000',
          }}
          onClick={handleDialogClose}
        >
          <CloseIcon fontSize="large" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <DeleteOrgDomain
            open={deleteDialogOpen}
            handleDeleteDialog={handleDeleteDialog}
            handleDelete={handleDelete}
            orgDomain={props.orgDomains[index]}
          />
          <Grid item xs={12}>
            <InputTextWithLabel
              fieldName="orgDomain"
              value={inputValue}
              error={orgDomainInvalid || orgDomainExits}
              helperText={
                orgDomainExits
                  ? 'Organization Domain already exist'
                  : orgDomainInvalid
                  ? 'Invalid Organization Domain'
                  : ''
              }
              changeHandler={handleChangeInputValue}
              formWidth="100%"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {
                      <Button disabled={disableButton} onClick={handleAdd}>
                        Add
                      </Button>
                    }
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          {props.orgDomains.map((domain, indx) => {
            return (
              <Grid item xs={12} key={indx}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                    borderRadius: '5px',
                    height: '50px',
                    paddingX: theme.spacing(1),
                    border: `0.1px solid ${theme.palette.primary.main} `,
                  }}
                >
                  <Typography
                    fontSize={theme.typography.h6.fontSize}
                    fontWeight="bold"
                  >
                    {domain}
                  </Typography>
                  {!props.usedDomains?.includes(domain) ? (
                    <Button
                      color="error"
                      onClick={() => {
                        handleDeleteDialog(true);
                        setIndex(indx);
                      }}
                    >
                      Delete
                    </Button>
                  ) : (
                    <Tooltip
                      title={title}
                      placement={'right'}
                      styles={styles.tooltip}
                    />
                  )}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(2),
          }}
        >
          <Button
            variant="outlined"
            onClick={handleDialogClose}
            sx={{ marginRight: theme.spacing(1) }}
          >
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default OrgDomainModal;