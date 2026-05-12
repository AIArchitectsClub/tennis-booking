import { useState, useEffect } from "react";

function normalise(b) {
  return {
    id: b.id,
    courtId: b.court_id,
    courtName: b.court_name,
    date: b.date?.split("T")[0] ?? b.date,
    time: b.time,
    playerName: b.player_name,
    price: b.price,
  };
}

export function useBookings(isSignedIn) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!isSignedIn) { setBookings([]); return; }
    fetch("/api/bookings", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setBookings(data.map(normalise)));
  }, [isSignedIn]);

  async function addBooking(booking) {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(booking),
    });
    if (!res.ok) throw new Error(await res.text());
    const created = normalise(await res.json());
    setBookings((prev) => [...prev, created]);
    return created;
  }

  async function cancelBooking(id) {
    await fetch(`/api/bookings/${id}`, { method: "DELETE", credentials: "include" });
    setBookings((prev) => prev.filter((b) => b.id !== id));
  }

  return { bookings, addBooking, cancelBooking };
}
