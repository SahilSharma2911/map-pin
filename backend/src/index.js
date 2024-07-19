const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const pinRoute = require("./routes/pins");
const userRoute = require("./routes/users");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/pins", pinRoute);
app.use("/api/users", userRoute);

app.get("/api/test", (req, res) => {
  res.json({ message: "hello" });
});

const PORT = process.env.PORT || 8802;
app.listen(PORT, () => {
  console.log(`Backend server is ready on port ${PORT}`);
});
