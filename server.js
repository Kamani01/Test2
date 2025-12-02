const express = require("express");
const app = express();

let lastValue = 0;

app.use(express.json());

app.post("/update", (req, res) => {
  lastValue = req.body.value;
  res.send("ok");
});

app.get("/value", (req, res) => {
  res.json({ value: lastValue });
});

app.listen(3000, () => console.log("Server running"));
