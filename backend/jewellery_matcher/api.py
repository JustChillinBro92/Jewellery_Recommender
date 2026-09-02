"""FastAPI application for jewellery recommendations."""

from __future__ import annotations

import io
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

from .inventory import load_inventory
from .recommender import Recommender


def create_app(csv_path: Path, images_dir: Path) -> FastAPI:
    recommender = Recommender(load_inventory(csv_path, images_dir))
    app = FastAPI(title="Jewellery Matching Prototype", version="1.0.0")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
        allow_methods=["GET", "POST"],
        allow_headers=["*"],
    )
    
    @app.get("/")
    def home():
        return {"status": "API running!"}

    @app.get("/health")
    def health() -> dict[str, object]:
        return {"status": "ok", "earring_count": len(recommender.earrings)}

    @app.post("/recommend")
    async def recommend(image: UploadFile = File(...), top_k: int = 5) -> dict[str, object]:
        if top_k < 1 or top_k > 15:
            raise HTTPException(status_code=400, detail="top_k must be between 1 and 15")
        try:
            query_image = Image.open(io.BytesIO(await image.read()))
            query_image.load()
        except (UnidentifiedImageError, OSError) as error:
            raise HTTPException(status_code=400, detail="image must be a valid image file") from error
        return {"recommendations": recommender.recommend(query_image, top_k)}

    return app
