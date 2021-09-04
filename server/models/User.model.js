const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema({
  name: { required: true, type: String },
  email: { required: true, type: String, unique: true },
  password: { required: true, type: String },
  quote: { type: String },
});

const model = mongoose.model("UserQuote", user);

module.exports = model;
