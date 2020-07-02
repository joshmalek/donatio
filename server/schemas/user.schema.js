import mongoose from "mongoose";
const Medal = require("./medal.schema");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  experience: Number,
  medals: [Medal.schema],
  total_donated: Number,
  email_confirmed: Boolean,
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
