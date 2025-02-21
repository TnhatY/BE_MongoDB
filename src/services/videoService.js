import Video from '../models/video.js';

export const addVideo = async (video) => {
    try {
        await video.save();
    } catch (error) {
        console.log(error)
    }
}


export const updateVideo = async (id, title, poster, description, views) => {
    try {
        const newVideo = await Video.findByIdAndUpdate(id, { title, poster, description, views }, { new: true })
        if (!newVideo) {
            console.log('lỗi')
        }
    } catch (error) {
        console.log("lỗi ở catch service")
    }
}
