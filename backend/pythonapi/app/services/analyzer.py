from collections import Counter
from typing import Dict, List, Tuple, Optional

import numpy as np
from nltk.sentiment.vader import SentimentIntensityAnalyzer

from app.config import Settings
from app.services.text_processing import normalizar_texto, tokenizar
from app.services.transformer_sentiment import analizar_sentimiento_transformer
from app.services.topic_model import extraer_temas, tema_keywords


SENTIMENT_VALUES = {"positivo": 1, "neutral": 0, "negativo": -1}


def sentimiento_modelo(texto: str, vader: SentimentIntensityAnalyzer, settings: Settings) -> Tuple[str, float]:
    if not settings.use_vader:
        return "neutral", 0.0
    score = vader.polarity_scores(texto)["compound"]
    if score >= 0.05:
        return "positivo", score
    if score <= -0.05:
        return "negativo", score
    return "neutral", score


def _has_negation(tokens: List[str], start_idx: int, window: int, negations: List[str]) -> bool:
    begin = max(0, start_idx - window)
    return any(tokens[i] in negations for i in range(begin, start_idx))


def _match_phrases(
    tokens: List[str],
    phrases: List[Dict[str, object]],
    negations: List[str],
    window: int = 3,
) -> Tuple[float, List[str]]:
    score = 0.0
    matched = []
    for phrase in phrases:
        text = str(phrase.get("text", "")).strip()
        weight = float(phrase.get("weight", 1))
        if not text:
            continue
        phrase_tokens = text.split()
        if not phrase_tokens:
            continue
        for i in range(len(tokens) - len(phrase_tokens) + 1):
            if tokens[i : i + len(phrase_tokens)] == phrase_tokens:
                negated = _has_negation(tokens, i, window, negations)
                score += -weight if negated else weight
                matched.append(text)
                break
    return score, matched


def _match_words(
    tokens: List[str],
    words: List[str],
    negations: List[str],
    polarity: int,
    window: int = 2,
) -> Tuple[int, List[str]]:
    score = 0
    matched = []
    words_set = set(words)
    for i, token in enumerate(tokens):
        if token in words_set:
            negated = _has_negation(tokens, i, window, negations)
            score += -polarity if negated else polarity
            matched.append(token)
    return score, matched


def sentimiento_semantico(
    texto: str,
    tokens: List[str],
    lexicon: Dict[str, object],
) -> Tuple[Dict[str, float], Dict[str, List[str]]]:
    negations = lexicon.get("negations", [])
    domains = lexicon.get("domains", {})
    global_lex = lexicon.get("global", {})
    scores: Dict[str, float] = {}
    matches = {
        "positive_phrases": [],
        "negative_phrases": [],
        "positive_words": [],
        "negative_words": [],
    }

    def _domain_score(domain_data: Dict[str, object]) -> int:
        score = 0
        pos_phrases = domain_data.get("positive_phrases", [])
        neg_phrases = domain_data.get("negative_phrases", [])
        pos_words = domain_data.get("positive_words", [])
        neg_words = domain_data.get("negative_words", [])

        s1, m1 = _match_phrases(tokens, pos_phrases, negations)
        s2, m2 = _match_phrases(tokens, neg_phrases, negations)
        s3, m3 = _match_words(tokens, pos_words, negations, polarity=1)
        s4, m4 = _match_words(tokens, neg_words, negations, polarity=-1)

        matches["positive_phrases"].extend(m1)
        matches["negative_phrases"].extend(m2)
        matches["positive_words"].extend(m3)
        matches["negative_words"].extend(m4)

        score += s1 - s2 + s3 + s4
        return score

    global_score = _domain_score(global_lex)
    scores["global"] = global_score

    for domain, domain_data in domains.items():
        scores[domain] = _domain_score(domain_data)

    matches = {k: list(dict.fromkeys(v)) for k, v in matches.items()}
    return scores, matches


def detectar_afiliacion(texto: str, intents: Dict[str, List[str]]) -> List[str]:
    afiliacion = []
    for categoria, palabras in intents.items():
        if any(p in texto for p in palabras):
            afiliacion.append(categoria)
    return afiliacion


def _normalizar_semantica(sem_scores: Dict[str, float]) -> float:
    total = sum(sem_scores.values())
    if total == 0:
        return 0.0
    return max(-1.0, min(1.0, total / abs(total)))


def clasificacion_final(modelo_score: float, sem_scores: Dict[str, float], settings: Settings) -> str:
    sem_norm = _normalizar_semantica(sem_scores)
    score_final = (modelo_score * settings.alpha) + (sem_norm * settings.beta)
    if modelo_score < settings.model_negative_threshold:
        return "negativo"
    if modelo_score > settings.model_positive_threshold:
        return "positivo"
    if score_final > settings.final_positive_threshold:
        return "positivo"
    if score_final < settings.final_negative_threshold:
        return "negativo"
    return "neutral"


