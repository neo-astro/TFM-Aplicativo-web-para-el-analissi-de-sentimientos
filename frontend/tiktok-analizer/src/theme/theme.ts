import { createTheme } from "@mui/material/styles";
import { appPalette } from "./palette";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: appPalette.primary,
    secondary: appPalette.secondary,
    background: appPalette.background,
    text: {
      primary: appPalette.text.primary,
      secondary: appPalette.text.secondary,
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: "none" },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 },
      },
    },
  },
});
