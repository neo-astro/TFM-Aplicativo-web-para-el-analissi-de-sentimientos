import React from "react";
import { Box, Typography, Paper, Button, Grid, Stack, Chip, Divider } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import InsightsIcon from "@mui/icons-material/Insights";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import SecurityIcon from "@mui/icons-material/Security";
import VerifiedIcon from "@mui/icons-material/Verified";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { appPalette } from "../theme/palette";

const featureCards = [
  {
    title: "Analisis de sentimiento IA",
    description: "Detecta emociones y contexto para entender la percepcion real de la audiencia.",
    icon: <InsightsIcon />,
  },
  {
    title: "Tendencias y dominios",
    description: "Descubre temas dominantes y cambios en opinion antes de que se hagan virales.",
    icon: <AutoGraphIcon />,
  },
  {
    title: "Seguridad de datos",
    description: "Tus analisis quedan guardados con trazabilidad y acceso controlado por usuario.",
    icon: <SecurityIcon />,
  },
];

const testimonials = [
  {
    name: "Maria Garcia",
    handle: "@marialifestyle",
    quote: "Entendi que tipo de comentarios elevan mi engagement y replantee mi contenido en dias.",
    avatar: "👩",
  },
  {
    name: "Carlos Rodriguez",
    handle: "@carlostech",
    quote: "La deteccion de tendencias me ayuda a decidir antes que la competencia.",
    avatar: "👨",
  },
  {
    name: "Ana Martinez",
    handle: "Social Spark Agency",
    quote: "Ahora entregamos reportes claros y visuales a nuestros clientes en menos tiempo.",
    avatar: "🏢",
  },
];

const cardSx = {
  p: 4,
  borderRadius: 3,
  background: "#FFFFFF",
  border: "1px solid rgba(15,26,43,0.08)",
  boxShadow: "0 12px 30px rgba(15,26,43,0.06)",
  transition: "transform 220ms ease, box-shadow 220ms ease, border 220ms ease",
  "&:hover": {
    transform: "translateY(-6px)",
    borderColor: "rgba(30,102,245,0.35)",
    boxShadow: "0 20px 40px rgba(30,102,245,0.12)",
  },
};

