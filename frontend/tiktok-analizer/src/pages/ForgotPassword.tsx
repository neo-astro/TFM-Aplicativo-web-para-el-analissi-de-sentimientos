// /src/pages/ForgotPassword.tsx
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { LoadingOverlay } from "../components/LoadingOverlay";

/**
 * Página: Recuperar contraseña
 *
 * Comportamiento:
 * - Valida formato de email.
 * - Llama a useAuth().resetPassword(email) (envía email de recuperación vía Firebase).
 * - Muestra toasts de éxito/error usando sonner.
 * - Opcionalmente redirige al login tras enviar el email.
 *
 * Requisitos previos:
 * - AuthProvider debe envolver la app (useAuth disponible).
 * - Tener <Toaster /> de sonner en main.tsx para que toast funcione.
 * - LoadingOverlay componente en /src/components/LoadingOverlay.tsx (ejemplo incluido en el proyecto).
 *
 * Uso en rutas:
 * <Route path="/forgot" element={<ForgotPassword />} />
 */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Ingresa tu correo electrónico");
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error("Formato de correo inválido");
      return;
    }

    setSubmitting(true);
    try {
      // resetPassword usa sendPasswordResetEmail de Firebase
      await resetPassword(email);
      toast.success("Email de recuperación enviado. Revisa tu bandeja de entrada.");
      // Redirigir al login después de un breve delay para que el usuario vea el toast
      setTimeout(() => navigate("/login"), 1200);
    } catch (err: any) {
      const code = err?.code ?? "";
      if (code === "auth/user-not-found") toast.error("No existe una cuenta con ese correo");
      else toast.error(err?.message ?? "Error al enviar el email de recuperación");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Paper sx={{ width: 440, p: 4, background: "linear-gradient(180deg,#eaf6ff,#ffffff)" }} elevation={6}>
        <Typography variant="h5" gutterBottom color="primary">Recuperar contraseña</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Ingresa el correo asociado a tu cuenta y te enviaremos un enlace para restablecer la contraseña.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Correo electrónico"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
            autoComplete="email"
          />

          <Button type="submit" variant="contained" color="primary" fullWidth disabled={submitting}>
            Enviar email de recuperación
          </Button>
        </Box>
      </Paper>

      <LoadingOverlay open={submitting} />
    </Box>
  );
};

export default ForgotPassword;
