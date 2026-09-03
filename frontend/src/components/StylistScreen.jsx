import { useState } from "react";
import { inventoryImage } from "../lib/assets";

export default function StylistScreen({ necklace, onBack }) {
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationStart, setRecommendationStart] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const lastPairStart =
    recommendations.length % 2 === 1
      ? recommendations.length - 1
      : Math.max(0, recommendations.length - 2);

  async function getRecommendations() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(inventoryImage(necklace.file));
      const image = await response.blob();
      const form = new FormData();
      form.append("image", image, necklace.file);
      const result = await fetch("http://127.0.0.1:8000/recommend?top_k=5", {
        method: "POST",
        body: form,
      });
      if (!result.ok)
        throw new Error("The stylist service could not be reached.");
      setRecommendations((await result.json()).recommendations);
      setRecommendationStart(0);
    } catch (requestError) {
      setError(
        `${requestError.message} Start the Python API with "python -m jewellery_matcher" from backend.`,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="dark-page stylist-page">
      <section className="stylist-layout">
        <div className="foundation-column">
          <button className="back-button" onClick={onBack}>
            ← Change foundation
          </button>
          <p className="eyebrow">The Foundation</p>
          <div className="foundation-image image-wrap">
            <img src={inventoryImage(necklace.file)} alt={necklace.name} />
          </div>
          <p className="card-label">SELECTED ANCHOR · {necklace.id}</p>
          <h1>{necklace.name}</h1>
          <p className="description">
            A masterpiece of traditional craftsmanship. This heirloom piece
            serves as the majestic foundation for your curated look.
          </p>
        </div>
        <div className="recommendation-column">
          <p className="eyebrow">The Aurelian Edit</p>
          <h2>Curated Companions</h2>
          <p className="hero-copy">
            Pieces selected to echo the colour, texture, and visual language of
            your foundation.
          </p>
          <button
            className="gold-button"
            onClick={getRecommendations}
            disabled={loading}
          >
            {loading ? "Styling your look…" : "Reveal matching earrings"}{" "}
            <span>→</span>
          </button>
          {error && <p className="error-message">{error}</p>}
          {recommendations.length > 0 && (
            <div className="pairings">
              {recommendations
                .slice(recommendationStart, recommendationStart + 2)
                .map((item, visibleIndex) => (
                  <div key={item.id}>
                    <article
                      className={`pairing-row ${visibleIndex === 0 ? "primary-pairing" : "complementary-pairing"}`}
                    >
                      <div className="pairing-copy">
                        <p className="card-label">
                          {visibleIndex === 0
                            ? "PRIMARY"
                            : "COMPLEMENTARY"}{" "}
                          MATCH {Math.round(item.similarity * 100)}%
                        </p>
                        <h3>
                          {visibleIndex === 0
                            ? "Gold & Emerald Jhumkas"
                            : "Ornate Temple Earrings"}
                        </h3>
                        <div className="styling-logic">
                          <span>STYLING LOGIC</span>
                          <p>
                            Its ornate detailing and warm metal tones echo the
                            foundation, creating a cohesive heirloom look.
                          </p>
                        </div>
                        <button className="vault-button">Add to Vault</button>
                      </div>
                      <div className="pairing-image">
                        <img
                          src={inventoryImage(item.image_file)}
                          alt={`Recommended earrings ${item.id}`}
                        />
                      </div>
                    </article>
                    {visibleIndex === 0 && (
                      <div className="carousel-controls">
                        <button
                          className="carousel-arrow"
                          aria-label="Previous recommendations"
                          disabled={recommendationStart === 0}
                          onClick={() =>
                            setRecommendationStart((index) =>
                              Math.max(0, index - 2),
                            )
                          }
                        >
                          ‹
                        </button>
                        <span>Explore more</span>
                        <button
                          className="carousel-arrow"
                          aria-label="Next recommendations"
                          disabled={
                            recommendationStart + 2 >= recommendations.length
                          }
                          onClick={() =>
                            setRecommendationStart((index) =>
                              Math.min(lastPairStart, index + 2),
                            )
                          }
                        >
                          ›
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
