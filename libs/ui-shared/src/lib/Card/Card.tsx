import { Card as MaterialCard, CardProps, useTheme } from '@mui/material';

interface Props extends CardProps {
  variant?: any;
  borderRadius?: string;
  background?: string;
  sx?: object;
  boxShadow?: number;
  borderColor?: string;
}

export const Card = (props: Props) => {
  const theme = useTheme();

  return (
    <MaterialCard
      variant={'outlined'}
      sx={{
        borderRadius: `${theme.shape.borderRadius}px`,
        backgroundColor: theme.palette.defaultCardBackground.main,
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
