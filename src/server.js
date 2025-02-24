import express from 'express'
import 'dotenv/config';
import { configViewEngine } from './configs/viewEngine.js'
import userRouter from './routes/userRoute.js'
import { connectToDB } from './configs/db.js';
import './configs/connection_redis.js';
import categoryRoute from './routes/categoryRoute.js';
import multer from "multer";
import videoRoute from './routes/videoRoute.js';
//import passport from 'passport';
//import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


const port = process.env.PORT || 2610

const app = express()

//passport.use(new GoogleStrategy());


//config req.body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//khai bao route
app.use(userRouter);
app.use(categoryRoute);
app.use(videoRoute);
//config template engine
configViewEngine(app);

const START_SERVER = async () => {
    await connectToDB();
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`)
    })
}

START_SERVER();

