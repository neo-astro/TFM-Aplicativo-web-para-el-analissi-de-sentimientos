// Supabase Node API
import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) throw new Error("Supabase env vars missing");
if (!process.env.APIFY_TOKEN) throw new Error("APIFY_TOKEN missing");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function getOrCreateUser(email) {
  // Buscar usuario
  let { data: usuario, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('user_identifier', email)
    .single();

  if (!usuario) {
    const { data: newUser, error: insertError } = await supabase
      .from('usuarios')
      .insert([{ user_identifier: email }])
      .select()
      .single();
    if (insertError) throw insertError;
    usuario = newUser;
  }

  return usuario.id; // UUID
}

async function getOrCreateVideo(videoId, url) {
  let { data: video, error } = await supabase
    .from('videos')
    .select('*')
    .eq('video_id', videoId)
    .single();

  if (!video) {
    const { data: newVideo, error: insertError } = await supabase
      .from('videos')
      .insert([{ plataforma: 'tiktok', video_id: videoId, url }])
      .select()
      .single();
    if (insertError) throw insertError;
    video = newVideo;
  }

  return video.id; // UUID
}
