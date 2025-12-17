// /src/service/orchestrator.ts
import axios from "axios";

export type TiktokCommentsRequest = {
  url: string;
  commentsPerPost: number;
};

export type TiktokCommentsResponse = {
  success: boolean;
  total: number;
  comentarios: string[];
};

export type AnalizarRequest = {
  total: number;
  comentarios: string[];
};

export type AnalizarResponse = {
  total_comentarios: number;
  resumen_sentimientos?: { positivo?: number; neutral?: number; negativo?: number };
  resultados_detallados: {
    comentario: string;
    sentimiento_modelo: "positivo" | "neutral" | "negativo";
    score_modelo: number;
    scores_por_dominio: Record<string, number>;
    afiliacion: string[];
    sentimiento_final: "positivo" | "neutral" | "negativo";
  }[];
};

export type DatosRequest = {
  userId: string; // aquí envías el email del usuario
  nombreanalisis: string;
  videoId: string;
  payload: Omit<AnalizarResponse, "success">;
  resultado: { positivos: number; negativos: number; neutros: number };
};

// axios instances (ajusta timeouts si quieres)
const nodeApi = axios.create({ baseURL: "http://127.0.0.1:3000", timeout: 60000 });
const pythonApi = axios.create({ baseURL: "http://localhost:8000", timeout: 60000 });

/**
 * Orquesta: obtiene comentarios -> analiza -> persiste datos
 * @param userEmail email del usuario (se envía como userId en /api/datos)
 * @param nombreAnalisis nombre descriptivo
 * @param videoUrl url completa del video de TikTok
 * @param commentsPerPost número de comentarios a solicitar
 * @param videoId id del video (puedes extraerlo o pasar uno)
 */
export async function runFullAnalysis({
  userEmail,
  nombreAnalisis,
  videoUrl,
  commentsPerPost = 5,
  videoId,
}: {
  userEmail: string;
  nombreAnalisis: string;
  videoUrl: string;
  commentsPerPost?: number;
  videoId: string;
}): Promise<{ success: true; data: DatosRequest } | { success: false; message: string }> {
  try {
    // 1) Node: obtener comentarios
    const commentsReq: TiktokCommentsRequest = { url: videoUrl, commentsPerPost };
    const commentsRes = await nodeApi.post<TiktokCommentsResponse>("/api/tiktok-comments", commentsReq);
    const commentsData = commentsRes.data;
    if (!commentsData || !commentsData.success) {
      return { success: false, message: "Error al obtener comentarios desde Node API" };
    }

    // 2) Python: analizar comentarios
    const analizarReq: AnalizarRequest = { total: commentsData.total, comentarios: commentsData.comentarios };
    const analizarRes = await pythonApi.post<AnalizarResponse>("/api/analizar", analizarReq);
    const analizarData = analizarRes.data;
    if (!analizarData) {
      return { success: false, message: "Error al analizar comentarios en Python API" };
    }

    // 3) Construir payload para /api/datos (payload = todo lo retornado por python menos 'success')
    const payloadForStore: Omit<AnalizarResponse, "success"> = {
      total_comentarios: analizarData.total_comentarios,
      resumen_sentimientos: analizarData.resumen_sentimientos,
      resultados_detallados: analizarData.resultados_detallados,
    };

    // 4) Calcular resultado (positivos/negativos/neutros)
    // Preferimos usar resumen_sentimientos si existe, si no, contamos por sentimiento_final
    let positivos = 0;
    let negativos = 0;
    let neutros = 0;

    if (analizarData.resumen_sentimientos && Object.keys(analizarData.resumen_sentimientos).length > 0) {
      positivos = analizarData.resumen_sentimientos.positivo ?? 0;
      negativos = analizarData.resumen_sentimientos.negativo ?? 0;
      neutros = analizarData.resumen_sentimientos.neutral ?? 0;
    } else {
      for (const r of analizarData.resultados_detallados) {
        if (r.sentimiento_final === "positivo") positivos++;
        else if (r.sentimiento_final === "negativo") negativos++;
        else neutros++;
      }
    }

    const datosPayload: DatosRequest = {
      userId: userEmail,
      nombreanalisis: nombreAnalisis,
      videoId,
      payload: payloadForStore,
      resultado: { positivos, negativos, neutros },
    };

    // 5) Node: persistir datos
    await nodeApi.post("/api/datos", datosPayload, { headers: { "Content-Type": "application/json" } });

    return { success: true, data: datosPayload };
  } catch (err: any) {
    // Manejo simple de errores; puedes enriquecer con logs o reintentos
    const message = err?.response?.data?.message ?? err?.message ?? "Error desconocido en orquestador";
    return { success: false, message };
  }
}
