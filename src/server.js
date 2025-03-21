import express from 'express'
import 'dotenv/config';
import { configViewEngine } from './configs/viewEngine.js'
import userRouter from './routes/userRoute.js'
import { connectToDB } from './configs/db.js';
import './configs/connection_redis.js';
import categoryRoute from './routes/categoryRoute.js';
import videoRoute from './routes/videoRoute.js';
import cors from "cors";
import passport from './configs/passport.js';
import cookieParser from "cookie-parser";
import session from "express-session";
import handleSocket from './configs/socket.io.js';
import http from "http";
import { Server } from "socket.io";

const port = process.env.PORT || 2610

const app = express()
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://fe-react-pied.vercel.app", // Frontend
        credentials: true,
    }
});
app.use(cors({ origin: "https://fe-react-pied.vercel.app", credentials: true }));
app.use(cookieParser());
//config req.body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(
    session({
        secret: process.env.COOKIE_SECRET, // Thay bằng một chuỗi bảo mật
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());

//khai bao route
app.use(userRouter);
app.use(categoryRoute);
app.use(videoRoute);
//config template engine
configViewEngine(app);

//cookie
// app.use(
//     cookieSession({
//         maxAge: 30 * 24 * 60 * 60 * 1000,
//         keys: [process.env.COOKIE_SECRET]
//     })
// );


handleSocket(io);


const START_SERVER = async () => {
    await connectToDB();
    server.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`)
    })
}

START_SERVER();

