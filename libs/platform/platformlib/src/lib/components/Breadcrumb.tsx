import { Breadcrumbs, Typography } from "@mui/material";
import Link from "@mui/material/Link";

interface Props {
  color?: string;
  title?: string;
}

export const Breadcrumb = (props: Props) => {
  return (
    <Breadcrumbs>
      <Link href="#" underline="none">
        <Typography variant="subtitle1" color={props.color}>
          {props.title}
        </Typography>
      </Link>
    </Breadcrumbs>
  );
};
