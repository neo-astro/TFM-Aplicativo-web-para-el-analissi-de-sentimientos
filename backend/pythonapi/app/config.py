from dataclasses import dataclass, field
import os
from pathlib import Path
from typing import List


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"


def _get_list_env(name: str, default: List[str]) -> List[str]:
    raw = os.getenv(name)
    if not raw:
        return default
    return [item.strip() for item in raw.split(",") if item.strip()]


@dataclass(frozen=True)
class Settings:
    alpha: float = float(os.getenv("SENTIMENT_ALPHA", "0.35"))
    beta: float = float(os.getenv("SENTIMENT_BETA", "0.65"))
    model_negative_threshold: float = float(os.getenv("MODEL_NEG_THRESHOLD", "-0.1"))
    model_positive_threshold: float = float(os.getenv("MODEL_POS_THRESHOLD", "0.1"))
    final_positive_threshold: float = float(os.getenv("FINAL_POS_THRESHOLD", "0.2"))
    final_negative_threshold: float = float(os.getenv("FINAL_NEG_THRESHOLD", "-0.2"))
    max_comment_length: int = int(os.getenv("MAX_COMMENT_LENGTH", "500"))
    max_comments: int = int(os.getenv("MAX_COMMENTS", "500"))
    risk_negative_ratio_high: float = float(os.getenv("RISK_NEG_RATIO_HIGH", "0.35"))
    risk_negative_ratio_medium: float = float(os.getenv("RISK_NEG_RATIO_MED", "0.15"))
    use_vader: bool = os.getenv("USE_VADER", "true").lower() == "true"
    use_transformer: bool = os.getenv("USE_TRANSFORMER", "true").lower() == "true"
    transformer_model: str = os.getenv(
        "TRANSFORMER_MODEL",
        "finiteautomata/beto-sentiment-analysis",
    )
    use_bertopic: bool = os.getenv("USE_BERTOPIC", "true").lower() == "true"
    bertopic_embedding_model: str = os.getenv(
        "BERTOPIC_EMBEDDING_MODEL",
        "paraphrase-multilingual-MiniLM-L12-v2",
    )
    bertopic_top_n_words: int = int(os.getenv("BERTOPIC_TOP_N_WORDS", "5"))
    cors_origins: List[str] = field(
        default_factory=lambda: _get_list_env(
            "CORS_ORIGINS",
            [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:8000",
            ],
        )
    )
    lexicon_path: Path = Path(os.getenv("LEXICON_PATH", str(DATA_DIR / "lexicon.json")))
    emoji_path: Path = Path(os.getenv("EMOJI_PATH", str(DATA_DIR / "emojis.json")))
    intent_path: Path = Path(os.getenv("INTENT_PATH", str(DATA_DIR / "intents.json")))


settings = Settings()
