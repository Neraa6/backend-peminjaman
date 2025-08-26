const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET semua siswa
router.get("/siswa", (req, res) => {
  db.query("SELECT * FROM siswa", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

router.get("/siswa/rfid/:uid", (req, res) => {
  const uid = req.params.uid;
  const sql = "SELECT nis, nama FROM siswa WHERE uid_rfid = ?";
  db.query(sql, [uid], (err, result) => {
    if (err) return res.status(500).send("DB Error");
    if (result.length === 0) return res.status(404).send("Siswa tidak ditemukan");
    res.json(result[0]); // balikin { nis, nama }
  });
});


// POST tambah siswa
router.post("/siswa/add", (req, res) => {
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


// Update RFID tag berdasarkan NIS
router.put("/siswa/rfid/:nis", (req, res) => {
  const { nis } = req.params;
  const { rfid_tag } = req.body;

  db.query(
    "UPDATE siswa SET rfid_tag = ? WHERE nis = ?",
    [rfid_tag, nis],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Siswa tidak ditemukan" });
      }

      // Ambil data siswa setelah update biar kelihatan
      db.query("SELECT * FROM siswa WHERE nis = ?", [nis], (err2, rows) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({
          message: "RFID tag berhasil diperbarui",
          data: rows[0]   // tampilkan data siswa yg sudah diupdate
        });
      });
    }
  );
});

// === DELETE siswa ===
router.delete("/siswa/delete/:nis", (req, res) => {
  const { nis } = req.params;
  db.query("DELETE FROM siswa WHERE nis = ?", [nis], (err, result) => {
    if (err) return res.status(500).send("Gagal hapus siswa");
    res.json({ message: "Siswa dihapus", nis });
  });
});




module.exports = router;
