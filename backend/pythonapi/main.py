# =========================================================
# analisis_api.py
# API REST – Análisis semántico enriquecido (tesis)
# =========================================================

import re
import unicodedata
from collections import Counter
from typing import List

import nltk
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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

# Pesos (ajustables experimentalmente)
ALPHA = 0.3   # modelo estadístico
BETA = 0.7    # semántica contextual

# =========================================================
# DICCIONARIOS CONTEXTUALES
# =========================================================

LEXICON = {
    "ventas": {
        "positivo": [
            "barato", "economico", "oferta", "recomendado",
            "vale la pena", "buena calidad", "me encanto",
            "compraria", "excelente precio"
        ],
        "negativo": [
            "caro", "estafa", "mala calidad", "no sirve",
            "no lo recomiendo", "pesimo"
        ]
    },
    "politica": {
        "positivo": [
            "mejor presidente", "todo el apoyo", "excelente lider",
            "gran presidente", "mi voto", "gran gestion"
        ],
        "negativo": [
            "corrupto", "mentiroso", "fraude", "dictador",
            "pesimo gobierno", "no sirve"
        ]
    },
    "reseñas": {
        "positivo": [
            "me gusto", "funciona bien", "excelente producto",
            "muy util", "recomendado", "cumple"
        ],
        "negativo": [
            "defectuoso", "no funciona", "malo",
            "decepcionado", "no cumple"
        ]
    }
}

AFILIACION = {
    "interes": [
        "precio", "cuanto cuesta", "informacion",
        "detalles", "donde comprar", "como adquirir"
    ],
    "soporte": [
        "ayuda", "problema", "falla", "no funciona",
        "reclamo", "garantia"
    ],
    "apoyo": [
        "todo mi apoyo", "mi voto", "estoy con",
        "siempre contigo"
    ]
}

NEGACIONES = {"no", "nunca", "jamás", "ni"}

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
    texto = re.sub(r"[^a-zñ\s]", " ", texto)
    texto = re.sub(r"\s+", " ", texto)
    return texto.strip()

def tokenizar(texto: str) -> List[str]:
    return [t for t in texto.split() if t not in STOPWORDS]

# =========================================================
# CAPA 1 – MODELO ESTADÍSTICO (VADER)
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
# CAPA 3 – SEMÁNTICA CONTEXTUAL
# =========================================================

def contiene_negacion(texto: str, expresion: str) -> bool:
    patron = rf"(no|nunca|jamás)\s+{re.escape(expresion)}"
    return re.search(patron, texto) is not None

def sentimiento_semantico(texto: str):
    scores = {}

    for dominio, valores in LEXICON.items():
        pos = 0
        neg = 0

        for p in valores["positivo"]:
            if p in texto and not contiene_negacion(texto, p):
                pos += 1

        for n in valores["negativo"]:
            if n in texto:
                neg += 1

        scores[dominio] = pos - neg

    return scores

# =========================================================
# CAPA 2 – AFILIACIÓN / INTENCIÓN
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

def normalizar_semantica(sem_scores: dict) -> float:
    total = sum(sem_scores.values())
    if total == 0:
        return 0.0
    return max(-1.0, min(1.0, total / abs(total)))

def clasificacion_final(modelo_score, sem_scores):
    sem_norm = normalizar_semantica(sem_scores)
    score_final = (modelo_score * ALPHA) + (sem_norm * BETA)

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
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/analizar")
def analizar(request: ComentariosRequest):
    if not request.comentarios:
        raise HTTPException(status_code=400, detail="Lista de comentarios vacía")

    data = []
    for e in request.comentarios:
        e = e.replace("\n", "").strip()
        data.append(e)

    return analizar_comentarios(data)
