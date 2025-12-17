// /src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { App } from "./App";
import { Toaster } from "sonner";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2", light: "#63a4ff" },
    background: { default: "#f4fbff", paper: "#ffffff" },
  },
  typography: { fontFamily: "'Inter', 'Roboto', sans-serif" },
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
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
      <Toaster position="top-right" />
    </ThemeProvider>
  </React.StrictMode>
);
