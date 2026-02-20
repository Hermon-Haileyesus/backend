const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
app.use(bodyParser.json());

// PostgreSQL connection (Supabase)
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ----------------------
// GET all shipments
// ----------------------
app.get("/shipments", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM shipments ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// MARK shipment as sent
// ----------------------
app.put("/shipments/:id/send", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("UPDATE shipments SET sent = TRUE WHERE id = $1", [id]);
    res.json({ message: "Shipment marked as sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// ADD new shipment
// ----------------------
app.post("/shipments", async (req, res) => {
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
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
  `;

  try {
    const result = await db.query(sql, [
      sender,
      recipient,
      weight_kg,
      length_cm,
      width_cm,
      height_cm,
    ]);

    res.json({
      id: result.rows[0].id,
      message: "Shipment added successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// Start server
// ----------------------
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server running on http://localhost:8080");
});
