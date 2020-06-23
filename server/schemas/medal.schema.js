import mongoose from "mongoose";

var Schema = mongoose.Schema;

var MedalSchema = new Schema({
  name: String,
  description: String,
  alt_description: String,
  asset_key: String,
  process_func: String,
});

const Medal = mongoose.model("Medal", MedalSchema);

module.exports = Medal;
