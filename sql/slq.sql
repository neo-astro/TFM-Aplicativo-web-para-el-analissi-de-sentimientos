CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_identifier TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plataforma TEXT NOT NULL,              -- tiktok
  video_id TEXT NOT NULL,                -- id real del video
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (plataforma, video_id)
);


CREATE TABLE analisis_eventos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  usuario_id UUID NOT NULL
    REFERENCES usuarios(id)
    ON DELETE CASCADE,

  video_id UUID NOT NULL
    REFERENCES videos(id)
    ON DELETE CASCADE,

  fecha_analisis TIMESTAMP DEFAULT NOW(),

  resultado JSONB NOT NULL               -- RESPUESTA COMPLETA DE PYTHON
);
