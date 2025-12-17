// /src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Contexto de autenticación
import { AuthProvider } from "./context/AuthContext";

// Layouts y componentes de protección de rutas
import { ProtectedRoute } from "./components/ProtectedRoute";



// Páginas privadas (dashboard)
import { AnalisisForm } from "./pages/AnalisisForm";
import { Landing } from "./layout/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import { AppLayout } from "./pages/AppLayout";
import AnalisisList from "./pages/AnalisisList";
import AnalisisDetail from "./pages/AnalisisDetail";

/**
 * App
 *
 * - Envuelve la aplicación con AuthProvider para mantener la sesión global.
 * - Define rutas públicas: "/", "/login", "/register", "/forgot".
 * - Define rutas privadas bajo "/dashboard/*" protegidas por ProtectedRoute.
 * - AppLayout contiene Header y Sidebar; las páginas del dashboard se renderizan dentro del layout.
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
          {/* Rutas públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<ForgotPassword />} />

          {/* Rutas privadas: todo lo que esté bajo /dashboard requiere autenticación */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                {/* AppLayout incluye Header y Sidebar; el contenido del dashboard va dentro */}
                <AppLayout>
                  {/* Aquí usamos <Navigate> para redirigir a la subruta por defecto */}
                  <Navigate to="/dashboard/realizar" replace />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Rutas concretas del dashboard (se pueden definir como rutas separadas para SEO/links directos) */}
          <Route
            path="/dashboard/realizar"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AnalisisForm />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/lista"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AnalisisList />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/analisis/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AnalisisDetail />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all: redirige a landing si la ruta no existe */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
