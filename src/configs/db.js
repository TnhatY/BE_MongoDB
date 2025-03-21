import mongoose from 'mongoose'

let isConnected = false

export const connectToDB = async () => {
    mongoose.set('strictQuery', true)

    if (isConnected) {
        // console.log('DB is already connected.')
        return
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME,
        })

        isConnected = true

        console.log('DB connected successfully.')
    } catch (error) {
        console.log('DB: ', error)
    }
}
