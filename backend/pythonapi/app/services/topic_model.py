from typing import Dict, List, Tuple

from bertopic import BERTopic
from sentence_transformers import SentenceTransformer


def build_topic_model(embedding_model_name: str) -> BERTopic:
    embedding_model = SentenceTransformer(embedding_model_name)
    return BERTopic(embedding_model=embedding_model, language="spanish")


def extraer_temas(model: BERTopic, comentarios: List[str]) -> Tuple[List[int], List[Dict[str, object]]]:
    if len(comentarios) < 5:
        return [-1 for _ in comentarios], []
    try:
        topics, _ = model.fit_transform(comentarios)
        info = model.get_topic_info().to_dict("records")
        return topics, info
    except Exception:
        return [-1 for _ in comentarios], []


def tema_keywords(model: BERTopic, topic_id: int, top_n: int) -> List[str]:
    if topic_id is None or topic_id == -1:
        return []
    palabras = model.get_topic(topic_id) or []
    return [w for w, _ in palabras[:top_n]]
