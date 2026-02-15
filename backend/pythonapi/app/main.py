import logging
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from nltk.sentiment.vader import SentimentIntensityAnalyzer

from app.config import settings
from app.models import AnalisisResponse, ComentariosRequest
from app.services.analyzer import analizar_comentarios
from app.services.lexicon_loader import load_lexicons
from app.services.text_processing import ensure_nltk_resources
from app.services.topic_model import build_topic_model
from app.services.transformer_sentiment import build_sentiment_pipeline


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sentiment-api")

ensure_nltk_resources()
vader = SentimentIntensityAnalyzer()
lexicons = load_lexicons(settings.lexicon_path, settings.emoji_path, settings.intent_path)

transformer_nlp = None
if settings.use_transformer:
    try:
        transformer_nlp = build_sentiment_pipeline(settings.transformer_model)
    except Exception as exc:
        logger.warning("No se pudo cargar transformer: %s", exc)

topic_model = None
if settings.use_bertopic:
    try:
        topic_model = build_topic_model(settings.bertopic_embedding_model)
    except Exception as exc:
        logger.warning("No se pudo cargar BERTopic: %s", exc)

app = FastAPI(title="API Analisis de Sentimientos Enriquecido")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/api/analizar", response_model=AnalisisResponse)
def analizar(request: ComentariosRequest) -> AnalisisResponse:
    comentarios = [c.strip().replace("\n", " ") for c in request.comentarios if c.strip()]
    if not comentarios:
        raise HTTPException(status_code=400, detail="Lista de comentarios vacia")
    if len(comentarios) > settings.max_comments:
        raise HTTPException(status_code=400, detail="Demasiados comentarios")

    comentarios_validos: List[str] = []
    for comentario in comentarios:
        if len(comentario) > settings.max_comment_length:
            comentario = comentario[: settings.max_comment_length]
        comentarios_validos.append(comentario)

    logger.info("Recibidos comentarios para analisis: %s", len(comentarios_validos))

    resultado = analizar_comentarios(
        comentarios_validos,
        lexicons["lexicon"],
        lexicons["intents"],
        lexicons["emojis"],
        vader,
        transformer_nlp,
        topic_model,
        settings,
    )
    return AnalisisResponse(**resultado)
