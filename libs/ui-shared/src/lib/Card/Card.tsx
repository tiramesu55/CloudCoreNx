import { Card as MaterialCard, CardProps, useTheme } from '@mui/material';

interface Props extends CardProps {
  variant?: any;
  borderRadius?: string;
  background?: string;
  sx?: object;
  boxShadow?: number;
  borderColor?: string;
}

export const Card = ({
  variant = 'outlined',
  boxShadow = 2,
  sx,
  ...props
}: Props) => {
  const theme = useTheme();

  // const combinedSx = {...sx, ...{
  //   borderRadius: `${theme.shape.borderRadius}px`,
  //   backgroundColor: theme.palette.defaultCardBackground.main,
  //   boxShadow: { boxShadow },
  //   borderColor: theme.palette.cardBorder.main,
  //   height: '100%',
  //   width: '100%',
  // }}
  return (
    <MaterialCard
      variant={variant}
      sx={{ ...sx ,...{
        borderRadius: `${theme.shape.borderRadius}px`,
        backgroundColor: theme.palette.defaultCardBackground.main,
        boxShadow: { boxShadow },
        borderColor: theme.palette.cardBorder.main,
        height: '100%',
        width: '100%',
      }}}
      {...props}
    >
      {props.children}
    </MaterialCard>
  );
};
