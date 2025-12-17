// /src/layout/AppLayout.tsx
import React from "react";
import { Box, Toolbar } from "@mui/material";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

/**
 * AppLayout
 * - Header fijo arriba
 * - Sidebar fijo a la izquierda (ancho 260)
 * - Main ocupa todo el espacio restante y tiene scroll interno
 * - Garantiza que el contenido del dashboard ocupe toda la altura de la ventana
 */
export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const SIDEBAR_WIDTH = 260;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Header sidebarWidth={SIDEBAR_WIDTH} />
      <Sidebar width={SIDEBAR_WIDTH} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${SIDEBAR_WIDTH}px`, // deja espacio para el drawer fijo
          pt: (theme) => theme.spacing(10), // espacio para header
          pb: 4,
          px: { xs: 2, md: 4 },
          minHeight: "calc(100vh - 64px)",
          overflow: "auto",
          background: "linear-gradient(180deg,#f7fbff,#ffffff)",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
