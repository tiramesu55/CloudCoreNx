import {
    AppBar,
    Toolbar,
    Typography,
    Divider,
    Box,
   
    Button,

  } from "@mui/material";
  import Logout from "@mui/icons-material/Logout";

interface userProps {
    title: string;
//    userName: string;
 //   initials: string;
    signOut: () => void;
  }
export  const Header = (props: userProps) => {

 
    return (
      <Box>
        <AppBar
          position="fixed"
          sx={{ backgroundColor: "#FFFFFF", zIndex: "2000" }}
        >
          <Toolbar>
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
              <Box sx={{ display: "flex", alignItems: "center" }}>
               
              </Box>
  {/* manu should go there and be done ad a specific library component */}
            </Box>
            <Box sx={{ display: { xs: "inline-flex", md: "inline-flex" } }}>
              
            <Button onClick={ props.signOut}> Sign Out</Button>
             
  
 
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    );
  };