const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// --- Storage ---
let latest = null;
let history = [];

// --- Receive updates from cTrader indicator ---
app.post("/update", (req, res) => {
    try {
        latest = req.body;
        history.push({
            ...req.body,
            serverTime: new Date().toISOString()
        });

        // Keep history from growing too large
        if (history.length > 5000) {
            history.shift();
        }

        res.json({ status: "ok" });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ error: "server error" });
    }
});

// --- Return latest update ---
app.get("/latest", (req, res) => {
    res.json(latest || {});
});

// --- Return full history ---
app.get("/history", (req, res) => {
    res.json(history);
});

// --- Serve dashboard HTML ---
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
