const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Scan RFID → cari data siswa
router.get("/:tag", (req, res) => {
  const { tag } = req.params;
  db.query("SELECT * FROM siswa WHERE rfid_tag = ?", [tag], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: "RFID tidak terdaftar" });
    res.json(result[0]);
  });
});

module.exports = router;
