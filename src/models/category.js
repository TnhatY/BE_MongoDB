
import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({
    categoryName: { type: String },
    categoryCode: { type: String },
    images: { type: String },
    status: { type: Boolean, default: true }
});

const Category = mongoose.model('Category', categorySchema)

export default Category;