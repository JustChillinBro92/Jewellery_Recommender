"""Inventory-backed visual recommendation engine."""

from __future__ import annotations

import json

from pathlib import Path
from typing import Iterable

import numpy as np
from PIL import Image

from .features import image_descriptor
from .inventory import Product


def _open_descriptor(path: Path) -> np.ndarray:
    with Image.open(path) as image:
        return image_descriptor(image)


class Recommender:
    def __init__(self, products: Iterable[Product]):
        self.products = list(products)
        self.earrings = [p for p in self.products if p.product_type.lower() == "earrings"]
        if not self.earrings:
            raise ValueError("The inventory contains no earrings")
        self.earring_descriptors = np.vstack([_open_descriptor(p.image_path) for p in self.earrings])

    def recommend(self, image: Image.Image, top_k: int = 5) -> list[dict[str, object]]:
        if top_k < 1:
            raise ValueError("top_k must be at least 1")
        query = image_descriptor(image)
        distances = 1.0 - self.earring_descriptors @ query
        ranking = np.argsort(distances)[: min(top_k, len(self.earrings))]
        return [
            {
                "id": self.earrings[index].product_id,
                "image_file": self.earrings[index].image_file,
                "image_path": str(self.earrings[index].image_path),
                "similarity": round(float(1.0 - distances[index]), 4),
            }
            for index in ranking
        ]
