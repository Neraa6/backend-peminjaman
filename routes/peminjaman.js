const express = require("express");
const router = express.Router();
const db = require("../database/db"); // ini koneksi MySQL dari db.js

// GET semua peminjaman
router.get("/", (req, res) => {
  const sql = `
SELECT 
  s.nis,
  s.nama,
  s.kelas,
  CONCAT(b.jenis, '-', b.nomor) AS barang,
  g.nama_guru AS guru_pj,
  p.status
FROM peminjaman p
JOIN siswa s ON p.nis = s.nis
JOIN barang b ON p.id_barang = b.id_barang
JOIN guru g ON p.id_guru = g.id_guru;




  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Gagal ambil data peminjaman");
    }
    res.json(results);
  });
});

// POST tambah peminjaman
router.post("/", (req, res) => {
  const { siswa_id, barang_id, guru_id, waktu_pinjam, waktu_kembali, status } = req.body;
  const sql = `
    INSERT INTO peminjaman (siswa_id, barang_id, guru_id, waktu_pinjam, waktu_kembali, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [siswa_id, barang_id, guru_id, waktu_pinjam, waktu_kembali, status], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Gagal tambah peminjaman");
    }
    res.json({ id: result.insertId, ...req.body });
  });
});

// PUT update peminjaman
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { siswa_id, barang_id, guru_id, waktu_pinjam, waktu_kembali, status } = req.body;
  const sql = `
    UPDATE peminjaman 
    SET siswa_id=?, barang_id=?, guru_id=?, waktu_pinjam=?, waktu_kembali=?, status=? 
    WHERE id=?
  `;
  db.query(sql, [siswa_id, barang_id, guru_id, waktu_pinjam, waktu_kembali, status, id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Gagal update peminjaman");
    }
    res.send("Data peminjaman berhasil diupdate");
  });
});

// DELETE hapus peminjaman
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM peminjaman WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Gagal hapus peminjaman");
    }
    res.send("Data peminjaman berhasil dihapus");
  });
});

module.exports = router;
