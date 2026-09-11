import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import moviesRouter from "./routes/movies.js";
import aiRouter from "./routes/ai.js";
import groupRouter from "./routes/group.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Request logger for easy debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "CineMatch API",
    tmdb_configured: Boolean(process.env.TMDB_API_KEY && process.env.TMDB_API_KEY.trim() !== ""),
    gemini_configured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== ""),
    timestamp: new Date().toISOString()
  });
});

// Mount modular routes
app.use("/api/movies", moviesRouter);
app.use("/api/ai", aiRouter);
app.use("/api/recommendations/group", groupRouter);

// 404 handler for unknown API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "An unexpected error occurred."
  });
});

app.listen(PORT, () => {
  console.log(`🎬 CineMatch Backend Server listening on http://localhost:${PORT}`);
  console.log(`📡 TMDB Status: ${process.env.TMDB_API_KEY ? "Live API Key Detected" : "Mock Data Fallback Mode"}`);
});
