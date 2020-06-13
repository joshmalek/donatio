import mongoose from 'mongoose'

var Schema = mongoose.Schema

var NonprofitSchema = new Schema({
  vendor_id: String,
  vendor_organization_reference: String,
  name: String,
  priority: Number,
  npo_id: Schema.Types.ObjectId,
  amount_donated: Number
})

const Nonprofit = mongoose.model('Nonprofit', NonprofitSchema)
module.exports = Nonprofit
