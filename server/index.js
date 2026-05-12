import express from "express";
import { toNodeHandler } from "better-auth/node";
import { fileURLToPath } from "url";
import path from "path";
import { auth } from "./auth.js";
import courtsRouter from "./routes/courts.js";
import bookingsRouter from "./routes/bookings.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";

const app = express();

// Better Auth handler must be mounted before express.json()
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());
app.use("/api/courts", courtsRouter);
app.use("/api/bookings", bookingsRouter);

// Serve built React app in production
if (isProd) {
  const distPath = path.join(__dirname, "../dist");
  app.use(express.static(distPath));
  app.get("/{*any}", (req, res) => res.sendFile(path.join(distPath, "index.html")));
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
