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

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/pins", pinRoute);
app.use("/api/users", userRoute);

// Serve static files from the Vite build
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.get('/api/test', (req, res) => {
  res.json({ message: "hello" });
});

// Catch all other routes and return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
});

const PORT = process.env.PORT || 8802;
app.listen(PORT, () => {
  console.log(`Backend server is ready on port ${PORT}`);
});
