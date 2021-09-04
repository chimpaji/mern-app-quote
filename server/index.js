const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User.model");
const JWT = require("jsonwebtoken");
const { json } = require("express");
const bcrypt = require("bcrypt");

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
  console.log(req.body);
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      quote: req.body.quote,
    });
    res.json({ status: "ok", msg: "create new user successfully" });
  } catch (error) {
    console.error(error);
    res.json({ status: "error", msg: error });
  }
});

//Login request for logging in existing user
app.post("/api/login", async function (req, res) {
  const user = await User.findOne({
    email: req.body.email,
  });
  const isValid = await bcrypt.compare(req.body.password, user.password);

  if (user && isValid) {
    const token = JWT.sign({ email: user.email, name: user.name }, "secret123");
    res.json({ status: "ok", token: token });
  } else {
    res.status(401).json({ status: "error", msg: "Invalid Credentials" });
  }
});

//Get Quote for get quote of requested user
app.get("/api/quote", async function (req, res) {
  try {
    console.log("Headers token", req.headers["x-access-token"]);
    const decode = await JWT.verify(req.headers["x-access-token"], "secret123");
    console.log("JWT verify", decode);
    const { email, name } = decode;
    const user = await User.findOne({ email: email, name: name });
    res.status(200).json({ status: "ok", quote: user.quote });
  } catch (error) {
    res.status(400).json({ status: "error", msg: "Invalid token naja" });
  }
});

//Post Quote for update new quote to a user
app.post("/api/quote", async function (req, res) {
  try {
    const decode = await JWT.verify(req.headers["x-access-token"], "secret123");
    console.log("decode token", decode);
    const { email, name } = decode;
    const user = await User.findOneAndUpdate(
      { email: email, name: name },
      { quote: req.body.quote },
      { new: true }
    );
    res.status(200).json({ status: "ok", quote: user.quote });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "error", msg: "Invalid token" });
  }
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
