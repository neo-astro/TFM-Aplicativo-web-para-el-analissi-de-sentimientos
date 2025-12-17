// /src/pages/Register.tsx
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { LoadingOverlay } from "../components/LoadingOverlay";

/**
 * Register page
 *
 * Comportamiento:
 * - Valida email y password (mínimo 6 caracteres).
 * - Llama a useAuth().register(email, password).
 * - Muestra toasts y redirige a /dashboard/realizar al registrarse.
 *
 * Comentarios:
 * - Firebase requiere password >= 6 caracteres.
 * - Si quieres guardar metadatos adicionales en tu DB, hazlo en el backend
 *   o en un listener que use Firebase Admin.
 *
 * Ejemplo de uso en rutas:
 * <Route path="/register" element={<Register />} />
 */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password || !confirm) {
      toast.error("Completa todos los campos");
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error("Email inválido");
      return;
    }
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (password !== confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setSubmitting(true);
    try {
      await register(email, password);
      toast.success("Cuenta creada correctamente");
      // Redirigir al dashboard
      navigate("/dashboard/realizar");
    } catch (err: any) {
      const code = err?.code ?? "";
      if (code === "auth/email-already-in-use") toast.error("El correo ya está en uso");
      else toast.error(err?.message ?? "Error al crear la cuenta");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Paper sx={{ width: 480, p: 4, background: "linear-gradient(180deg,#eaf6ff,#ffffff)" }} elevation={6}>
        <Typography variant="h5" gutterBottom color="primary">Crear cuenta</Typography>
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
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            helperText="Mínimo 6 caracteres"
            autoComplete="new-password"
          />
          <TextField
            label="Confirmar contraseña"
            type="password"
            fullWidth
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            sx={{ mb: 2 }}
            autoComplete="new-password"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={submitting}>
            Registrarse
          </Button>
        </Box>
      </Paper>

      <LoadingOverlay open={submitting} />
    </Box>
  );
};

export default Register;
