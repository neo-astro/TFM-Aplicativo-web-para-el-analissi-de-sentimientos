import React from "react";
import { Container, Typography, Box, Paper, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export const Landing: React.FC = () => (
  <Container maxWidth="lg" sx={{ mt: 6 }}>
    <Paper sx={{ p: 4, background: "linear-gradient(180deg,#e8f4ff,#ffffff)" }}>
      <Typography variant="h3" color="primary" gutterBottom>TikTok Sentiment Lab</Typography>
      <Typography variant="h6" gutterBottom>Analiza comentarios de videos de TikTok y obtén resúmenes de sentimientos y dominios.</Typography>
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" component={RouterLink} to="/register" sx={{ mr: 2 }}>Registrarse</Button>
        <Button variant="outlined" component={RouterLink} to="/login">Iniciar sesión</Button>
      </Box>
    </Paper>

    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Qué es la aplicación</Typography>
      <Typography>Una herramienta para extraer y analizar comentarios de TikTok, clasificarlos por sentimiento y dominios (política, ventas, reseñas).</Typography>

      <Typography variant="h5" sx={{ mt: 3 }}>Para qué sirve</Typography>
      <Typography>Monitoreo de reputación, análisis de campañas y extracción de insights cualitativos.</Typography>

      <Typography variant="h5" sx={{ mt: 3 }}>Cómo usarla</Typography>
      <ol>
        <li>Regístrate e inicia sesión.</li>
        <li>En "Realizar análisis" pega la URL del video de TikTok y crea un nombre para el análisis.</li>
        <li>Revisa los resultados en "Ver análisis".</li>
      </ol>

      <Typography variant="h5" sx={{ mt: 3 }}>Explicación del análisis de comentarios de TikTok</Typography>
      <Typography>El backend obtiene comentarios (ej. 5 por post), el motor Python realiza el análisis de sentimiento y dominios, y el frontend muestra gráficos y detalles por comentario.</Typography>
    </Box>
  </Container>
);
