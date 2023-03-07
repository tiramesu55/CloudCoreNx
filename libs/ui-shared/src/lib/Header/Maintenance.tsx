import React from 'react';
import { maintenance_img } from '@cloudcore/ui-shared';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import theme from '../themes';
import { ppid } from 'process';

interface props {
  handleMaintenanceDialog: (value: boolean) => void;
}

const UserTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.primary.main,
    boxShadow: theme.shadows[1],
    fontSize: theme.typography.subtitle1.fontSize,
  },
}));

const Maintenance = (props: props) => {
  const theme = useTheme();
  return (
    <UserTooltip title={'Maintenance'} placement="bottom">
      <Typography
        sx={{
          color: theme.palette.text.primary,
          fontSize: theme.typography.subtitle1.fontSize,
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'center',
          marginRight: theme.spacing(2.5),
          cursor: 'pointer',
        }}
        onClick={() => {
          props.handleMaintenanceDialog(true);
        }}
      >
        <img
          src={maintenance_img}
          alt=""
          style={{ height: '30px', width: '30px', paddingLeft: '5px' }}
        />
      </Typography>
    </UserTooltip>
  );
};

export default Maintenance;
