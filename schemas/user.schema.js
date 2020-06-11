import mongoose from 'mongoose';
const {MedalSchema} = require('./medal.schema').schema;

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    experience: Number,
    medals: {
        type: [MedalSchema],
        default: []
    },
    total_donated: Number
})

const User = mongoose.model('User', UserSchema);
module.exports = User;