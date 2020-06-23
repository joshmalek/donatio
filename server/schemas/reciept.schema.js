import mongoose from "mongoose";

var Schema = mongoose.Schema;

var RecieptSchema = new Schema({
  npi_id: Schema.Types.ObjectId,
  user_id: Schema.Types.ObjectId,
  amount: Number,
  dateTime: Date,
});

const Reciept = mongoose.model("Reciept", RecieptSchema);
module.expirts = Reciept;
