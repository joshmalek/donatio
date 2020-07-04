import mongoose from 'mongoose'

var Schema = mongoose.Schema

var NonprofitSchema = new Schema({
  vendor_id: String,
  vendor_organization_reference: String,
  name: String,
  npo_id: Schema.Types.ObjectId,
  total: Number,
  is_NPOofDay: Boolean
})

const Nonprofit = mongoose.model('Nonprofit', NonprofitSchema)
module.exports = Nonprofit
