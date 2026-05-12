import { useState } from "react";
import { authClient } from "../lib/auth-client";

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error: err } = await authClient.signIn.email({ email, password });
        if (err) throw new Error(err.message);
      } else {
        const { error: err } = await authClient.signUp.email({ name, email, password });
        if (err) throw new Error(err.message);
      }
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>{mode === "signin" ? "Sign In" : "Create Account"}</h2>
        <p className="modal-subtitle">
          {mode === "signin" ? "Welcome back!" : "Join to start booking courts."}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="form-group">
              <label>Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Smith"
                required
              />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "signin" ? (
            <>No account? <button className="link-btn" onClick={() => { setMode("signup"); setError(""); }}>Sign up</button></>
          ) : (
            <>Already have one? <button className="link-btn" onClick={() => { setMode("signin"); setError(""); }}>Sign in</button></>
          )}
        </p>
      </div>
    </div>
  );
}
