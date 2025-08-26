const express = require("express");
const db = require("../database/db.js"); // koneksi database

const router = express.Router();

// === Ambil semua mapel ===
router.get("/mapel", (req, res) => {
  db.query("SELECT * FROM mapel", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// === Hapus mapel by nama ===
router.delete("/mapel/:nama", (req, res) => {
  const { nama } = req.params;
  const sql = "DELETE FROM mapel WHERE nama_mapel = ?";

  db.query(sql, [nama], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Mapel tidak ditemukan" });
    }
    res.json({ message: `Mapel '${nama}' berhasil dihapus` });
  });
});

module.exports = router;
