import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

export type CrearAnalisisPayload = {
  userId: string;              // correo del usuario
  nombreanalisis: string;      // nombre del análisis
  videoId: string;             // id del video
  payload: object;             // datos adicionales
};

// Crear análisis (API 8080)
export async function crearAnalisis(payload: CrearAnalisisPayload) {
  const { data } = await api.post("/api/datos", payload);
  return data;
}

export default api;
