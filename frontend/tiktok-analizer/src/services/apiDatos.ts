import axios from "axios";

const nodeApi = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

export type DatosDocumento = {
  id: string;
  user_id: string;
  payload: any;
  nombreanalisis: string;
  video_id: string;
  created_at: string;
};

export type ListarResponse =
  | { success: true; documentos: DatosDocumento[] }
  | { success: false; message: string };

export type ObtenerResponse =
  | { success: true; documento: DatosDocumento }
  | { success: false; message: string };

// Listar análisis por correo (API 3000)
export async function listarPorEmail(userEmail: string) {
  const url = `/api/datos/${encodeURIComponent(userEmail)}`;
  const { data } = await nodeApi.get<ListarResponse>(url);
  return data;
}

// Obtener análisis por correo + id (API 3000)
export async function obtenerPorEmailYId(userEmail: string, id: string) {
  const url = `/api/datos/${encodeURIComponent(userEmail)}/${encodeURIComponent(id)}`;
  const { data } = await nodeApi.get<ObtenerResponse>(url);
  return data;
}

export default nodeApi;
