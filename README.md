# Jewellery Recommender

A small full-stack prototype that recommends earrings from the supplied
inventory for a selected necklace image.

## How image matching works

The backend pre-indexes every inventory row whose `product_type` is
`Earrings`. For each image it builds a deterministic visual descriptor using:

- HSV hue, saturation, and brightness histograms
- RGB colour averages and variation
- Spatial colour pooling to retain broad layout information
- Edge statistics to capture texture and ornament detail

When a necklace image is submitted, the SAME descriptor is generated for the
query image. The recommender calculates cosine similarity between the query
descriptor and every indexed earring descriptor, sorts the results by
similarity, and returns the top `k` products. Results always come from
`data/candidate_dataset.csv`, and each referenced image is validated to exist
inside the inventory folder.


## Technologies and tools

- **Python 3.12+**: backend runtime
- **FastAPI**: `POST /recommend` and `GET /health` HTTP API
- **Pillow**: image loading, resizing, colour conversion, and edge extraction
- **NumPy**: histogram generation, vector normalization, and similarity ranking
- **React**: component-based frontend UI
- **Vite**: frontend development server and production bundler
- **CSS**: dark Aurelian-inspired styling and responsive layouts
- **curl**: optional command-line API testing

## Project structure

```text
data/
  candidate_dataset.csv
  jewelry_images/              # source inventory images
backend/
  requirements.txt
  app.py                       # compatibility launcher
  jewellery_matcher/
    api.py                     # FastAPI routes
    features.py                # visual descriptor extraction
    inventory.py               # CSV/image validation
    recommender.py             # similarity ranking
    __main__.py                # backend CLI entry point
frontend/
  public/inventory/             # browser-served inventory images
  src/
    components/                 # Header and screen components
    data/                       # necklace catalog data
    lib/                        # asset URL helpers
    styles/                     # global stylesheet
    App.jsx                     # screen state
    main.jsx                    # Vite entry point
```

## Run

Install backend dependencies and start the API:

```powershell
cd backend
python -m pip install -r requirements.txt
python -m jewellery_matcher
```

In a second terminal, install and start the frontend:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually
`http://localhost:5173`. The frontend calls the backend at
`http://127.0.0.1:8000`.

To test the API directly:

```powershell
curl.exe -X POST "http://127.0.0.1:8000/recommend?top_k=5" `
  -F "image=@data\jewelry_images\Nck_1.jpg"
```

Alternatively, open FastAPI’s interactive Swagger UI at
`http://127.0.0.1:8000/docs`. Expand `POST /recommend`, click **Try it out**,
choose a necklace image, optionally set `top_k`, and click **Execute** to view
the JSON recommendations.
