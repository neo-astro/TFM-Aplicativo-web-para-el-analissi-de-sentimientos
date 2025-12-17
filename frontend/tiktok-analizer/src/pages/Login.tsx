// /src/pages/Login.tsx
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Link } from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { LoadingOverlay } from "../components/LoadingOverlay";

/**
 * Login page
 *
 * Comportamiento:
 * - Valida email y password (no vacíos, email formato básico).
 * - Llama a useAuth().login(email, password).
 * - Muestra toasts de éxito/error usando sonner.
 * - Redirige a /dashboard/realizar al iniciar sesión correctamente.
 *
 * Ejemplo de uso en rutas:
 * <Route path="/login" element={<Login />} />
 */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Completa todos los campos");
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error("Email inválido");
      return;
    }

    setSubmitting(true);
    try {
      // login lanza si hay error; no devolvemos valor explícito
      await login(email, password);
      toast.success("Inicio de sesión correcto");
      // Redirigir al dashboard principal
      navigate("/dashboard/realizar");
    } catch (err: any) {
      // Firebase devuelve códigos; mostramos mensaje amigable
      const code = err?.code ?? "";
      if (code === "auth/user-not-found") toast.error("Usuario no encontrado");
      else if (code === "auth/wrong-password") toast.error("Contraseña incorrecta");
      else toast.error(err?.message ?? "Error al iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Paper sx={{ width: 420, p: 4, background: "linear-gradient(180deg,#eaf6ff,#ffffff)" }} elevation={6}>
        <Typography variant="h5" gutterBottom color="primary">Iniciar sesión</Typography>
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
            autoComplete="current-password"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={submitting} sx={{ mb: 1 }}>
            Entrar
          </Button>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Link component={RouterLink} to="/forgot" underline="hover">¿Olvidaste tu contraseña?</Link>
            <Link component={RouterLink} to="/register" underline="hover">Crear cuenta</Link>
          </Box>
        </Box>
      </Paper>

      <LoadingOverlay open={submitting} />
    </Box>
  );
};

export default Login;
