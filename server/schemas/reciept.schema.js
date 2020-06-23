import mongoose from "mongoose";

var Schema = mongoose.Schema;

var RecieptSchema = new Schema({
  npo_id: Schema.Types.ObjectId,
  user_id: Schema.Types.ObjectId,
  amount: Number,
  date_time: Date,
});

const Reciept = mongoose.model("Reciept", RecieptSchema);
module.exports = Reciept;
