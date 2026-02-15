// /src/layout/Header.tsx
import React from "react";
import { AppBar, Toolbar, Typography, Box, Button, Stack, Container } from "@mui/material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { appPalette } from "../theme/palette";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isLanding = location.pathname === "/";

  return (
    <AppBar
      position="fixed"
      color="primary"
      elevation={0}
      sx={{
        background: isLanding ? "#FFFFFF" : "linear-gradient(90deg,#1E66F5,#6EA8FF)",
        backdropFilter: "none",
        borderBottom: isLanding ? "1px solid rgba(15,26,43,0.08)" : "none",
      }}
    >
      <Toolbar sx={{ minHeight: 72 }}>
        <Container maxWidth="lg" sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              color: isLanding ? appPalette.landing.textPrimary : "white",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            TikTok Analizer
          </Typography>

          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <Stack direction="row" spacing={2}>
              <Button
                component={RouterLink}
                to="/"
                color="inherit"
                sx={{
                  fontWeight: 600,
                  color: isLanding ? appPalette.landing.textPrimary : "white",
                  "&:hover": { opacity: 0.8 },
                }}
              >
                Home
              </Button>
              <Button
                component={RouterLink}
                to="/dashboard/realizar"
                color="inherit"
                sx={{
                  fontWeight: 600,
                  color: isLanding ? appPalette.landing.textPrimary : "white",
                  "&:hover": { opacity: 0.8 },
                }}
              >
                Crear analisis
              </Button>
              <Button
                component={RouterLink}
                to="/dashboard/lista"
                color="inherit"
                sx={{
                  fontWeight: 600,
                  color: isLanding ? appPalette.landing.textPrimary : "white",
                  "&:hover": { opacity: 0.8 },
                }}
              >
                Ver analisis
              </Button>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
            {user ? (
              <>
                <Typography
                  variant="body2"
                  sx={{ color: isLanding ? appPalette.landing.textPrimary : "rgba(255,255,255,0.92)" }}
                >
                  Hola {user.email}
                </Typography>
                <Button
                  color="inherit"
                  onClick={async () => {
                    await logout();
                    navigate("/");
                  }}
                  sx={{
                    borderColor: isLanding ? "rgba(15,26,43,0.3)" : "rgba(255,255,255,0.5)",
                    background: isLanding ? "rgba(15,26,43,0.06)" : "rgba(255,255,255,0.12)",
                    color: isLanding ? appPalette.landing.textPrimary : "white",
                    "&:hover": { background: isLanding ? "rgba(15,26,43,0.12)" : "rgba(255,255,255,0.22)" },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  color="inherit"
                  sx={{
                    borderColor: isLanding ? "rgba(15,26,43,0.2)" : "rgba(255,255,255,0.6)",
                    background: isLanding ? "rgba(15,26,43,0.04)" : "rgba(255,255,255,0.12)",
                    color: isLanding ? appPalette.landing.textPrimary : "white",
                    "&:hover": { background: isLanding ? "rgba(15,26,43,0.12)" : "rgba(255,255,255,0.22)" },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  color="inherit"
                  sx={{
                    border: isLanding ? "1px solid rgba(30,102,245,0.2)" : "1px solid rgba(255,255,255,0.6)",
                    background: isLanding ? appPalette.landing.accentBlue : "rgba(255,255,255,0.2)",
                    color: isLanding ? "white" : "white",
                    "&:hover": { background: isLanding ? "#174FC5" : "rgba(255,255,255,0.3)" },
                  }}
                >
                  Crear cuenta
                </Button>
              </>
            )}
          </Stack>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
