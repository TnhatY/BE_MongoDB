import { addCategory, findAll } from "../services/categoryService.js"
import Category from "../models/category.js"
import upload from "../configs/uploads_image.js"


export const getAddCategory = (req, res, next) => {
    res.render('addCategory.ejs', { category: null })
}

export const postAddCategory = async (req, res) => {
    try {
        const { categoryName, categoryCode, status } = req.body;
        const imagePath = req.file && req.file.path ? req.file.path.toString() : "";

        if (!categoryName || !categoryCode) {
            return res.status(400).json({ error: "Thiếu dữ liệu danh mục!" });
        }

        //const image = "anh.jpg"
        await addCategory(categoryName, categoryCode, imagePath.toString(), status);
        return res.status(201).json({ message: "Thêm danh mục thành công!" });
    } catch (error) {
        console.error("Lỗi khi thêm danh mục:", error);
        return res.status(500).json({ error: "Lỗi server" });
    }
};

// Xuất multer middleware để dùng trong routes
export const uploadMiddleware = upload.single("images");


export const getAllCategory = async (req, res) => {
    try {
        const list = await findAll();
        console.log(list)
        res.render('listCategory.ejs', { categories: list })
    } catch (error) {

    }

}