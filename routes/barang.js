const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Ambil semua barang
router.get("/barang", (req, res) => {
  db.query("SELECT * FROM barang", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// Tambah barang
router.post("/barang/add", (req, res) => {
  const { jenis, nomor, lokasi } = req.body;
  db.query(
    "INSERT INTO barang (jenis, nomor, lokasi) VALUES (?, ?, ?)",
    [jenis, nomor, lokasi],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        message: "Barang berhasil ditambahkan",
        data: { id_barang: result.insertId, jenis, nomor, lokasi }
      });
    }
  );
});

module.exports = router;
