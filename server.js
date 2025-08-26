const express = require("express");
const cors = require("cors");

const siswaRoute = require("./routes/siswa");
const barangRoute = require("./routes/barang");
const peminjamanRoute = require("./routes/peminjaman");
const rfidRoute = require("./routes/rfid");
const guruRoute = require("./routes/guru");
const mapelRoute = require("./routes/mapel.js");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use("/api", siswaRoute);
app.use("/api", barangRoute);
app.use("/api", peminjamanRoute);
app.use("/api", rfidRoute);
app.use("/api", guruRoute);
app.use("/api", mapelRoute);


app.get("/", (req, res) => {
  res.send("Backend Peminjaman Barang API Ready 🚀");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
