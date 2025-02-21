import multer from "multer";
import path from "path";

// Cấu hình multer để lưu ảnh vào thư mục `uploads/`
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Lưu file vào thư mục uploads/
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Đổi tên file tránh trùng lặp
    }
});
const upload = multer({ storage: storage });

export default upload;