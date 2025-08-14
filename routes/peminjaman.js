const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET semua peminjaman
router.get("/", (req, res) => {
  db.query("SELECT * FROM peminjaman", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// POST peminjaman baru
router.post("/", (req, res) => {
  const { nis, id_barang, tujuan, mapel, waktu_pinjam, waktu_kembali, status } = req.body;
  db.query(
    "INSERT INTO peminjaman (nis, id_barang, tujuan, mapel, waktu_pinjam, waktu_kembali, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [nis, id_barang, tujuan, mapel, waktu_pinjam, waktu_kembali, status],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Peminjaman berhasil ditambahkan", id: result.insertId });
    }
  );
});

// PUT update peminjaman
router.put("/:id", (req, res) => {
  const { nis, id_barang, tujuan, mapel, waktu_pinjam, waktu_kembali, status } = req.body;
  db.query(
    "UPDATE peminjaman SET nis=?, id_barang=?, tujuan=?, mapel=?, waktu_pinjam=?, waktu_kembali=?, status=? WHERE id_pinjam=?",
    [nis, id_barang, tujuan, mapel, waktu_pinjam, waktu_kembali, status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Peminjaman berhasil diupdate" });
    }
  );
});

module.exports = router;
