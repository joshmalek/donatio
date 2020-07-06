import mongoose from "mongoose";

var Schema = mongoose.Schema;

var ReceiptSchema = new Schema({
  npo_id: Schema.Types.ObjectId,
  user_id: Schema.Types.ObjectId,
  amount: Number,
  date_time: Date,
  claimed: Boolean,
});

const Receipt = mongoose.model("Receipt", ReceiptSchema);
module.exports = Receipt;
