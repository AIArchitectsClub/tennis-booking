export default function CourtCard({ court, onSelect }) {
  return (
    <div className="court-card" onClick={() => onSelect(court)}>
      <div className="court-icon">{court.image}</div>
      <div className="court-info">
        <h3>{court.name}</h3>
        <div className="court-tags">
          <span className={`tag tag-surface-${court.surface.toLowerCase()}`}>
            {court.surface}
          </span>
          <span className={`tag ${court.indoor ? "tag-indoor" : "tag-outdoor"}`}>
            {court.indoor ? "Indoor" : "Outdoor"}
          </span>
        </div>
        <p className="court-desc">{court.description}</p>
      </div>
      <div className="court-price">
        <span className="price">${court.pricePerHour}</span>
        <span className="per-hour">/hr</span>
        <button className="btn-book">Book</button>
      </div>
    </div>
  );
}
