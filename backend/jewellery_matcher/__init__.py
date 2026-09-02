"""Jewellery visual matching package."""

from .api import create_app
from .recommender import Recommender

__all__ = ["Recommender", "create_app"]
