import json
from pathlib import Path
from typing import Any, Dict


def _load_json(path: Path) -> Dict[str, Any]:
    if not path.exists():
        raise FileNotFoundError(f"No se encontro el archivo: {path}")
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def load_lexicons(lexicon_path: Path, emoji_path: Path, intent_path: Path) -> Dict[str, Any]:
    return {
        "lexicon": _load_json(lexicon_path),
        "emojis": _load_json(emoji_path),
        "intents": _load_json(intent_path),
    }
