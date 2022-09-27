import {
    AppBar,
    Toolbar,
    Typography,
    Divider,
    Box,
   
    Button,
    makeStyles,

  } from "@mui/material";
  import {FC, ReactNode} from 'react'
  import Logout from "@mui/icons-material/Logout";

interface userProps {
    title: string;
//    userName: string;
 //   initials: string;
     menu?: ReactNode;
    signOut: () => void;
  }
  
export  const Header: React.FC<userProps > = (props) => {

    return (
      <Box>
        <AppBar
          position="fixed"
          sx={{ backgroundColor: "#FFFFFF", zIndex: "2000" }}
        >
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "flex" } }}>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ mr: 2, display: { md: "flex", alignItems: "center" } }}
              >
                {/* <img src={logo} alt="NexiaLogo" /> */}
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="h6" sx={{ ml: 3, color: "#8141f2", display: "flex", alignItems: "center", fontSize: "18px" }}>
                {props.title}
              </Typography>
             
              {props.menu}
           
  {/* menu should go there and be done ad a specific library component */}
            </Box>
            <Box sx={{ display: { xs: "inline-flex", md: "inline-flex" } }}>
              
                <Button onClick={ props.signOut}> Sign Out</Button>
             
            </Box>
          </Toolbar>
        </AppBar>
        <div>
          <br></br>
          <br></br>
          <br></br>

          </div>

      </Box>
    );
  };