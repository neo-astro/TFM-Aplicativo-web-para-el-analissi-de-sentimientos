// /src/layout/Header.tsx
import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Header
 * - Recibe sidebarWidth para evitar solapamientos si lo necesitas
 * - Muestra nombre del proyecto y email del usuario (si está logueado)
 */
export const Header: React.FC<{ sidebarWidth?: number }> = ({ sidebarWidth = 260 }) => {
  const { user } = useAuth();

  return (
    <AppBar
      position="fixed"
      color="primary"
      elevation={2}
      sx={{
        width: `calc(100% - ${sidebarWidth}px)`,
        ml: `${sidebarWidth}px`,
        background: "linear-gradient(90deg,#1976d2,#63a4ff)",
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ color: "white", textDecoration: "none", fontWeight: 600, mr: 2 }}
        >
          TikTok Sentiment Lab
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {user && (
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
            {user.email}
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
