"""Inventory loading and product models."""

from __future__ import annotations

import csv
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Product:
    product_id: str
    product_type: str
    image_file: str
    image_path: Path


def load_inventory(csv_path: Path, images_dir: Path) -> list[Product]:
    """Load products and reject CSV rows that point outside the image folder."""
    products: list[Product] = []
    resolved_images_dir = images_dir.resolve()
    with csv_path.open(newline="", encoding="utf-8-sig") as handle:
        for row in csv.DictReader(handle):
            required = {"id", "product_type", "image_file"}
            if not required.issubset(row):
                raise ValueError("CSV must contain id, product_type, and image_file columns")
            image_path = (images_dir / row["image_file"]).resolve()
            if resolved_images_dir not in image_path.parents:
                raise ValueError(f"Image path escapes inventory folder: {row['image_file']}")
            if not image_path.is_file():
                raise FileNotFoundError(f"Inventory image does not exist: {image_path}")
            products.append(Product(row["id"], row["product_type"], row["image_file"], image_path))
    if not products:
        raise ValueError("The inventory CSV is empty")
    return products