export const Landing: React.FC = () => (
  <Box
    sx={{
      mx: { xs: -2, md: -4 },
      px: { xs: 2, md: 6 },
      pt: 6,
      pb: 0,
      background: appPalette.landing.background,
      color: appPalette.landing.textPrimary,
      position: "relative",
      overflow: "hidden",
      "@keyframes float": {
        "0%, 100%": { transform: "translate(0, 0) scale(1)" },
        "25%": { transform: "translate(18px, -18px) scale(1.04)" },
        "50%": { transform: "translate(-14px, 14px) scale(0.98)" },
        "75%": { transform: "translate(14px, 18px) scale(1.02)" },
      },
    }}
  >
    <Box
      sx={{
        position: "absolute",
        width: 340,
        height: 340,
        top: -120,
        left: -120,
        borderRadius: "50%",
        background: appPalette.landing.accentSoft,
        filter: "blur(80px)",
        opacity: 0.7,
        animation: "float 18s ease-in-out infinite",
      }}
    />
    <Box
      sx={{
        position: "absolute",
        width: 300,
        height: 300,
        top: "35%",
        right: -100,
        borderRadius: "50%",
        background: "rgba(30,102,245,0.18)",
        filter: "blur(80px)",
        opacity: 0.6,
        animation: "float 20s ease-in-out infinite",
        animationDelay: "-6s",
      }}
    />

    <Box sx={{ pt: { xs: 10, md: 14 }, pb: 8, position: "relative", zIndex: 1 }}>
      <Box sx={{ textAlign: "center", maxWidth: 920, mx: "auto" }}>
        <Chip
          label="+10,000 analisis generados"
          sx={{
            bgcolor: appPalette.landing.accentSoft,
            color: appPalette.landing.accentBlue,
            border: "1px solid rgba(30,102,245,0.18)",
            mb: 3,
          }}
        />
        <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.1 }}>
          Descubre el{" "}
          <Box
            component="span"
            sx={{
              background: `linear-gradient(135deg, ${appPalette.landing.accentBlue} 0%, #0F1A2B 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            poder oculto
          </Box>{" "}
          en tus comentarios
        </Typography>
        <Typography variant="h6" sx={{ color: appPalette.landing.textMuted, mb: 4 }}>
          Analiza sentimientos, detecta tendencias y convierte cada comentario en un insight accionable
          para mejorar tu estrategia de contenido.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/dashboard/realizar"
            sx={{
              px: 4,
              bgcolor: appPalette.landing.accentBlue,
              color: "white",
              fontWeight: 700,
              "&:hover": { bgcolor: "#174FC5" },
            }}
            startIcon={<RocketLaunchIcon />}
          >
            Comenzar gratis
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={RouterLink}
            to="/dashboard/lista"
            sx={{ px: 4, borderColor: "rgba(15,26,43,0.2)", color: appPalette.landing.textPrimary }}
            startIcon={<PlayArrowIcon />}
          >
            Ver demo
          </Button>
        </Stack>
        <Grid container spacing={2} sx={{ mt: 6, maxWidth: 720, mx: "auto" }}>
          {[
            { label: "50M+", caption: "Comentarios analizados" },
            { label: "10K+", caption: "Usuarios activos" },
            { label: "98%", caption: "Precision IA" },
            { label: "24/7", caption: "Monitoreo real" },
          ].map((stat) => (
            <Grid item xs={6} md={3} key={stat.label}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stat.label}
                </Typography>
                <Typography variant="body2" sx={{ color: appPalette.landing.textMuted }}>
                  {stat.caption}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>

    <Divider sx={{ borderColor: "rgba(15,26,43,0.08)", mb: 8 }} />

    <Box sx={{ pb: 8, position: "relative", zIndex: 1 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Chip label="Caracteristicas" sx={{ bgcolor: appPalette.landing.accentSoft, color: appPalette.landing.accentBlue, mb: 2 }} />
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
          Todo lo que necesitas para entender tu audiencia
        </Typography>
        <Typography variant="body1" sx={{ color: appPalette.landing.textMuted }}>
          Herramientas impulsadas por IA para equipos de marketing y analistas de contenido.
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {featureCards.map((feature) => (
          <Grid item xs={12} md={4} key={feature.title}>
            <Paper sx={cardSx}>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: appPalette.landing.accentBlue }}>
                  {feature.icon}
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {feature.title}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: appPalette.landing.textMuted }}>
                  {feature.description}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>

    <Box sx={{ pb: 8, position: "relative", zIndex: 1 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Chip label="Como funciona" sx={{ bgcolor: appPalette.landing.accentSoft, color: appPalette.landing.accentBlue, mb: 2 }} />
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
          Tres pasos para comenzar
        </Typography>
        <Typography variant="body1" sx={{ color: appPalette.landing.textMuted }}>
          Inicia un analisis en minutos y recibe resultados visuales al instante.
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {[
          "Ingresa la URL del video y nombra el analisis.",
          "El motor IA clasifica sentimientos y dominios.",
          "Visualiza KPIs, comentarios y tendencias.",
        ].map((step, index) => (
          <Grid item xs={12} md={4} key={step}>
            <Paper sx={cardSx}>
              <Stack spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: appPalette.landing.accentSoft,
                    color: appPalette.landing.accentBlue,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  {index + 1}
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {step}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>

    <Box sx={{ pb: 8, position: "relative", zIndex: 1 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Chip label="Reportes" sx={{ bgcolor: appPalette.landing.accentSoft, color: appPalette.landing.accentBlue, mb: 2 }} />
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
          Que incluye cada reporte
        </Typography>
        <Typography variant="body1" sx={{ color: appPalette.landing.textMuted }}>
          Resultados completos, listos para compartir con tu equipo.
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {[
          "Resumen con KPIs de positivos, negativos y neutros.",
          "Distribucion de sentimientos y dominio principal.",
          "Comentarios destacados con contexto.",
          "Tabla con filtros avanzados.",
        ].map((item) => (
          <Grid item xs={12} md={6} key={item}>
            <Paper sx={cardSx}>
              <Stack direction="row" spacing={2} alignItems="center">
                <VerifiedIcon sx={{ color: appPalette.landing.accentBlue }} />
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {item}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>

    <Box sx={{ pb: 8, position: "relative", zIndex: 1 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Chip label="Testimonios" sx={{ bgcolor: appPalette.landing.accentSoft, color: appPalette.landing.accentBlue, mb: 2 }} />
        <Typography variant="h3" sx={{ fontWeight: 800 }}>
          Lo que dicen nuestros usuarios
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {testimonials.map((testimonial) => (
          <Grid item xs={12} md={4} key={testimonial.name}>
            <Paper sx={cardSx}>
              <Stack spacing={3}>
                <Typography variant="body2" sx={{ color: appPalette.landing.textMuted }}>
                  "{testimonial.quote}"
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: appPalette.landing.accentSoft,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {testimonial.avatar}
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: appPalette.landing.textMuted }}>
                      {testimonial.handle}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>

    <Paper
      sx={{
        p: { xs: 3, md: 5 },
        borderRadius: 4,
        background: `linear-gradient(135deg, ${appPalette.landing.accentBlue}, ${appPalette.landing.accentNavy})`,
        color: "white",
        position: "relative",
        zIndex: 1,
      }}
    >
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={8}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Listo para transformar tus analisis?
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.85)" }}>
            Crea tu primer analisis y descubre que piensa tu audiencia en TikTok.
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} sx={{ textAlign: { xs: "left", md: "right" } }}>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/dashboard/realizar"
            sx={{ bgcolor: "white", color: appPalette.landing.accentNavy, "&:hover": { bgcolor: "#EAF0FF" } }}
            startIcon={<RocketLaunchIcon />}
          >
            Comenzar ahora
          </Button>
        </Grid>
      </Grid>
    </Paper>
  </Box>
);
    