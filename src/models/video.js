
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type: String },
    poster: { type: String },
    views: { type: Number, default: 0 },
    description: { type: String },
    active: { type: Boolean, default: false },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});

const Video = mongoose.model('Video', videoSchema);

export default Video;