def dominio_principal(scores_por_dominio: Dict[str, float]) -> str:
    filtered = {k: v for k, v in scores_por_dominio.items() if k != "global"}
    if not filtered:
        return "general"
    domain, score = max(filtered.items(), key=lambda item: abs(item[1]))
    return domain if score != 0 else "general"


def calcular_polarizacion(sentimientos: List[str]) -> float:
    values = [SENTIMENT_VALUES[s] for s in sentimientos]
    return float(np.var(values)) if values else 0.0


def calcular_riesgo(sentimientos: List[str], settings: Settings) -> str:
    if not sentimientos:
        return "bajo"
    negativos = sum(1 for s in sentimientos if s == "negativo")
    ratio = negativos / len(sentimientos)
    if ratio >= settings.risk_negative_ratio_high:
        return "alto"
    if ratio >= settings.risk_negative_ratio_medium:
        return "medio"
    return "bajo"


def _score_from_transformer(sentimiento: str, score: float) -> float:
    if sentimiento == "positivo":
        return score
    if sentimiento == "negativo":
        return -score
    return 0.0


def analizar_comentarios(
    comentarios: List[str],
    lexicon: Dict[str, object],
    intents: Dict[str, List[str]],
    emoji_map: Dict[str, str],
    vader: SentimentIntensityAnalyzer,
    transformer_nlp: Optional[object],
    topic_model: Optional[object],
    settings: Settings,
) -> Dict[str, object]:
    resultados = []
    sentimientos = []
    resumen_dominios = Counter()
    frase_pos = Counter()
    frase_neg = Counter()
    emojis_totales = Counter()

    normalizados = []
    tokens_list = []
    emojis_list = []
    for texto_original in comentarios:
        texto_normalizado, emojis_detectados = normalizar_texto(texto_original, emoji_map)
        normalizados.append(texto_normalizado)
        emojis_list.append(emojis_detectados)
        tokens_list.append(tokenizar(texto_normalizado))

    temas_info = []
    temas_por_comentario = [-1 for _ in comentarios]
    if topic_model and settings.use_bertopic:
        temas_por_comentario, temas_info = extraer_temas(topic_model, normalizados)

    for idx, texto_original in enumerate(comentarios):
        texto_normalizado = normalizados[idx]
        tokens = tokens_list[idx]
        emojis_detectados = emojis_list[idx]

        sent_mod, score_mod = sentimiento_modelo(texto_normalizado, vader, settings)
        sent_trans, score_trans = ("neutral", 0.0)
        if transformer_nlp and settings.use_transformer:
            sent_trans, score_trans = analizar_sentimiento_transformer(transformer_nlp, texto_original)
        score_modelo_final = _score_from_transformer(sent_trans, score_trans) if transformer_nlp else score_mod
        sem_scores, matches = sentimiento_semantico(texto_normalizado, tokens, lexicon)
        afiliacion = detectar_afiliacion(texto_normalizado, intents)
        dominio = dominio_principal(sem_scores)
        sentimiento_final = clasificacion_final(score_modelo_final, sem_scores, settings)

        sentimientos.append(sentimiento_final)
        resumen_dominios[dominio] += 1
        frase_pos.update(matches["positive_phrases"])
        frase_neg.update(matches["negative_phrases"])
        emojis_totales.update(emojis_detectados)

        matches["emojis_detectados"] = emojis_detectados
        tema_id = temas_por_comentario[idx] if idx < len(temas_por_comentario) else -1
        keywords = tema_keywords(topic_model, tema_id, settings.bertopic_top_n_words) if topic_model else []

        resultados.append(
            {
                "comentario": texto_original,
                "comentario_normalizado": texto_normalizado,
                "sentimiento_modelo": sent_mod,
                "score_modelo": score_mod,
                "sentimiento_transformer": sent_trans,
                "score_transformer": score_trans,
                "scores_por_dominio": sem_scores,
                "dominio_principal": dominio,
                "tema_id": int(tema_id) if tema_id is not None else -1,
                "tema_keywords": keywords,
                "afiliacion": afiliacion,
                "sentimiento_final": sentimiento_final,
                "matches": matches,
            }
        )

    resumen_sentimientos = Counter(r["sentimiento_final"] for r in resultados)
    polarizacion = calcular_polarizacion(sentimientos)
    riesgo = calcular_riesgo(sentimientos, settings)

    return {
        "total_comentarios": len(resultados),
        "resumen_sentimientos": dict(resumen_sentimientos),
        "resumen_dominios": dict(resumen_dominios),
        "polarizacion": polarizacion,
        "riesgo": riesgo,
        "frases_impacto": {
            "top_positivas": [f for f, _ in frase_pos.most_common(5)],
            "top_negativas": [f for f, _ in frase_neg.most_common(5)],
            "top_emojis": [f for f, _ in emojis_totales.most_common(5)],
        },
        "temas": temas_info,
        "resultados_detallados": resultados,
    }
