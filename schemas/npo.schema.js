import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var NPOSchema = new Schema({
    name: String,
    org_id: String,
    priority: Number,
    amount_donated: Number
})

const NPO = mongoose.model('NPO', NPOSchema);
module.exports = NPO;