from typing import Dict, Tuple

from transformers import pipeline


LABEL_MAP = {
    "POS": "positivo",
    "POSITIVE": "positivo",
    "NEU": "neutral",
    "NEUTRAL": "neutral",
    "NEG": "negativo",
    "NEGATIVE": "negativo",
}


def build_sentiment_pipeline(model_name: str):
    return pipeline("sentiment-analysis", model=model_name)


def analizar_sentimiento_transformer(nlp, texto: str) -> Tuple[str, float]:
    resultado = nlp(texto)[0]
    label = str(resultado.get("label", "")).upper()
    score = float(resultado.get("score", 0.0))
    sentimiento = LABEL_MAP.get(label, "neutral")
    return sentimiento, score
