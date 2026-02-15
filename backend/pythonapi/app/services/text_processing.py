import re
import unicodedata
from typing import Dict, List, Tuple

import nltk
from nltk.corpus import stopwords


def ensure_nltk_resources() -> None:
    nltk.download("stopwords", quiet=True)
    nltk.download("vader_lexicon", quiet=True)


def apply_emoji_map(texto: str, emoji_map: Dict[str, str]) -> Tuple[str, List[str]]:
    encontrados = []
    for emoji, significado in emoji_map.items():
        if emoji in texto:
            encontrados.append(significado)
            texto = texto.replace(emoji, f" {significado} ")
    return texto, list(dict.fromkeys(encontrados))


def normalizar_texto(texto: str, emoji_map: Dict[str, str]) -> Tuple[str, List[str]]:
    texto = texto.lower()
    texto, emojis_detectados = apply_emoji_map(texto, emoji_map)
    texto = unicodedata.normalize("NFD", texto)
    texto = "".join(c for c in texto if unicodedata.category(c) != "Mn")
    texto = re.sub(r"http\S+|www\S+", "", texto)
    texto = re.sub(r"[^a-zñ0-9\s]", " ", texto)
    texto = re.sub(r"\s+", " ", texto)
    return texto.strip(), emojis_detectados


def tokenizar(texto: str) -> List[str]:
    stop_words = set(stopwords.words("spanish"))
    return [t for t in texto.split() if t not in stop_words]
