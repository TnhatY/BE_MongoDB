import Category from "../models/category.js";
import { categoryValidate } from "../schema/categorySchema.js";


export const addCategory = async (categoryName, categoryCode, images, status) => {
    try {
        const category = new Category({ categoryName, categoryCode, images, status })
        const { error } = categoryValidate(category)
        if (error) {
            console.log(error)
            return false;
        }

        category.save();
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}


export const findAll = async () => {
    try {
        const list = await Category.find()
        return list;
    } catch (error) {
        console.log(error)
        return null;
    }
}