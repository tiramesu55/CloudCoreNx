import { useState, Fragment } from 'react';
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { useTheme } from '@mui/material';
import React from 'react';
import theme from './themes';

const UserTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.primary.main,
    boxShadow: theme.shadows[1],
    fontSize: theme.typography.subtitle1.fontSize,
  },
}));

const style = {
  MenuItem: {
    color: theme.palette.userMenuColor.main,
    hover: {
      '&:hover': {
        background: 'red',
      },
    },
  },
  IconButton: {
    '&:click': {
      backgroundColor: 'transparent',
    },
  },
};

interface userMenuProps {
  userMenuProps: userMenu;
}

interface userMenu {
  userName: string;
  userInitials: string;
  userMenuList: userMenuList[];
}

interface userMenuList {
  icon: string;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}

export const UserMenu = (props: userMenuProps) => {
  //const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <IconButton onClick={handleClick} size="small">
          <UserTooltip title={props.userMenuProps?.userName} placement="top">
            <Avatar
              alt={props.userMenuProps?.userName}
              sx={{
                width: 32,
                height: 32,
                backgroundColor: theme.palette.primary.main,
              }}
            >
              {props.userMenuProps?.userInitials}
            </Avatar>
          </UserTooltip>
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 0,
            backgroundColor: theme.palette.userMenuBackground.main,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              backgroundColor: theme.palette.userMenuBackground.main,
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {props.userMenuProps?.userMenuList.map((item: userMenuList, ind) => {
          return (
            <MenuItem
              disabled={item.disabled}
              style={style.MenuItem}
              onClick={item.onClick}
              key={ind}
            >
              <ListItemIcon>
                <img src={item.icon} alt="SignOut" />
              </ListItemIcon>
              {item.label}
            </MenuItem>
          );
        })}
      </Menu>
    </Fragment>
  );
};
