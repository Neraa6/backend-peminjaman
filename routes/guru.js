// routes/guru.js
const express = require("express");
const db = require("../database/db.js");

const router = express.Router();

// GET semua guru
router.get("/guru", (req, res) => {
  const sql = "SELECT * FROM guru";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("SQL Error (GET guru):", err);
      return res.status(500).send("Gagal ambil data guru");
    }
    res.json(results);
  });
});

// GET guru by id_guru
router.get("/guru/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM guru WHERE id_guru = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("SQL Error (GET guru by ID):", err);
      return res.status(500).send("Gagal ambil data guru");
    }
    res.json(result[0]);
  });
});

// POST tambah guru
router.post("/guru/add", (req, res) => {
  const { id_guru, nis, nama_guru, mapel } = req.body;
  const sql = `
    INSERT INTO guru (id_guru, nis, nama_guru, mapel)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [id_guru, nis, nama_guru, mapel], (err, result) => {
    if (err) {
      console.error("SQL Error (INSERT guru):", err);
      return res.status(500).send("Gagal tambah guru");
    }
    res.json({ message: "Guru ditambahkan", id: result.insertId, ...req.body });
  });
});

// PUT update guru
router.put("/guru/update/:id", (req, res) => {
  const { id } = req.params;
  const { nis, nama_guru, mapel } = req.body;

  const sql = `
    UPDATE guru SET nis = ?, nama_guru = ?, mapel = ?
    WHERE id_guru = ?
  `;
  db.query(sql, [nis, nama_guru, mapel, id], (err, result) => {
    if (err) {
      console.error("SQL Error (UPDATE guru):", err);
      return res.status(500).send("Gagal update guru");
    }
    res.json({ message: "Guru diupdate", id, ...req.body });
  });
});

// DELETE guru
router.delete("/guru/delete/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM guru WHERE id_guru = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("SQL Error (DELETE guru):", err);
      return res.status(500).send("Gagal hapus guru");
    }
    res.json({ message: "Guru dihapus", id });
  });
});

module.exports = router;
