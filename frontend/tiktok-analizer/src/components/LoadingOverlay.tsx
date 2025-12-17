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
    <Backdrop open={open} sx={{ zIndex: 1400, color: "#fff", flexDirection: "column", gap: 2 }}>
      <CircularProgress color="inherit" />
      {message && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.95)" }}>
            {message}
          </Typography>
        </Box>
      )}
    </Backdrop>
  );
};

export default LoadingOverlay;
