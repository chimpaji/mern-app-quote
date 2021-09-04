const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const PORT = 3001;

app.use(express.json());
app.use(cors());

try {
  mongoose.connect(
    `mongodb+srv://admin:lJR7HEF5tvBcyY9l@cluster0.p8nqf.mongodb.net/mern-quote?retryWrites=true&w=majority`
  );
  console.log("connected to MongoDB");
} catch (error) {
  console.error(error);
}

app.get("/", function (req, res) {
  res.end("Hello World");
});

app.post("/api/register", function (req, res) {
  res.json(req.body);
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
