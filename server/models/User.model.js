const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema({
  name: { required: true, type: "string" },
  email: { required: true, type: "string", unique: true },
  password: { required: true, type: "string" },
});

const model = mongoose.model("UserQuote", user);

module.exports = model;
