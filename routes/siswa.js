const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET semua siswa
router.get("/", (req, res) => {
  db.query("SELECT * FROM siswa", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// POST tambah siswa
router.post("/", (req, res) => {
  const { nis, nama, kelas, rfid_tag } = req.body;
  db.query(
    "INSERT INTO siswa (nis, nama, kelas, rfid_tag) VALUES (?, ?, ?, ?)",
    [nis, nama, kelas, rfid_tag],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Siswa ditambahkan", id: result.insertId });
    }
  );
});

module.exports = router;
