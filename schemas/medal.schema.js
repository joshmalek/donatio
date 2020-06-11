import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var Medal = new Schema({
    name: String,
    description: String,
    img_url: String

})


export default mongoose.model("Medal", Medal);
