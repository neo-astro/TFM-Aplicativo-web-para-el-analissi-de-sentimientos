import { useEffect, useState } from "react";
import { obtenerAnalisisId } from "../services/apiDatos";
import type { DatosDocumento } from "../services/apiDatos";

/**
 * Hook para obtener el detalle de un análisis específico
 * usando el correo del usuario y el ID del análisis.
 */
export function useAnalisisDetail(userEmail?: string | null, analisisId?: string | null) {
  const [item, setItem] = useState<DatosDocumento | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userEmail || !analisisId) {
      setItem(null);
      setLoading(false);
      setError(null);
      return;
    }

    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await obtenerAnalisisId( analisisId);
        if (!mounted) return;
        if (res && (res as any).success) {
          setItem((res as any).documento ?? null);
        } else {
          setItem(null);
          setError((res as any).message ?? "No se encontró el análisis");
        }
      } catch (err: any) {
        if (!mounted) return;
        setItem(null);
        setError(err?.message ?? "Error al obtener análisis");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userEmail, analisisId]);

  return { item, loading, error };
}
