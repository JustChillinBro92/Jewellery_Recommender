"""Backward-compatible launcher; prefer ``python -m jewellery_matcher``."""

from jewellery_matcher.__main__ import main


if __name__ == "__main__":
    main()
