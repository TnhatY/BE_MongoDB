import { addVideo, updateVideo } from "../services/videoService.js"
import Video from "../models/video.js"
import Category from "../models/category.js"
import upload from "../configs/uploads_image.js"

export const uploadImage = upload.single("images");

export const getAllVideo = async (req, res) => {
    try {
        const list = await Video.find().populate('categoryId');
        res.render('listVideo.ejs', { listVideo: list })
    } catch (error) {
        console.log(error)
    }
}

export const getAddVideoForm = async (req, res) => {
    const list = await Category.find();

    res.render('addVideo.ejs', { categories: list })
}

export const createVideoOrUpdate = async (req, res) => {
    try {
        let { title, poster, views, description, active, categoryId } = req.body;
        const imagePath = req.file && req.file.path ? req.file.path.toString() : "";
        if (imagePath != "") {
            poster = imagePath.toString();
        }
        const video = new Video({ title, poster, views, description, active, categoryId })
        await addVideo(video);
        res.redirect('/listVideo')
    } catch (error) {
        console.log(error)
    }
}