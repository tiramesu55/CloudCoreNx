import { Card as MaterialCard, CardProps, useTheme } from '@mui/material';

type variantTypes = 'elevation' | 'outlined';

interface Props extends CardProps {
  variant?: variantTypes;
  borderRadius?: string | number;
  background?: string;
  borderColor?: string;
  children?: React.ReactNode;
}

export const Card = (props: Props) => {
  const { variant, borderRadius, background, borderColor, children, ...other } =
    props;
  const theme = useTheme();
  return (
    <MaterialCard
      variant={variant ?? 'outlined'}
      sx={{
        borderRadius: `${
          borderRadius ? borderRadius : theme.shape.borderRadius
        }px`,
        backgroundColor: background
          ? background
          : theme.palette.defaultCardBackground.main,
        borderColor: borderColor ? borderColor : theme.palette.cardBorder.main,
        height: '100%',
        width: '100%',
      }}
      {...other}
    >
      {children}
    </MaterialCard>
  );
};
