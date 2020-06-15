import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var MedalSchema = new Schema({
    name: String,
    description: String,
    img_url: String,
    process_func: String
})

const Medal = mongoose.model('Medal', MedalSchema);

module.exports = Medal;