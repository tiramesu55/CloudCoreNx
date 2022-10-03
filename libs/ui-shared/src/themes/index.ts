/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface Theme {
    breadcrumLink: {
      primary: React.CSSProperties["color"];
    };
  }

  interface Palette {
    navbarBorder: Palette["primary"];
    userMenuBackground: Palette["primary"];
    userMenuColor: Palette["primary"];
    defaultCardBackground: Palette["primary"];
    dataTableBackground: Palette["primary"];
    inputBorder: Palette["primary"];
    cardBorder: Palette["primary"];
    chipYellow: Palette["primary"];
    linkBlue: Palette["primary"];
    linearProgress: Palette["primary"];
    greyButton: Palette["primary"];
    blackFont: Palette["primary"];
  }
  interface PaletteOptions {
    navbarBorder: PaletteOptions["primary"];
    userMenuBackground: PaletteOptions["primary"];
    userMenuColor: PaletteOptions["primary"];
    defaultCardBackground: PaletteOptions["primary"];
    dataTableBackground: PaletteOptions["primary"];
    inputBorder: PaletteOptions["primary"];
    cardBorder: PaletteOptions["primary"];
    chipYellow: PaletteOptions["primary"];
    linkBlue: PaletteOptions["primary"];
    linearProgress: PaletteOptions["primary"];
    greyButton: PaletteOptions["primary"];
    blackFont: PaletteOptions["primary"];
  }

  interface PaletteColor {
    darker?: string;
  }
  interface SimplePaletteColorOptions {
    darker?: string;
  }
  interface ThemeOptions {
    breadcrumLink: {
      primary: React.CSSProperties["color"];
    };
  }
  interface BreakpointOverrides {
    xxl: true;
  }
  interface Components {
    [key: string]: any;
  }
}

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1000,
      lg: 1200,
      xl: 1536,
      xxl: 2000,
    },
  },
  breadcrumLink: {
    primary: "#3A3A3A",
  },
  palette: {
    mode: "light",
    primary: {
      main: "#6513F0",
      light: "#8141F2",
      dark: "#310282",
      contrastText: "#fff",
    },
    secondary: {
      /* main: "#73417D",
      light: "#816C85",
      dark: "#69017D", */
      main: "#ffffff",
    },
    error: {
      light: "#ef350",
      main: "#d32f2f",
      dark: "#c62828",
      contrastText: grey[800],
    },
    success: {
      main: "#2e7d32",
      light: "#4caf50",
      dark: "1b5e20",
      contrastText: "#fff",
    },
    warning: {
      light: "#ff9800",
      main: "#ed6c02",
      dark: "#e65100",
      contrastText: grey[800],
    },
    info: {
      main: "#0288d1",
      light: "#03adf4",
      dark: "#01579b",
    },
    text: {
      primary: "#58595b",
      secondary: grey[700],
      disabled: "#F0F0F0",
    },
    divider: "rgba(0,0,0,0.38)",

    background: {
      default: "#F6F5F7",
      paper: grey[200],
    },
    common: {
      black: grey[900],
      white: grey[200],
    },
    tonalOffset: 0.2,
    navbarBorder: {
      main: "#0000000D",
    },
    userMenuBackground: {
      main: "#6513F0",
    },
    userMenuColor: {
      main: "#F5F5F5",
    },
    action: {
      activatedOpacity: 1,
      active: "rgba(0,0,0,0)",
    },
    defaultCardBackground: {
      main: "#ffffff",
    },
    dataTableBackground: {
      main: "#E0E2E5",
    },
    inputBorder: {
      main: "#A7A9AC",
    },
    cardBorder: {
      main: "#E0E2E5",
    },
    chipYellow: {
      main: "#EEB20E",
    },
    linkBlue: {
      main: "#2CA1FA",
    },
    // cardBorder: {
    //   main: "#E0E2E5",
    // },
    linearProgress: {
      main: "#2CA1FA",
    },
    greyButton: {
      main: "#808184",
    },
    blackFont: {
      main: "#000000",
    },
  },
  typography: {
    fontFamily: `"Roboto", sans-serif`,
    subtitle1: {
      fontSize: "18px",
    },
    subtitle2: {
      fontSize: "16px",
    },
    h1: {
      fontSize: "72px",
      lineHeight: "72px",
      fontWeight: "bold",
    },
    h2: {
      fontSize: "48px",
      lineHeight: "64px",
      fontWeight: "bold",
    },
    h3: {
      fontSize: "24px",
      fontWeight: "bold",
      lineHeight: "36px",
    },
    h4: {
      fontSize: "24px",
      lineHeight: "36px",
    },
    h5: {
      fontSize: "18px",
      lineHeight: "27px",
    },
    h6: {
      fontSize: "18px",
      lineHeight: "27px",
      fontWeight: "bold",
    },
    body1: {
      fontSize: "18px",
      lineHeight: "27px",
    },
    body2: {
      fontSize: "14px",
      lineHeight: "21px",
    },
    button: {
      fontSize: "16px",
      lineHeight: "24px",
      fontWeight: "bold",
    },
    caption: {
      fontSize: "12px",
      lineHeight: "18px",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          borderRadius: "full",
          paddingTop: "8px",
          paddingBottom: "8px",
          paddingLeft: "25px",
          paddingRight: "25px",
          fontSize: "16px",
        },
        outlined: {
          borderRadius: "full",
          paddingTop: "8px",
          paddingBottom: "8px",
          paddingLeft: "25px",
          paddingRight: "25px",
          fontSize: "16px",
          color: "#8141F2",
          "&:hover": {
            background: "#6513F0",
            color: "#ffffff",
            border: "1px solid #ffffff",
          },
          "&:disabled": {
            color: "#A7A9AC",
            border: "1px solid #A7A9AC",
            background: "transparent",
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          paddingLeft: "20px",
          paddingRight: "20px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "16px",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: "18px",
        },
      },
    },
    MUIDataTableBodyRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type( even )": {
            backgroundColor: "#FBF8FF",
          },
          "&:nth-of-type(odd)": {
            backgroundColor: "#ffffff",
          },
          "&:hover": {
            // backgroundColor: "transparent !important",
          },
        },
      },
    },
    MUIDataTable: {
      styleOverrides: {
        responsiveScroll: {
          maxHeight: "380 px",
          overflow: "scroll",
        },
        root: {
          backgroundColor: "white",
          // maxHeight : "450px",
          // overflow : "scroll"
        },
        paper: {
          boxShadow: "none",
        },
      },
    },
    MUIDataTableToolBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#f6f5f7",
        },
      },
    },
    MuiDataTableCell: {
      styleOverrides: {
        root: {
          padding: "8px",
        },
      },
    },
    MUIDataTableHeadCell: {
      styleOverrides: {
        root: {
          fontWeight: "bold !important",
          backgroundColor: "#e0e2e5 !important",
          zIndex: 5,
        },
      },
    },
    MUIDataTableHead: {
      styleoverrides: {
        root: {
          backgroundColor: "red !important",
        },
      },
    },
  },
  spacing: 8,
});
