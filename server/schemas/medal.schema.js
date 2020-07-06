import mongoose from "mongoose";

var Schema = mongoose.Schema;

var MedalSchema = new Schema({
  name: String,
  description: String,
  alt_description: String,
  asset_key: String,
  process_func: String,
  date_awarded: Date,
});

const Medal = mongoose.model("Medal", MedalSchema);

module.exports = Medal;
