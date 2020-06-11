import mongoose from 'mongoose';
import Medal from './medal.schema';

var Schema = mongoose.Schema;

var User = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    experience: Number,
    medals: {
        type: [Medal],
        default: []
    }
})

export default mongoose.model("User", User);