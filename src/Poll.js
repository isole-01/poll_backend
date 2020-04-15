import mongoose from "mongoose";

const Schema = mongoose.Schema;


const pollSchema = new Schema({
    name: String,
    _id: String,
    questions: [
        {
            _id: String,
            text: String,
            choice_a: String,
            number_a: Number,
            choice_b: String,
            number_b: Number,
            choice_c: String,
            number_c: Number,
            choice_d: String,
            number_d: Number,
        }
    ]
});

export default mongoose.model('Poll',pollSchema);