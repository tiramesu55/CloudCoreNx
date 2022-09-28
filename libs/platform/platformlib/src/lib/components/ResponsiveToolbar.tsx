import { Box, Toolbar } from "@mui/material";
import NexiaLogo2 from "../images/Nexia-Logo2.png";
import { Link } from "react-router-dom";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import { UserMenu } from "./UserMenu";

export const ResponsiveToolBar = () => {
  const theme = useTheme();
  const style = {
    layoutLogo: {
      width: "100%",
      maxWidth: "163px",
      maxHeight: "41px",
    },
    layoutDefenceLogo: {
      width: "60px",
    },
    link: {
      color: theme.palette.text.primary,
      paddingInline: theme.spacing(2),
    },
    userIcon: {
      cursor: "pointer",
      color: "grey",
    },
    grid: {
      display: "grid",
    },
    navLinkIcon: {
      textDecoration: "none",
      color: theme.palette.text.primary,
      fontSize: theme.typography.subtitle1.fontSize,
      marginLeft: theme.spacing(4),
      fontWeight: 600,
    },
    Toolbar: {
      paddingLeft: theme.spacing(2.5),
      paddingRight: theme.spacing(2.5),
    },
    navLinkIconActive: {
      textDecoration: "none",
      color: theme.palette.primary.main,
      fontSize: theme.typography.subtitle1.fontSize,
      marginLeft: theme.spacing(3),
      // fontWeight: 600,
    },
  };

  return (
    <Toolbar
      style={style.Toolbar}
      sx={{ width: "100%", p: 0, display: "flex", alignItems: "center" }}
    >
      <Box component="span" sx={{ display: { xs: "none", md: "flex" } }}>
        <Link to="/">
          <img src={NexiaLogo2} alt="Nexia" style={style.layoutLogo} />
        </Link>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ ml: 2 }}
        />
      </Box>
      <>
        <Box
          component="div"
          sx={{
            display: { xs: "flex", md: "none", flexGrow: 1 },
            justifyContent: "center",
          }}
        >
          <Link to="/">
            <img src={NexiaLogo2} alt="Nexia" style={style.layoutLogo} />
          </Link>
        </Box>
        <Box
          sx={{
            [theme.breakpoints.up("md")]: {
              flexGrow: 3,
            },
            justifyContent: "left",
            display: { xs: "none", md: "flex" },
          }}
          style={style.navLinkIconActive}
        >
          PLATFORM MANAGEMENT
        </Box>

        <Box ml={2}>
          <UserMenu />
          {/*                 <AccountCircleIcon fontSize="large" style={style.userIcon} /> */}
        </Box>
      </>
    </Toolbar>
  );
};

