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
  ...props
}: Props) => {
  const theme = useTheme();
  return (
    <MaterialCard
      variant={variant}
      sx={{
        borderRadius: `${theme.shape.borderRadius}px`,
        backgroundColor: theme.palette.defaultCardBackground.main,
        boxShadow: { boxShadow },
        borderColor: theme.palette.cardBorder.main,
        height: '100%',
        width: '100%',
      }}
      {...props}
    >
      {props.children}
    </MaterialCard>
  );
};
