import { Box, Typography, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTheme } from '@mui/material';
import { useContext } from 'react';
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import betaIcon from './assets/betaIcon.png';

interface AppsMenuProps {
  title: string;
  betaIcon?: boolean;
}

const AppsMenu = (props: AppsMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [index, setIndex] = useState<null | number>(null);
  const openMenu = Boolean(anchorEl);
  const theme = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const config: IConfig = useContext(ConfigCtx)!;
  const { permissions } = useClaimsAndSignout(
    config.logoutSSO,
    config.postLogoutRedirectUri
  );
  const apps = [
    {
      name: 'ANALYTICS',
      url: 'https://powerbi.dev.nexia.app',
      permission: permissions?.analytics && permissions?.analytics.length > 0,
    },
    {
      name: 'PLATFORM MANAGEMENT',
      url: 'https://platform8ui.dev.nexia.app',
      permission: permissions?.admin && permissions?.admin.length > 0,
    },
    {
      name: 'MARKETPLACE',
      url: '',
      permisssion:
        permissions?.marketplace && permissions?.marketplace.length > 0,
    },
  ];
  const availableApps = apps.filter(
    (app) => app.name.toLowerCase() !== props.title.toLowerCase()
  );

  console.log(permissions, 'permi');

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          ml: 3,
          display: 'flex',
          alignItems: 'center',
          height: '64px',
        }}
        onMouseEnter={(e) => {
          setAnchorEl(e.currentTarget);
          setIndex(1);
        }}
        onMouseLeave={(e) => {
          setAnchorEl(null);
          setIndex(null);
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            height: '64px',
            cursor: 'default',
            fontWeight: 'normal',
          }}
        >
          {props.title}
          {props.betaIcon ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                component={'img'}
                src={betaIcon}
                alt="Beta version"
                sx={{
                  background: '#6513f0',
                  border: '1px solid #8141f2',
                  padding: '5px',
                  borderRadius: '5px',
                  marginLeft: '13px',
                  height: 'fit-content',
                  marginTop: '4px',
                  marginRight: '12px',
                }}
              />
            </Box>
          ) : (
            <Box component={'span'}></Box>
          )}
          <Box>
            <KeyboardArrowDownIcon sx={{ mt: 1 }} />
          </Box>
        </Typography>
        {index === 1 && (
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={() => setAnchorEl(null)}
            autoFocus={false}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
              onMouseLeave: () => setAnchorEl(null),
            }}
            sx={{
              width: '252px',
              '& .MuiMenu-list': {
                paddingTop: '0px',
                paddingBottom: '0px',
              },
            }}
          >
            {availableApps.map((app, indx) => (
              <MenuItem
                onClick={() => {
                  window.location.replace(app.url ? app.url : '');
                }}
                key={indx}
                disabled={!app.permission}
                sx={{
                  width: '252px',
                  '&:hover': {
                    backgroundColor: theme.palette.menuHoverColor.main,
                  },
                  '&:active': {
                    backgroundColor: theme.palette.menuHoverColor.main,
                  },
                  backgroundColor: theme.palette.secondary.main,
                }}
              >
                {app.name}
              </MenuItem>
            ))}
          </Menu>
        )}
      </Box>
    </Box>
  );
};

export default AppsMenu;
