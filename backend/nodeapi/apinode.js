import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ApifyClient } from "apify-client";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// -----------------------
// Validaciones iniciales
// -----------------------
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY)
  throw new Error("Supabase env vars missing");
if (!process.env.APIFY_TOKEN)
  throw new Error("APIFY_TOKEN missing");

// -----------------------
// Clientes
// -----------------------
// 🔧 CAMBIO IMPORTANTE:
// usa SERVICE ROLE para evitar problemas de RLS
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY // debe ser service_role
);

const apifyClient = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

const app = express();
app.use(cors());
app.use(express.json());

// -----------------------
// Función para log de seguimiento
// -----------------------
function logStep(step, data) {
  console.log(`\n=== STEP: ${step} ===`);
  if (data !== undefined) {
    console.log(JSON.stringify(data, null, 2));
  }
  console.log("=== END STEP ===\n");
}

// ======================================================
// HELPERS SUPABASE (NO CAMBIAN ENDPOINTS)
// ======================================================

// 🔧 CAMBIO: userId es EMAIL, aquí resolvemos UUID real
async function getOrCreateUsuario(email) {
  logStep("SUPABASE: getOrCreateUsuario", { email });

  const { data: existing, error } = await supabase
    .from("usuarios")
    .select("id")
    .eq("user_identifier", email)
    .maybeSingle();

  if (error) throw error;

  if (existing) {
    logStep("Usuario existente", existing);
    return existing.id;
  }

  const { data: created, error: insertError } = await supabase
    .from("usuarios")
    .insert([{ user_identifier: email }])
    .select("id")
    .single();

  if (insertError) throw insertError;

  logStep("Usuario creado", created);
  return created.id;
}

// 🔧 CAMBIO: videoId TikTok (STRING) → UUID interno
async function getOrCreateVideo(videoId, videoUrl) {
  logStep("SUPABASE: getOrCreateVideo", { videoId, videoUrl });

  const { data: existing, error } = await supabase
    .from("videos")
    .select("id")
    .eq("video_id", videoId)
    .maybeSingle();

  if (error) throw error;

  if (existing) {
    logStep("Video existente", existing);
    return existing.id;
  }

  const { data: created, error: insertError } = await supabase
    .from("videos")
    .insert([
      {
        plataforma: "tiktok",
        video_id: videoId, // STRING ✔
        url: videoUrl,
      },
    ])
    .select("id")
    .single();

  if (insertError) throw insertError;

  logStep("Video creado", created);
  return created.id;
}

// -----------------------
// POST /api/tiktok-comments
// (SIN CAMBIOS FUNCIONALES)
// -----------------------
app.post("/api/tiktok-comments", async (req, res) => {
  try {
    const { url, commentsPerPost } = req.body;
    logStep("REQUEST /tiktok-comments", { url, commentsPerPost });

    if (!url) {
      return res.status(400).json({
        success: false,
        error: "La URL del video es obligatoria",
      });
    }

    const input = {
      postURLs: [url],
      commentsPerPost: Number(commentsPerPost || 5),
      maxRepliesPerComment: 0,
    };

    const run = await apifyClient
      .actor("BDec00yAmCm1QbMEI")
      .call(input);

    const { items } = await apifyClient
      .dataset(run.defaultDatasetId)
      .listItems();

    const comentarios = items.map((i) => i.text);

    logStep("COMMENTS SCRAPED", {
      total: comentarios.length,
      comentarios,
    });

    res.json({
      success: true,
      total: comentarios.length,
      comentarios,
    });
  } catch (err) {
    console.error("❌ ERROR /tiktok-comments", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// -----------------------
// POST /api/datos
// -----------------------
app.post("/api/datos", async (req, res) => {
  try {
    const {
      userId,         // email
      nombreanalisis,
      videoId,        // TikTok ID (STRING)
      videoUrl,
      payload,
      resultado,
    } = req.body;

    logStep("REQUEST /api/datos", {
      userId,
      nombreanalisis,
      videoId,
      videoUrl,
      resultado,
    });

    // 🔧 CAMBIO CLAVE: resolvemos UUIDs reales
    const usuarioUUID = await getOrCreateUsuario(userId);
    const videoUUID = await getOrCreateVideo(videoId, videoUrl);

    logStep("UUIDs RESUELTOS", {
      usuarioUUID,
      videoUUID,
    });

    const { data, error } = await supabase
      .from("analisis_eventos")
      .insert([
        {
          usuario_id: usuarioUUID, // UUID ✔
          video_id: videoUUID,     // UUID ✔
          resultado: {
            nombreanalisis,
            videoUrl,
            ...payload,
            resumen_final: resultado,
          },
        },
      ])
      .select()
      .single();

    if (error) throw error;

    logStep("ANALISIS GUARDADO", data);

    res.json({
      success: true,
      documento: data,
    });
  } catch (error) {
    console.error("❌ Error guardando análisis:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// -----------------------
// GET /api/datos/:userId
// (userId sigue siendo EMAIL)
// -----------------------
app.get("/api/datos/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    logStep("REQUEST GET /datos/:userId", { userId });

    const usuarioUUID = await getOrCreateUsuario(userId);

    const { data, error } = await supabase
      .from("analisis_eventos")
      .select("*")
      .eq("usuario_id", usuarioUUID);

    if (error) throw error;

   const documentos = data.map(doc => {
  const r = doc.resultado;

  // sentimiento predominante
  const resumen = r.resumen_final || {};
  let sentimiento_predominante = "neutral";

  if ((resumen.positivos ?? 0) > (resumen.negativos ?? 0)) {
    sentimiento_predominante = "positivo";
  } else if ((resumen.negativos ?? 0) > (resumen.positivos ?? 0)) {
    sentimiento_predominante = "negativo";
  }

  // dominio principal
  const dominios =
    r.resultados_detallados?.[0]?.scores_por_dominio || {};

  const dominio_principal =
    Object.entries(dominios)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "general";

  return {
    id: doc.id,
    nombreAnalisis: r.nombreanalisis,
    fecha: doc.fecha_analisis,
    total_comentarios: r.total_comentarios,
    sentimiento_predominante,
    dominio_principal
  };
});

res.json({
  success: true,
  data: documentos
});

  } catch (err) {
    console.error("❌ ERROR GET /datos/:userId", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// -----------------------
// GET /api/datos/:userId/:docId
// -----------------------
app.get("/api/analisisResult/:Id", async (req, res) => {
  try {
    const { Id } = req.params;
    console.log("query parameter", Id);
    logStep("REQUEST GET /analisisResult/:Id", {Id});
    const { data, error } = await supabase
      .from("analisis_eventos")
      .select("*")
      .eq("id", Id)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      documento: data,
    });
  } catch (err) {
    console.error("❌ ERROR GET /datos/:userId/:docId", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// -----------------------
// Servidor
// -----------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Node API corriendo en http://localhost:${PORT}`);
});
