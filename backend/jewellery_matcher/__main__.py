"""Command-line entry point for the recommendation API."""

from __future__ import annotations

import argparse
import os
from pathlib import Path

import uvicorn

from .api import create_app


def main() -> None:
    project_root = Path(__file__).resolve().parents[2]
    parser = argparse.ArgumentParser(description="Run the jewellery visual matching API")
    parser.add_argument("--csv", type=Path, default=Path(os.getenv("JEWELLERY_CSV", project_root / "data/candidate_dataset.csv")))
    parser.add_argument("--images", type=Path, default=Path(os.getenv("JEWELLERY_IMAGES", project_root / "data/jewelry_images")))
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()
    uvicorn.run(create_app(args.csv, args.images), host=args.host, port=args.port)


if __name__ == "__main__":
    main()
