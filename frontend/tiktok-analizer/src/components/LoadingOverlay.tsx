// /src/components/LoadingOverlay.tsx
import React from "react";
import { Backdrop, CircularProgress, Box, Typography } from "@mui/material";

/**
 * LoadingOverlay
 * - Reutilizable: recibe `open` y `message`
 * - Bloquea la UI con Backdrop y muestra spinner + texto opcional
 *
 * Uso:
 * <LoadingOverlay open={loading} message="Procesando análisis..." />
 */
export const LoadingOverlay: React.FC<{ open: boolean; message?: string }> = ({ open, message }) => {
  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: 1400,
        color: "#fff",
        backgroundColor: "rgba(0,0,0,0.55)",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box
        sx={{
          px: 4,
          py: 3,
          borderRadius: 2,
          backgroundColor: "rgba(20, 20, 20, 0.75)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          minWidth: 260,
        }}
      >
        <CircularProgress color="inherit" />
        {message && (
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.95)", textAlign: "center" }}>
            {message}
          </Typography>
        )}
      </Box>
    </Backdrop>
  );
};

export default LoadingOverlay;
