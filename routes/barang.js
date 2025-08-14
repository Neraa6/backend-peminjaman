const express = require("express");
const router = express.Router();
const db = require("../database/db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM barang", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

router.post("/", (req, res) => {
  const { kode_barang, nama_barang, kategori } = req.body;
  db.query(
    "INSERT INTO barang (kode_barang, nama_barang, kategori) VALUES (?, ?, ?)",
    [kode_barang, nama_barang, kategori],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Barang ditambahkan", id: result.insertId });
    }
  );
});

module.exports = router;
