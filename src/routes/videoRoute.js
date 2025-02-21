import { Router } from "express";
import { getAllVideo, createVideoOrUpdate, getAddVideoForm, uploadImage } from "../controllers/videoController.js";

const videoRoute = Router();

videoRoute.get('/listVideo', getAllVideo)
videoRoute.get('/addVideo', getAddVideoForm)
videoRoute.post('/addOrUpdate', uploadImage, createVideoOrUpdate)

export default videoRoute;