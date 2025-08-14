const express = require("express");
const cors = require("cors");

const siswaRoute = require("./routes/siswa");
const barangRoute = require("./routes/barang");
const peminjamanRoute = require("./routes/peminjaman");
const rfidRoute = require("./routes/rfid");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/siswa", siswaRoute);
app.use("/barang", barangRoute);
app.use("/peminjaman", peminjamanRoute);
app.use("/rfid", rfidRoute);

app.get("/", (req, res) => {
  res.send("Backend Peminjaman Barang API Ready 🚀");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
