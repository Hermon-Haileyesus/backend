const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",

  user: "Hermon",
  password: "IloveJesus",
  database: "project",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// ----------------------
// GET all shipments
// ----------------------
app.get("/shipments", (req, res) => {
  db.query("SELECT * FROM shipments", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// ----------------------
// MARK shipment as sent
// ----------------------
app.put("/shipments/:id/send", (req, res) => {
  const { id } = req.params;

  const sql = "UPDATE shipments SET sent = 1 WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    res.json({ message: "Shipment marked as sent" });
  });
});

// ----------------------
// ADD new shipment
// ----------------------
app.post("/shipments", (req, res) => {
  const { sender, recipient, weight_kg, length_cm, width_cm, height_cm } =
    req.body;

  if (
    !sender ||
    !recipient ||
    !weight_kg ||
    !length_cm ||
    !width_cm ||
    !height_cm
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO shipments 
    (sender, recipient, weight_kg, length_cm, width_cm, height_cm)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [sender, recipient, weight_kg, length_cm, width_cm, height_cm],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      res.json({ id: result.insertId, message: "Shipment added successfully" });
    },
  );
});

// ----------------------
// Start server
// ----------------------
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  //console.log("Server running on port " + PORT); to deploy
  console.log("Server running on http://localhost:8080");
});
