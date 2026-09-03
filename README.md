# Jewellery matching prototype

## Project layout

```text
data/
  candidate_dataset.csv
  jewelry_images/
jewellery_matcher/
  api.py          # FastAPI routes
  features.py     # image descriptors
  inventory.py    # CSV and image validation
  recommender.py  # ranking engine
  __main__.py     # CLI entry point
app.py             # backwards-compatible launcher
```

This prototype ranks the provided inventory earrings for an uploaded necklace
image. It uses a deterministic Pillow/NumPy descriptor (HSV colour histograms,
colour moments, spatial pooling, and edge texture).

## Run

From the repository root (the CSV and image inventory are included under `data/`):

```powershell
cd backend
python -m jewellery_matcher
```

You can override the defaults when using another inventory:

```powershell
python -m jewellery_matcher --csv "C:\path\candidate_dataset.csv" --images "C:\path\Jewelry Images"
```

`python backend\app.py` remains supported as a compatibility launcher.

## Frontend

The frontend source is organized by responsibility:

```text
frontend/
  public/inventory/       # browser-served product images
  src/
    components/           # reusable UI and screen components
    data/                 # necklace catalog data
    lib/                  # asset/path helpers
    styles/               # global stylesheet
    App.jsx               # screen-level state and routing
    main.jsx              # Vite entry point
```

```powershell
cd frontend
npm install
npm run dev
```

The frontend uses the local inventory images in `frontend/public/inventory`
and calls the backend at `http://127.0.0.1:8000/recommend`.

## Request

```powershell
curl.exe -X POST "http://127.0.0.1:8000/recommend?top_k=5" `
  -F "image=@data\Jewelry Images\Nck_1.jpg"
```

The JSON response contains the inventory `id`, `image_file`, absolute
`image_path`, and a cosine `similarity` score for each recommendation. The
`/health` endpoint reports the number of indexed earrings.
