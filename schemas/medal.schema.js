import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var MedalSchema = new Schema({
    name: String,
    description: String,
    img_url: String
})


export default Medal = mongoose.model("Medal", MedalSchema);
