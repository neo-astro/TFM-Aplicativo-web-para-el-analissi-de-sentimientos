import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { appPalette } from "../theme/palette";

export const Footer: React.FC = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        borderTop: isLanding ? "1px solid rgba(15,26,43,0.08)" : "1px solid rgba(15,26,43,0.08)",
        background: isLanding ? "#FFFFFF" : "transparent",
      }}
    >
      <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
        <Typography variant="body2" sx={{ color: isLanding ? appPalette.landing.textMuted : "text.secondary" }}>
          © 2026 TikTok Analizer
        </Typography>
        <Typography variant="body2" sx={{ color: isLanding ? appPalette.landing.textMuted : "text.secondary" }}>
          Analisis de sentimientos para comentarios de TikTok
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
