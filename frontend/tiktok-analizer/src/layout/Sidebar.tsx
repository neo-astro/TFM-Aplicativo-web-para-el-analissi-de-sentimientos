// /src/layout/Sidebar.tsx
import React from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Avatar, Typography } from "@mui/material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ListIcon from "@mui/icons-material/List";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * Sidebar
 * - Drawer permanente con ancho fijo
 * - Botones: Realizar análisis, Ver análisis, Cerrar sesión
 */
export const Sidebar: React.FC<{ width?: number }> = ({ width = 260 }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width, boxSizing: "border-box", borderRight: "1px solid rgba(0,0,0,0.06)" },
      }}
    >
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar sx={{ bgcolor: "white", color: "primary.main" }}>TS</Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Sentiment Lab</Typography>
          <Typography variant="caption" color="text.secondary">{user?.email ?? "Invitado"}</Typography>
        </Box>
      </Box>

      <List>
        <ListItemButton onClick={() => navigate("/dashboard/realizar")}>
          <ListItemIcon><AnalyticsIcon /></ListItemIcon>
          <ListItemText primary="Realizar análisis" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/dashboard/lista")}>
          <ListItemIcon><ListIcon /></ListItemIcon>
          <ListItemText primary="Ver análisis" />
        </ListItemButton>

        <ListItemButton onClick={async () => { await logout(); navigate("/"); }}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Cerrar sesión" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
