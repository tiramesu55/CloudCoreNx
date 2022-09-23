import { Card as MaterialCard, CardProps } from "@mui/material";
import theme from "../themes";

interface Props extends CardProps {
  variant?: any;
  borderRadius?: string;
  background?: string;
  sx?: object;
  boxShadow?: number;
  borderColor?: string;
}

export const Card = ({
  variant = "outlined",
  borderRadius = `${theme.shape.borderRadius}px`,
  boxShadow = 2,
  background = theme.palette.defaultCardBackground.main,
  ...props
}: Props) => {
  return (
    <MaterialCard
      variant={variant}
      sx={{
        borderRadius: { borderRadius },
        backgroundColor: { background },
        boxShadow: { boxShadow },
        borderColor: theme.palette.cardBorder.main,
        height: "100%",
        width: "100%",
      }}
      {...props}
    >
      {props.children}
    </MaterialCard>
  );
};
