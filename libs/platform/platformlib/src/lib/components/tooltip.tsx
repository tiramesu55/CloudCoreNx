/* eslint-disable @typescript-eslint/ban-types */
import {
  Tooltip as MuiTooltip,
  TooltipProps,
  tooltipClasses,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useTheme } from '@mui/material';

interface Props {
  title: any;
  placement:
    | 'bottom'
    | 'left'
    | 'right'
    | 'top'
    | 'bottom-end'
    | 'bottom-start'
    | 'left-end'
    | 'left-start'
    | 'right-end'
    | 'right-start'
    | 'top-end'
    | 'top-start'
    | undefined;
  styles: {};
}

export const Tooltip = (props: Props) => {
  const theme = useTheme();
  const InfoTooltip = styled(({ className, ...props }: TooltipProps) => (
    <MuiTooltip {...props} arrow classes={{ popper: className }} />
  ))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.secondary.main,
      color: 'rgba(0, 0, 0, 0.87)',
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #E0E2E5',
      borderRadius: '5px',
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: `${theme.palette.secondary.main}`,
      fontSize: 20,
      '&:before': {
        border: '1px solid #E0E2E5',
      },
    },
  }));

  return (
    <InfoTooltip
      title={props.title}
      placement={props.placement}
      sx={{ ...props?.styles }}
    >
      {/* <img src={info} alt="information" style={{color : 'red',}}/> */}
      <InfoOutlinedIcon
        sx={{ color: theme.palette.primary.main, fontWeight: 'small' }}
      />
    </InfoTooltip>
  );
};
