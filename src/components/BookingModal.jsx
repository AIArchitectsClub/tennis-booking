import { useState, useEffect } from "react";
import { timeSlots } from "../data/courts";

export default function BookingModal({ court, playerName, onConfirm, onClose }) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("");
  const [takenSlots, setTakenSlots] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/courts/${court.id}/availability?date=${date}`)
      .then((r) => r.json())
      .then(setTakenSlots);
  }, [court.id, date]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!time) return;
    await onConfirm({ courtId: court.id, courtName: court.name, date, time, price: court.pricePerHour });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-success">
            <div className="success-icon">✅</div>
            <h2>Booking Confirmed!</h2>
            <p><strong>{court.name}</strong></p>
            <p>{date} at {time}</p>
            <p>Player: {playerName}</p>
            <p className="price-confirm">${court.pricePerHour} due on arrival</p>
            <button className="btn-primary" onClick={onClose}>Done</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Book {court.name}</h2>
        <p className="modal-subtitle">{court.surface} · {court.indoor ? "Indoor" : "Outdoor"} · ${court.pricePerHour}/hr</p>
        <p className="booking-as">Booking as <strong>{playerName}</strong></p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => { setDate(e.target.value); setTime(""); }}
              required
            />
          </div>

          <div className="form-group">
            <label>Time slot (1 hour)</label>
            <div className="time-grid">
              {timeSlots.map((slot) => {
                const taken = takenSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    className={`time-slot ${taken ? "taken" : ""} ${time === slot ? "selected" : ""}`}
                    disabled={taken}
                    onClick={() => setTime(slot)}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={!time}>
            Confirm Booking — ${court.pricePerHour}
          </button>
        </form>
      </div>
    </div>
  );
}
