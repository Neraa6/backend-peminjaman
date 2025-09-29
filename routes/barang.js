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
router.get("/barang/status", (req, res) => {
  const sql = `
    SELECT 
      b.id_barang,
      b.jenis,
      b.nomor,
      CASE 
        WHEN SUM(p.status = 'Dipinjam') > 0 THEN 'Dipinjam'
        ELSE 'Dikembalikan'
      END AS status
    FROM barang b
    LEFT JOIN peminjaman p ON p.id_barang = b.id_barang
    GROUP BY b.id_barang, b.jenis, b.nomor
    ORDER BY b.jenis, b.nomor
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).send("Gagal ambil data barang");
    }
    res.json(results);
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

router.post("/kembalikan", (req, res) => {
  const { rfid } = req.body;

  db.query(
    "SELECT * FROM peminjaman WHERE rfid_user = ? AND status = 'Dipinjam'",
    [rfid],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length === 0)
        return res.status(404).json({ message: "Tidak ada peminjaman aktif" });

      const idBarang = result[0].id_barang;
      const idPeminjaman = result[0].id;

      db.query(
        "UPDATE peminjaman SET status = 'Kembali', waktu_kembali = NOW() WHERE id = ?",
        [idPeminjaman],
        (err2) => {
          if (err2) return res.status(500).json({ message: err2.message });

          db.query(
            "UPDATE barang SET status = 'Tersedia' WHERE id_barang = ?",
            [idBarang],
            (err3) => {
              if (err3) return res.status(500).json({ message: err3.message });
              res.json({ message: "Barang berhasil dikembalikan" });
            }
          );
        }
      );
    }
  );
});
module.exports = router;
