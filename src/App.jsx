import { useState } from "react";
import { useCourts } from "./hooks/useCourts";
import { useBookings } from "./hooks/useBookings";
import { authClient } from "./lib/auth-client";
import CourtCard from "./components/CourtCard";
import BookingModal from "./components/BookingModal";
import MyBookings from "./components/MyBookings";
import AuthModal from "./components/AuthModal";
import "./App.css";

export default function App() {
  const [tab, setTab] = useState("courts");
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [surfaceFilter, setSurfaceFilter] = useState("All");
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const isSignedIn = !!session?.user;

  const { courts, loading: courtsLoading } = useCourts();
  const { bookings, addBooking, cancelBooking } = useBookings(isSignedIn);

  async function handleSignOut() {
    await authClient.signOut();
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🎾</span>
            <span className="logo-text">CourtBook</span>
          </div>
          <nav className="nav">
            <button
              className={`nav-btn ${tab === "courts" ? "active" : ""}`}
              onClick={() => setTab("courts")}
            >
              Courts
            </button>
            <button
              className={`nav-btn ${tab === "bookings" ? "active" : ""}`}
              onClick={() => setTab("bookings")}
            >
              My Bookings
              {bookings.length > 0 && (
                <span className="badge">{bookings.length}</span>
              )}
            </button>
          </nav>
          <div className="header-auth">
            {!sessionLoading && (
              isSignedIn ? (
                <div className="user-info">
                  <span className="user-name">{session.user.name}</span>
                  <button className="btn-signout" onClick={handleSignOut}>Sign Out</button>
                </div>
              ) : (
                <button className="btn-signin" onClick={() => setShowAuthModal(true)}>Sign In</button>
              )
            )}
          </div>
        </div>
      </header>

      <main className="main">
        {tab === "courts" && (
          <div>
            <div className="page-header">
              <h1>Available Courts</h1>
              <p>Select a court to check availability and book your slot.</p>
            </div>
            {courtsLoading ? (
              <p className="loading">Loading courts…</p>
            ) : (
              <>
                <div className="filter-bar">
                  {["All", ...new Set(courts.map((c) => c.surface))].map((s) => (
                    <button
                      key={s}
                      className={`filter-btn ${surfaceFilter === s ? "active" : ""}`}
                      onClick={() => setSurfaceFilter(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="courts-grid">
                  {courts
                    .filter((c) => surfaceFilter === "All" || c.surface === surfaceFilter)
                    .map((court) => (
                      <CourtCard
                        key={court.id}
                        court={court}
                        isSignedIn={isSignedIn}
                        onSelect={(c) => {
                          if (!isSignedIn) { setShowAuthModal(true); return; }
                          setSelectedCourt(c);
                        }}
                      />
                    ))}
                </div>
              </>
            )}
          </div>
        )}

        {tab === "bookings" && (
          <div>
            <div className="page-header">
              <h1>My Bookings</h1>
              <p>Manage your upcoming court reservations.</p>
            </div>
            {!isSignedIn ? (
              <div className="empty-state">
                <p>
                  <button className="link-btn" onClick={() => setShowAuthModal(true)}>Sign in</button>
                  {" "}to view your bookings.
                </p>
              </div>
            ) : (
              <MyBookings bookings={bookings} onCancel={cancelBooking} />
            )}
          </div>
        )}
      </main>

      {selectedCourt && (
        <BookingModal
          court={selectedCourt}
          playerName={session?.user?.name}
          onConfirm={async (booking) => { await addBooking(booking); }}
          onClose={() => setSelectedCourt(null)}
        />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}
