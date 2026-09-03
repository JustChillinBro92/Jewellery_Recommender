export default function Header({ onCollection, activeSection }) {
  return (
    <header className="site-header">
      <nav className="nav-links">
        <button
          className={activeSection === "collection" ? "active" : ""}
          onClick={onCollection}
        >
          Collection
        </button>
        <button className={activeSection === "stylist" ? "active" : ""}>
          Virtual Stylist
        </button>
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
