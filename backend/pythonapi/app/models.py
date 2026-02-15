from typing import Dict, List
from pydantic import BaseModel, Field


class ComentariosRequest(BaseModel):
    comentarios: List[str] = Field(..., description="Lista de comentarios a analizar")


class ComentarioResultado(BaseModel):
    comentario: str
    comentario_normalizado: str
    sentimiento_modelo: str
    score_modelo: float
    sentimiento_transformer: str
    score_transformer: float
    scores_por_dominio: Dict[str, float]
    dominio_principal: str
    tema_id: int
    tema_keywords: List[str]
    afiliacion: List[str]
    sentimiento_final: str
    matches: Dict[str, List[str]]


class AnalisisResponse(BaseModel):
    total_comentarios: int
    resumen_sentimientos: Dict[str, int]
    resumen_dominios: Dict[str, int]
    polarizacion: float
    riesgo: str
    frases_impacto: Dict[str, List[str]]
    temas: List[Dict[str, object]]
    resultados_detallados: List[ComentarioResultado]
