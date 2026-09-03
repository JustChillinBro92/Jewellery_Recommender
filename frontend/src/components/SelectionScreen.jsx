import { necklaces } from "../data/necklaces";
import { inventoryImage } from "../lib/assets";

export default function SelectionScreen({ selected, onSelect, onContinue }) {
  return (
    <main className="dark-page">
      <section className="hero">
        <p className="eyebrow">Virtual Stylist</p>
        <h1>Select Your Foundation</h1>
        <p className="hero-copy">
          Choose an anchor piece to begin your curated styling journey. Our
          stylists will build a bespoke look around this central narrative.
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
          {necklaces.map((necklace) => {
            const isSelected = selected?.id === necklace.id;
            return (
              <article
                className={`necklace-card ${isSelected ? "is-selected" : ""}`}
                key={necklace.id}
                onClick={() => onSelect(necklace)}
              >
                <div className="image-wrap">
                  <img
                    src={inventoryImage(necklace.file)}
                    alt={necklace.name}
                  />
                  <div className="card-actions">
                    <button
                      className="select-overlay"
                      onClick={(event) => {
                        event.stopPropagation();
                        onSelect(necklace);
                      }}
                    >
                      {isSelected ? "Selected" : "Select Anchor"}
                    </button>
                    {isSelected && (
                      <button
                        className="continue-card-button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onContinue();
                        }}
                      >
                        Continue to Styling <span>→</span>
                      </button>
                    )}
                  </div>
                </div>
                <p className="card-label">
                  AURELIAN COLLECTION · {necklace.id}
                </p>
                <h2>{necklace.name}</h2>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
