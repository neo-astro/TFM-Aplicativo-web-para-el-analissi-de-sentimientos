import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApifyClient } from 'apify-client';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Inicializar Apify Client
const client = new ApifyClient({
    token: process.env.APIFY_TOKEN,
});


app.post('/api/tiktok-comments', async (req, res) => {
    try {
        const { url, commentsPerPost } = req.body;

        // Validaciones
        if (!url) {
            return res.status(400).json({ error: 'La URL del video es obligatoria' });
        }

        if (!commentsPerPost || commentsPerPost <= 0) {
            return res.status(400).json({ error: 'commentsPerPost debe ser mayor a 0' });
        }

        const input = {
            postURLs: [url],
            commentsPerPost: Number(commentsPerPost),
            maxRepliesPerComment: 0,
            resultsPerPage: 1,
            profileScrapeSections: ["videos"],
            profileSorting: "latest",
            excludePinnedPosts: false,
        };

        // Ejecutar actor
        const run = await client
            .actor("BDec00yAmCm1QbMEI")
            .call(input);

        // Obtener resultados
        const { items } = await client
            .dataset(run.defaultDatasetId)
            .listItems();
        const texts = items.map(item => item.text);
        return res.json({
            success: true,
            total: items.length,
            comentarios: texts,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: 'Error ejecutando el actor de Apify',
            details: error.message,
        });
    }
});








// Insertar un nuevo análisis
app.post('/api/datos', async (req, res) => {
  try {
    const { userId, nombreanalisis, videoId, payload } = req.body;

    const { data, error } = await supabase
      .from('datos')
      .insert([{ user_id: userId, nombreanalisis, video_id: videoId, payload }])
      .select();

    if (error) throw error;

    res.json({ success: true, documento: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener todos los análisis de un usuario
app.get('/api/datos/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('datos')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ success: true, documentos: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener un análisis específico por id y userId
app.get('/api/datos/:userId/:docId', async (req, res) => {
  try {
    const { userId, docId } = req.params;

    const { data, error } = await supabase
      .from('datos')
      .select('*')
      .eq('user_id', userId)
      .eq('id', docId)
      .single();

    if (error) throw error;

    res.json({ success: true, documento: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Iniciar servidor

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API corriendo en http://localhost:${PORT}`);
});
