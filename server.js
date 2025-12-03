// server.js
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors()); // allow cross-origin requests (safe for this simple dashboard)

const MAX_HISTORY = 200;
let lastSignal = null;
let history = [];

/*
 Expected payload examples from your indicator:
 { type: "buy"|"sell"|"hitrate", price: 1.2345, score: 44.2, time: "...", hits: 3, completed: 5, hitrate: 60 }
*/

app.post("/update", (req, res) => {
  const payload = req.body || {};
  payload.receivedAt = new Date().toISOString();

  // Save lastSignal
  lastSignal = payload;

  // If it's a signal (buy/sell) or hitrate, keep in history
  if (payload.type === "buy" || payload.type === "sell" || payload.type === "hitrate") {
    history.unshift(payload); // newest first
    if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
  }

  console.log("Received update:", payload.type || "unknown", payload);
  res.json({ status: "ok" });
});

// Simple endpoints the UI uses
app.get("/latest", (req, res) => {
  res.json(lastSignal || {});
});

app.get("/history", (req, res) => {
  res.json(history);
});

// Serve static UI files from /public
app.use(express.static(path.join(__dirname, "public")));

// fallback to index.html for single page app navigation
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
