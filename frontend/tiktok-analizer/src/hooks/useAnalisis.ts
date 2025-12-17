import { useState, useEffect } from "react";
import { crearAnalisis, type CrearAnalisisPayload } from "../services/api"; // API 8080
import { listarPorEmail, obtenerPorEmailYId } from "../services/apiDatos";   // API 3000

export const useAnalisis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Crear análisis (API 8080)
  const crear = async (payload: CrearAnalisisPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await crearAnalisis(payload);
      setLoading(false);
      return res;
    } catch (err: any) {
      setLoading(false);
      setError(err?.response?.data?.message ?? err.message ?? "Error desconocido");
      throw err;
    }
  };

  // Listar análisis (API 3000)
  const listar = async (userEmail: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await listarPorEmail(userEmail);
      setLoading(false);
      return res;
    } catch (err: any) {
      setLoading(false);
      setError(err?.response?.data?.message ?? err.message ?? "Error desconocido");
      throw err;
    }
  };

  // Obtener análisis por id (API 3000)
  const obtener = async (userEmail: string, id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await obtenerPorEmailYId(userEmail, id);
      setLoading(false);
      return res;
    } catch (err: any) {
      setLoading(false);
      setError(err?.response?.data?.message ?? err.message ?? "Error desconocido");
      throw err;
    }
  };

  return { loading, error, crear, listar, obtener };
};

// Hook adicional para detalle de análisis (API 3000)
export const useAnalisisDetail = (userEmail: string, docId: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userEmail || !docId) return;
      setLoading(true);
      try {
        const res = await obtenerPorEmailYId(userEmail, docId);
        setData(res);
      } catch (err: any) {
        setError(err?.response?.data?.message ?? err.message ?? "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userEmail, docId]);

  return { data, loading, error };
};
