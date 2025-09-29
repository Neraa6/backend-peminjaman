const express = require("express");
const db = require("../database/db.js");
const router = express.Router();

// === GET semua peminjaman ===
router.get("/peminjaman", (req, res) => {
  const sql = `
    SELECT 
      p.id, 
      p.nis, 
      s.nama AS nama_siswa,  
      s.kelas,
      b.jenis AS nama_barang, 
      g.nama_guru, 
      p.mapel AS nama_mapel,  
      p.waktu_pinjam,
      p.waktu_kembali, 
      p.keterangan, 
      p.status
    FROM peminjaman p
    LEFT JOIN siswa s ON p.nis = s.nis
    LEFT JOIN barang b ON p.id_barang = b.id_barang
    LEFT JOIN guru g ON p.id_guru = g.id_guru
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
  const { nis, id_barang, id_guru, mapel, keterangan } = req.body;
  console.log("Data diterima frontend:", req.body);

  const checkSql = `
    SELECT 1 
    FROM peminjaman 
    WHERE id_barang = ? AND status = 'Dipinjam'
    LIMIT 1
  `;
  db.query(checkSql, [id_barang], (err, rows) => {
    if (err) {
      console.error("SQL Error (CHECK barang):", err);
      return res.status(500).send("Gagal cek status barang");
    }
    if (rows.length > 0) {
      return res.status(400).json({ message: "Barang ini sedang Dipinjam" });
    }

    // Insert tanpa waktu_pinjam, biar DB otomatis isi CURRENT_TIMESTAMP
    const insertSql = `
      INSERT INTO peminjaman (nis, id_barang, id_guru, mapel, keterangan, status)
      VALUES (?, ?, ?, ?, ?, 'Dipinjam')
    `;
    db.query(insertSql, [nis, id_barang, id_guru, mapel, keterangan], (err, result) => {
      if (err) {
        console.error("SQL Error (INSERT peminjaman):", err);
        return res.status(500).send("Gagal tambah peminjaman");
      }
      res.json({ id: result.insertId, message: "Peminjaman berhasil" });
    });
  });
});

// === POST peminjaman/kontrol-rfid ===
router.post("/peminjaman/kontrol-rfid", (req, res) => {
  const { rfid_uid, id_barang, id_guru, mapel, keterangan } = req.body;

  // Cari NIS berdasarkan UID
  const sqlSiswa = `SELECT nis FROM siswa WHERE rfid_uid = ? LIMIT 1`;
  db.query(sqlSiswa, [rfid_uid], (err, siswaRows) => {
    if (err) return res.status(500).json({ error: "Gagal cek siswa" });
    if (siswaRows.length === 0) return res.status(404).json({ message: "Kartu tidak terdaftar" });

    const nis = siswaRows[0].nis;

    // Cek apakah siswa ini punya peminjaman aktif
    const sqlCheck = `
      SELECT id, id_barang FROM peminjaman 
      WHERE nis = ? AND status = 'Dipinjam'
      ORDER BY waktu_pinjam DESC LIMIT 1
    `;
    db.query(sqlCheck, [nis], (err, activeRows) => {
      if (err) return res.status(500).json({ error: "Gagal cek peminjaman" });

      if (activeRows.length > 0) {
        // === Ada peminjaman aktif → update jadi Dikembalikan ===
        const sqlUpdate = `
          UPDATE peminjaman
          SET status = 'Dikembalikan', waktu_kembali = NOW()
          WHERE id = ?
        `;
        db.query(sqlUpdate, [activeRows[0].id], (err) => {
          if (err) return res.status(500).json({ error: "Gagal update pengembalian" });
          return res.json({ message: "Barang berhasil dikembalikan via RFID" });
        });
      } else {
        // === Tidak ada peminjaman aktif → buat peminjaman baru ===
        const sqlInsert = `
          INSERT INTO peminjaman (nis, id_barang, id_guru, mapel, keterangan, status)
          VALUES (?, ?, ?, ?, ?, 'Dipinjam')
        `;
        db.query(sqlInsert, [nis, id_barang, id_guru, mapel, keterangan], (err, result) => {
          if (err) return res.status(500).json({ error: "Gagal tambah peminjaman" });
          return res.json({ id: result.insertId, message: "Barang berhasil dipinjam via RFID" });
        });
      }
    });
  });
});


// === DELETE peminjaman ===
router.delete("/peminjaman/delete/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM peminjaman WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("SQL Error (DELETE peminjaman):", err);
      return res.status(500).send("Gagal hapus peminjaman");
    }
    res.json({ message: "Peminjaman dihapus", id });
  });
});

module.exports = router;
