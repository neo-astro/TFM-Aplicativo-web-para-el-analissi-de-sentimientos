// /src/pages/AnalisisForm.tsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Stack,
  useTheme,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useAnalisis } from "../hooks/useAnalisis";
import LoadingOverlay from "../components/LoadingOverlay";
import { toast } from "sonner";
import { runFullAnalysis } from "../services/orchestrator";

/**
 * AnalisisForm
 * - Mantiene la UI original (MUI) y valida inputs.
 * - Envía el email del usuario (user.email) en lugar de user.uid.
 * - Por defecto intenta usar el orquestador runFullAnalysis si está disponible;
 *   si prefieres usar useAnalisis.crear (backend único), cambia la llamada dentro de handleSubmit.
 */

const tiktokRegex = /^https?:\/\/(www\.)?tiktok\.com\/(@[A-Za-z0-9_.-]+\/video\/\d+|v\/\d+|.+\/video\/\d+)/i;

function extractVideoIdFromTikTokUrl(url: string): string {
  try {
    const m = url.match(/\/video\/(\d+)(?:[/?#]|$)/i);
    if (m && m[1]) return m[1];
    const urlObj = new URL(url);
    const v = urlObj.searchParams.get("v");
    if (v) return v;
    return Math.abs(
      Array.from(url).reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0, 0)
    )
      .toString(36)
      .slice(0, 8);
  } catch {
    return Math.random().toString(36).slice(2, 10);
  }
}

export const AnalisisForm: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { crear, loading: crearLoading } = useAnalisis();
  const [nombreAnalisis, setNombreAnalisis] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const commentsPerPost = 5; // dato interno fijo
  const [errors, setErrors] = useState<{ nombre?: string; videoUrl?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!nombreAnalisis.trim()) e.nombre = "Nombre del análisis es obligatorio";
    if (!videoUrl.trim()) e.videoUrl = "URL del video es obligatoria";
    else if (!tiktokRegex.test(videoUrl)) e.videoUrl = "URL de TikTok inválida";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      toast.error("Corrige los errores del formulario");
      return;
    }
    if (!user?.email) {
      toast.error("Usuario no autenticado o sin email");
      return;
    }

    setLoading(true);
    try {
      // Preferimos usar el orquestador que llama a Node(3000) y Python(8000) y luego persiste en Node
      // Si no quieres usar runFullAnalysis, reemplaza este bloque por la llamada a `crear({... userEmail })`
      const videoId = extractVideoIdFromTikTokUrl(videoUrl.trim());

      const res = await toast.promise(
        runFullAnalysis({
          userEmail: user.email,
          nombreAnalisis: nombreAnalisis.trim(),
          videoUrl: videoUrl.trim(),
          commentsPerPost,
          videoId,
        }),
        {
          loading: "Enviando y procesando análisis...",
          success: "Análisis creado y guardado correctamente",
          error: (err) => `Error: ${err?.message ?? "desconocido"}`,
        }
      );

      if (res && (res as any).success === false) {
        // runFullAnalysis devuelve { success: false, message } en caso de fallo
        toast.error((res as any).message ?? "Error al ejecutar el análisis");
      } else {
        // limpiar formulario tras éxito
        setNombreAnalisis("");
        setVideoUrl("");
        setErrors({});
      }
    } catch (err: any) {
      // toast.promise ya muestra el error; aquí por si algo más ocurre
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setNombreAnalisis("");
    setVideoUrl("");
    setErrors({});
  };

  // Si useAnalisis.crear está en uso en otras partes y prefieres usarla en vez del orquestador,
  // sustituye el bloque runFullAnalysis por:
  //
  // await toast.promise(
  //   crear({
  //     userEmail: user.email, // asegúrate de que crear acepte userEmail en lugar de userId
  //     nombreAnalisis: nombreAnalisis.trim(),
  //     videoUrl: videoUrl.trim(),
  //     commentsPerPost: commentsPerPost as const,
  //   }),
  //   { loading: "Enviando análisis...", success: "Análisis creado correctamente", error: (err) => `Error: ${...}` }
  // );

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 96px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: { xs: 3, md: 6 },
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 980,
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          boxShadow: "0 10px 30px rgba(20,60,120,0.06)",
          background: "linear-gradient(180deg,#ffffff,#f7fbff)",
        }}
      >
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
              Realizar análisis
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Pega la URL del video de TikTok y asigna un nombre descriptivo para identificar el análisis.
            </Typography>
          </Box>

          <Divider />

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Box sx={{ flex: 2 }}>
              <TextField
                label="Nombre del análisis"
                placeholder="Ej: Reacción campaña X - 2025-12-01"
                fullWidth
                value={nombreAnalisis}
                onChange={(e) => setNombreAnalisis(e.target.value)}
                error={Boolean(errors.nombre)}
                helperText={errors.nombre}
                inputProps={{ maxLength: 120 }}
                required
              />
            </Box>

            <Box sx={{ width: { xs: "100%", md: 220 } }}>
              <TextField
                label="Comentarios por post"
                value={commentsPerPost}
                fullWidth
                InputProps={{ readOnly: true }}
                helperText="Valor fijo del sistema"
              />
            </Box>
          </Stack>

          <Box>
            <TextField
              label="URL del video de TikTok"
              placeholder="https://www.tiktok.com/@usuario/video/1234567890"
              fullWidth
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              error={Boolean(errors.videoUrl)}
              helperText={errors.videoUrl ?? "Asegúrate de pegar la URL completa del video"}
              required
            />
          </Box>

          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button
              type="button"
              variant="outlined"
              color="inherit"
              onClick={handleClear}
              sx={{
                minWidth: 120,
                borderColor: "rgba(0,0,0,0.08)",
              }}
            >
              Limpiar
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                minWidth: 140,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              }}
              disabled={loading || crearLoading}
            >
              Enviar análisis
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <LoadingOverlay open={loading || crearLoading} message="Procesando análisis..." />
    </Box>
  );
};

export default AnalisisForm;
