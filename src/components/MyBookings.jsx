export default function MyBookings({ bookings, onCancel }) {
  if (bookings.length === 0) {
    return (
      <div className="empty-state">
        <p>No bookings yet. Head over to Courts to book a slot!</p>
      </div>
    );
  }

  const sorted = [...bookings].sort((a, b) => {
    const da = new Date(`${a.date}T${a.time}`);
    const db = new Date(`${b.date}T${b.time}`);
    return da - db;
  });

  const now = new Date();

  return (
    <div className="bookings-list">
      {sorted.map((b) => {
        const bookingTime = new Date(`${b.date}T${b.time}`);
        const isPast = bookingTime < now;
        return (
          <div key={b.id} className={`booking-item ${isPast ? "past" : ""}`}>
            <div className="booking-icon">🎾</div>
            <div className="booking-details">
              <strong>{b.courtName}</strong>
              <span>{b.date} at {b.time}</span>
              <span>Player: {b.playerName}</span>
              <span className="booking-price">${b.price} due on arrival</span>
            </div>
            <div className="booking-actions">
              {isPast ? (
                <span className="badge-past">Past</span>
              ) : (
                <button
                  className="btn-cancel"
                  onClick={() => onCancel(b.id)}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
