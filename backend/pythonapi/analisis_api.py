# =========================================================
# analisis_api.py
# API REST – Análisis semántico enriquecido (tesis)
# =========================================================

import re
import unicodedata
from collections import Counter
from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import nltk
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from nltk.corpus import stopwords
from nltk.sentiment.vader import SentimentIntensityAnalyzer

# =========================================================
# DESCARGA DE RECURSOS NLTK (solo 1 vez)
# =========================================================
nltk.download("stopwords", quiet=True)
nltk.download("vader_lexicon", quiet=True)

STOPWORDS = set(stopwords.words("spanish"))
VADER = SentimentIntensityAnalyzer()

ALPHA = 0.4
BETA = 0.6

# =========================================================
# DICCIONARIOS CONTEXTUALES
# =========================================================

LEXICON = {
    "ventas": {
        "positivo": [
            "barato", "económico", "oferta", "recomendado",
            "vale la pena", "buena calidad", "me encantó",
            "compraría", "excelente precio"
        ],
        "negativo": [
            "caro", "estafa", "mala calidad", "no sirve",
            "no lo recomiendo", "pésimo"
        ]
    },
    "politica": {
        "positivo": [
            "mejor presidente", "todo el apoyo", "excelente líder",
            "gran presidente", "mi voto", "gran gestión"
        ],
        "negativo": [
            "corrupto", "mentiroso", "fraude", "dictador",
            "pésimo gobierno", "no sirve"
        ]
    },
    "reseñas": {
        "positivo": [
            "me gustó", "funciona bien", "excelente producto",
            "muy útil", "recomendado", "cumple"
        ],
        "negativo": [
            "defectuoso", "no funciona", "malo",
            "decepcionado", "no cumple"
        ]
    }
}

AFILIACION = {
    "interes": [
        "precio", "cuánto cuesta", "información",
        "detalles", "donde comprar", "cómo adquirir"
    ],
    "soporte": [
        "ayuda", "problema", "falla", "no funciona",
        "reclamo", "garantía"
    ],
    "apoyo": [
        "todo mi apoyo", "mi voto", "estoy con",
        "siempre contigo"
    ]
}

# =========================================================
# MODELOS DE ENTRADA
# =========================================================

class ComentariosRequest(BaseModel):
    comentarios: List[str]

# =========================================================
# UTILIDADES
# =========================================================

def normalizar_texto(texto: str) -> str:
    texto = texto.lower()
    texto = unicodedata.normalize("NFD", texto)
    texto = "".join(c for c in texto if unicodedata.category(c) != "Mn")
    texto = re.sub(r"http\S+|www\S+", "", texto)
    texto = re.sub(r"[^a-zñáéíóúü\s]", "", texto)
    return texto.strip()

# =========================================================
# CAPA 1 – MODELO VADER
# =========================================================

def sentimiento_modelo(texto: str):
    score = VADER.polarity_scores(texto)["compound"]

    if score >= 0.05:
        return "positivo", score
    elif score <= -0.05:
        return "negativo", score
    else:
        return "neutral", score

# =========================================================
# CAPA 3 – SEMÁNTICA
# =========================================================

def sentimiento_semantico(texto: str):
    scores = {}

    for dominio, valores in LEXICON.items():
        pos = sum(1 for p in valores["positivo"] if p in texto)
        neg = sum(1 for n in valores["negativo"] if n in texto)
        scores[dominio] = pos - neg

    return scores

# =========================================================
# CAPA 2 – AFILIACIÓN
# =========================================================

def detectar_afiliacion(texto: str):
    return [
        categoria
        for categoria, palabras in AFILIACION.items()
        if any(p in texto for p in palabras)
    ]

# =========================================================
# CLASIFICACIÓN FINAL
# =========================================================

def clasificacion_final(modelo_score, sem_scores):
    sem_total = sum(sem_scores.values())
    score_final = (modelo_score * ALPHA) + (sem_total * BETA)

    if score_final > 0.2:
        return "positivo"
    elif score_final < -0.2:
        return "negativo"
    else:
        return "neutral"

# =========================================================
# PIPELINE PRINCIPAL
# =========================================================

def analizar_comentarios(comentarios: List[str]):
    resultados = []

    for texto_original in comentarios:
        texto = normalizar_texto(texto_original)

        sent_mod, score_mod = sentimiento_modelo(texto)
        sem_scores = sentimiento_semantico(texto)
        afiliacion = detectar_afiliacion(texto)

        resultados.append({
            "comentario": texto_original,
            "sentimiento_modelo": sent_mod,
            "score_modelo": score_mod,
            "scores_por_dominio": sem_scores,
            "afiliacion": afiliacion,
            "sentimiento_final": clasificacion_final(score_mod, sem_scores)
        })

    resumen = Counter(r["sentimiento_final"] for r in resultados)

    return {
        "total_comentarios": len(resultados),
        "resumen_sentimientos": dict(resumen),
        "resultados_detallados": resultados
    }

# =========================================================
# API FASTAPI
# =========================================================

app = FastAPI(title="API Análisis de Sentimientos Enriquecido")

origins = [
    "http://localhost:5173",   # frontend dev URL (ajusta)
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    # agrega los orígenes que necesites (o "*" para pruebas)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # o ["*"] en desarrollo
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"],  # o ["*"]
    allow_headers=["*"],              # o lista específica de headers
)
@app.post("/api/analizar")
def analizar(request: ComentariosRequest):
    if not request.comentarios:
        raise HTTPException(status_code=400, detail="Lista de comentarios vacía")
    data =[]
    for e in request.comentarios:
        e.replace("\n", "")
        data.append(e)
    return analizar_comentarios(data)
