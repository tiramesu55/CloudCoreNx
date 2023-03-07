import * as React from 'react';
import { Button, Dialog, Grid } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportIssue: React.FC<Props> = ({ isOpen, onClose: Props }) => {
  const theme = useTheme();
  const onClose = Props;

  return (
    <div>
      <Dialog
        open={isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle>
          {onClose ? (
            <IconButton
              aria-label="close"
              size="large"
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 2,
                color: theme.palette.common.black,
              }}
            >
              <CloseIcon fontSize="large" />
            </IconButton>
          ) : null}
          <Box
            component="span"
            sx={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: theme.palette.common.black,
            }}
          >
            Support
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ mt: 2 }}>
            <Box
              component="span"
              sx={{
                fontSize: theme.typography.h4.fontSize,
                color: theme.palette.common.black,
                mt: 8,
              }}
            >
              Contact:
              <Box
                component={'a'}
                sx={{ color: '#8141f2', textDecoration: 'none', ml: 1 }}
                href="mailto:customersupportea@iarx.com"
              >
                customersupportea@iarx.com
              </Box>
            </Box>
            <Grid container>
              <Grid container>
                <Grid container item xs={12}>
                  <Grid
                    item
                    component="span"
                    sx={{
                      fontSize: theme.typography.h4.fontSize,
                      color: theme.palette.common.black,
                      mt: 2,
                      mr: 2.5,
                    }}
                  >
                    Hours:
                  </Grid>
                  <Grid
                    item
                    direction={'column'}
                    sx={{
                      fontSize: theme.typography.h4.fontSize,
                      color: theme.palette.common.black,
                      mt: 2,
                      ml: 1,
                    }}
                  >
                    <Box sx={{ fontSize: '20px' }}>
                      <Box component="span" sx={{ mr: theme.spacing(2.6) }}>
                        Monday - Friday:
                      </Box>{' '}
                      6:00 AM - 11:59 PM EST
                    </Box>
                    <Box sx={{ mt: 1, fontSize: '20px' }}>
                      Saturday - Sunday: 8:00 AM - 11:59 PM EST
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            sx={{
              marginRight: theme.spacing(2),
              marginBottom: theme.spacing(2),
              background: theme.palette.primary.light,
              borderRadius: '50px',
              paddingY: theme.spacing(1),
              paddingX: theme.spacing(5.5),
              fontSize: theme.spacing(2),
              borderColor: theme.palette.primary.light,
              '&:hover': {
                background: theme.palette.primary.light,
              },
            }}
            variant="contained"
          >
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
