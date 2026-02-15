// /src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react';

// Contexto de autenticación
import { AuthProvider } from "./context/AuthContext";

// Layouts y componentes de protección de rutas
import { ProtectedRoute } from "./components/ProtectedRoute";

// Páginas
import { AnalisisForm } from "./pages/AnalisisForm";
import { Landing } from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import { AppLayout } from "./layout/AppLayout";
import AnalisisList from "./pages/AnalisisList";
import AnalisisDetail from "./pages/AnalisisDetail";

/**
 * App
 *
 * - Envuelve la aplicación con AuthProvider para mantener la sesión global.
 * - Define rutas públicas y privadas bajo un layout global.
 * - Las rutas privadas usan ProtectedRoute.
 *
 * Nota:
 * - main.tsx debe envolver <App /> con ThemeProvider (MUI) y Toaster (sonner).
 * - ProtectedRoute muestra un fallback mientras se resuelve el estado de autenticación.
 */
export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            {/* Rutas públicas */}
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<ForgotPassword />} />

            {/* Rutas privadas */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard/realizar" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/realizar"
              element={
                <ProtectedRoute>
                  <AnalisisForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/lista"
              element={
                <ProtectedRoute>
                  <AnalisisList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/analisis/:id"
              element={
                <ProtectedRoute>
                  <ChakraProvider>
                    <AnalisisDetail />
                  </ChakraProvider>
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
