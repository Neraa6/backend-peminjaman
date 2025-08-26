// routes/peminjaman.js
const express = require("express");
const db = require("../database/db.js");
const router = express.Router();


// === GET semua peminjaman + relasi siswa, barang, guru ===
router.get("/peminjaman", (req, res) => {
  const sql = `
        SELECT 
      p.id, 
      s.nis, 
      s.nama AS nama_siswa, 
      s.kelas,
      b.jenis AS nama_barang, 
      g.nama_guru, 
      m.nama_mapel,   -- ambil nama mapel dari tabel mapel
      p.waktu_pinjam, 
      p.waktu_kembali, 
      p.keterangan, 
      p.status
    FROM peminjaman p
    JOIN siswa s ON p.nis = s.nis
    JOIN barang b ON p.id_barang = b.id_barang
    JOIN guru g ON p.id_guru = g.id_guru
    JOIN mapel m ON p.mapel = m.id; -- join ke tabel mapel
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("SQL Error (GET peminjaman):", err);
      return res.status(500).send("Gagal ambil data peminjaman");
    }
    res.json(results);
  });
});


// === POST tambah peminjaman ===
router.post("/peminjaman/add", (req, res) => {
  const { nis, id_barang, id_guru, waktu_pinjam, waktu_kembali, mapel, keterangan, status } = req.body;
  console.log("Data diterima frontend:", req.body); // debug

  const sql = `
    INSERT INTO peminjaman (nis, id_barang, id_guru, waktu_pinjam, waktu_kembali, mapel, keterangan, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql, 
    [nis, id_barang, id_guru, waktu_pinjam, waktu_kembali, mapel, keterangan, status || "Dipinjam"], 
    (err, result) => {
      if (err) {
        console.error("SQL Error (INSERT peminjaman):", err);
        return res.status(500).send("Gagal tambah peminjaman");
      }
      res.json({ id: result.insertId, ...req.body });
    }
  );
});


// === PUT update peminjaman (status / mapel / keterangan) ===
router.put("/peminjaman/update/:id", (req, res) => {
  const { status, waktu_kembali, mapel, keterangan } = req.body;
  const { id } = req.params;

  const sql = `
    UPDATE peminjaman 
    SET status = ?, waktu_kembali = ?, mapel = ?, keterangan = ?
    WHERE id = ?
  `;
  db.query(sql, [status, waktu_kembali, mapel, keterangan, id], (err, result) => {
    if (err) {
      console.error("SQL Error (UPDATE peminjaman):", err);
      return res.status(500).send("Gagal update peminjaman");
    }
    res.json({ message: "Peminjaman diupdate", id, ...req.body });
  });
});


// === DELETE peminjaman ===
router.delete("/peminjaman/delete/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM peminjaman WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("SQL Error (DELETE peminjaman):", err);
      return res.status(500).send("Gagal hapus peminjaman");
    }
    res.json({ message: "Peminjaman dihapus", id });
  });
});


module.exports = router;
