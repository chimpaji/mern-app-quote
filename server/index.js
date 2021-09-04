const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User.model");

const PORT = 3001;

app.use(express.json());
app.use(cors());

try {
  mongoose.connect(process.env.CONNECT_STRING);
  console.log("connected to MongoDB");
} catch (error) {
  console.error(error);
}

app.get("/", function (req, res) {
  res.end("Hello World");
});

//Post request for register new user
app.post("/api/register", async function (req, res) {
  try {
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    res.json({ status: "ok", msg: "create new user successfully" });
  } catch (error) {
    console.error(error);
    res.json({ status: "error", msg: error });
  }
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
