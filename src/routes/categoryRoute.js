import { Router } from "express";
import { getAddCategory, getAllCategory, postAddCategory, uploadMiddleware } from "../controllers/categoryController.js";


const categoryRoute = Router();

categoryRoute.get('/addCategory', getAddCategory)
categoryRoute.post('/save', uploadMiddleware, postAddCategory)
categoryRoute.get('/list', getAllCategory)
export default categoryRoute;