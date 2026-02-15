// /src/layout/AppLayout.tsx
import React from "react";
import { Box, Toolbar } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { appPalette } from "../theme/palette";

/**
 * AppLayout
 * - Header global
 * - Main con maxWidth y fondo suave
 * - Footer simple
 */
export const AppLayout: React.FC = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pb: isLanding ? 0 : 6,
          background: isLanding ? appPalette.landing.background : appPalette.gradients.soft,
        }}
      >
        <Toolbar sx={{ minHeight: 72 }} />
        <Box sx={{ px: { xs: 2, md: 4 } }}>
          <Outlet />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default AppLayout;
