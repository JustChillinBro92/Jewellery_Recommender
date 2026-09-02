import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const necklaces = [
  { id: "N01", file: "Nck_1.jpg", name: "Multi-Layered Gold & Emerald Necklace" },
  { id: "N02", file: "Nck_2.jpg", name: "Heritage Gold Statement Necklace" },
  { id: "N03", file: "Nck_3.jpg", name: "Sculptural Rose Choker" },
  { id: "N04", file: "Nck_4.jpg", name: "Temple Gold Collar" },
  { id: "N05", file: "Nck_5.jpg", name: "Emerald Heirloom Pendant" },
];

// Vite serves files in public/ from the site root in both dev and production.
const inventoryImage = (file) => `/inventory/${encodeURIComponent(file)}`;

function Header({ onCollection }) {
  return (
    <header className="site-header">
      <nav className="nav-links">
        <button onClick={onCollection}>Collection</button>
        <button className="active">Virtual Stylist</button>
      </nav>
      <div className="brand">
        <strong>Aurelian</strong>
        <span>Fine Jewelry</span>
      </div>
      <div className="nav-links nav-right">
        <button>The Vault</button>
        <button>Our Story</button>
        <span className="profile">●</span>
      </div>
    </header>
  );
}

function SelectionScreen({ selected, onSelect, onContinue }) {
  return (
    <main className="dark-page">
      <section className="hero">
        <p className="eyebrow">Virtual Stylist · Phase I</p>
        <h1>Select Your Foundation</h1>
        <p className="hero-copy">
          Choose an anchor piece to begin your curated styling journey. Our stylists will build a bespoke look around this central narrative.
        </p>
      </section>
      <div className="catalog">
        <div className="catalog-toolbar">
          <div className="filters">
            <button className="selected-filter">All Collections</button>
            <button>Heritage</button>
            <button>Modernist</button>
            <button>High Jewelry</button>
          </div>
          <span className="filter-label">☷ &nbsp; FILTER</span>
        </div>
        <div className="necklace-grid">
          {necklaces.map((necklace) => (
            <article
              className={`necklace-card ${selected?.id === necklace.id ? "is-selected" : ""}`}
              key={necklace.id}
              onClick={() => onSelect(necklace)}
            >
              <div className="image-wrap">
                <img src={inventoryImage(necklace.file)} alt={necklace.name} />
                <span className="select-overlay">{selected?.id === necklace.id ? "Selected" : "Select Anchor"}</span>
              </div>
              <p className="card-label">AURELIAN COLLECTION · {necklace.id}</p>
              <h2>{necklace.name}</h2>
            </article>
          ))}
        </div>
        <button className="gold-button continue-button" disabled={!selected} onClick={onContinue}>
          Continue to Styling <span>→</span>
        </button>
      </div>
    </main>
  );
}

function StylistScreen({ necklace, onBack }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getRecommendations() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(inventoryImage(necklace.file));
      const image = await response.blob();
      const form = new FormData();
      form.append("image", image, necklace.file);
      const result = await fetch("http://127.0.0.1:8000/recommend?top_k=5", { method: "POST", body: form });
      if (!result.ok) throw new Error("The stylist service could not be reached.");
      setRecommendations((await result.json()).recommendations);
    } catch (requestError) {
      setError(`${requestError.message} Start the Python API with "python -m jewellery_matcher" from backend.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="dark-page stylist-page">
      <section className="stylist-layout">
        <div className="foundation-column">
          <button className="back-button" onClick={onBack}>← Change foundation</button>
          <p className="eyebrow">The Foundation</p>
          <div className="foundation-image image-wrap"><img src={inventoryImage(necklace.file)} alt={necklace.name} /></div>
          <p className="card-label">SELECTED ANCHOR · {necklace.id}</p>
          <h1>{necklace.name}</h1>
          <p className="description">A masterpiece of traditional craftsmanship. This heirloom piece serves as the majestic foundation for your curated look.</p>
        </div>
        <div className="recommendation-column">
          <p className="eyebrow">The Aurelian Edit</p>
          <h2>Curated Companions</h2>
          <p className="hero-copy">Pieces selected to echo the colour, texture, and visual language of your foundation.</p>
          <button className="gold-button" onClick={getRecommendations} disabled={loading}>
            {loading ? "Styling your look…" : "Reveal matching earrings"} <span>→</span>
          </button>
          {error && <p className="error-message">{error}</p>}
          <div className="earring-grid">
            {recommendations.map((item) => (
              <article className="earring-card" key={item.id}>
                <img src={inventoryImage(item.image_file)} alt={`Recommended earrings ${item.id}`} />
                <div><p className="card-label">MATCH {Math.round(item.similarity * 100)}%</p><h3>{item.id}</h3></div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function App() {
  const [selected, setSelected] = useState(null);
  const [screen, setScreen] = useState("selection");
  return (
    <>
      <Header onCollection={() => setScreen("selection")} />
      {screen === "selection" ? (
        <SelectionScreen selected={selected} onSelect={setSelected} onContinue={() => setScreen("stylist")} />
      ) : (
        <StylistScreen necklace={selected} onBack={() => setScreen("selection")} />
      )}
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
