"""Lightweight image feature extraction."""

from __future__ import annotations

import numpy as np
from PIL import Image, ImageFilter


def _histogram(values: np.ndarray, bins: int, value_range: tuple[float, float]) -> np.ndarray:
    histogram, _ = np.histogram(values, bins=bins, range=value_range)
    histogram = histogram.astype(np.float32)
    return histogram / max(float(histogram.sum()), 1.0)


def image_descriptor(image: Image.Image) -> np.ndarray:
    """Create a compact descriptor from colour, luminance, texture, and layout."""
    rgb = image.convert("RGB").resize((96, 96), Image.Resampling.BILINEAR)
    rgb_array = np.asarray(rgb, dtype=np.float32) / 255.0
    hsv_array = np.asarray(rgb.convert("HSV"), dtype=np.float32) / 255.0
    descriptor = [
        _histogram(hsv_array[:, :, 0], 18, (0.0, 1.0)),
        _histogram(hsv_array[:, :, 1], 12, (0.0, 1.0)),
        _histogram(hsv_array[:, :, 2], 12, (0.0, 1.0)),
        rgb_array.mean(axis=(0, 1)),
        rgb_array.std(axis=(0, 1)),
        rgb_array.reshape(4, 24, 4, 24, 3).mean(axis=(1, 3)).ravel(),
    ]
    edges = np.asarray(rgb.convert("L").filter(ImageFilter.FIND_EDGES), dtype=np.float32) / 255.0
    descriptor.extend(
        [
            np.array([edges.mean(), edges.std()], dtype=np.float32),
            _histogram(edges, 8, (0.0, 1.0)),
        ]
    )
    result = np.concatenate(descriptor).astype(np.float32)
    norm = np.linalg.norm(result)
    return result / norm if norm else result
