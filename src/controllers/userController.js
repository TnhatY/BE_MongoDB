import client from "../configs/connection_redis.js";
import { connectToDB } from "../configs/db.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../configs/jwt.js";
import User from "../models/user.js"
import { addUser, getUser, checkLogin, updateUser, deleteUser, messageWithSendIdAndReceiveId } from "../services/userService.js";
import jwt from 'jsonwebtoken';
import createError from 'http-errors';

import cookie from "cookie";
import passport from "passport";

export const getHome = async (req, res) => {
    try {
        const listUser = await User.find();
        //res.render('home.ejs', { listUser: listUser, refreshToken: "" });
        res.json({ listUser })
    } catch (error) {
        console.error(" Error fetching users:", error);
        res.status(500).send("Lỗi lấy danh sách user");
    }
};

export const getCreateUser = (req, res) => {
    res.render('addUser.ejs', { user: null })
}

export const postRegister = async (req, res) => {
    const check = await addUser(req.body.email, req.body.firstName, req.body.lastName, req.body.passWord)
    if (check == null) {
        res.send('lỗi');
        return
    }

    return res.json({
        status: true,
        message: "Register success!!"
    })
}

export const getEditUser = async (req, res) => {
    const userid = req.params.id
    const user = await getUser(userid)
    res.render('addUser.ejs', { user: user })
}

export const postEditUser = async (req, res, next) => {
    const { email, firstName, lastName } = req.body;
    const user = await updateUser(email, firstName, lastName)
    next();
}

export const getLogin = (req, res) => {
    res.render('login.ejs', { error: "" });
}


export const postLogin = async (req, res, next) => {
    try {
        const { email, passWord } = req.body;
        const result = await checkLogin(email, passWord);
        if (result !== true) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const accToken = await signAccessToken(user._id, user?.role);
        const refreshToken = await signRefreshToken(user._id);

        res.setHeader("Set-Cookie", [
            cookie.serialize("accessToken", accToken, { httpOnly: true, secure: true, sameSite: "none", path: "/" }),
            cookie.serialize("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "none", path: "/" })
        ]);

        res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken: accToken,
            refreshToken: refreshToken,
        });
    } catch (error) {
        next(error);
    }
}

export const logOut = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        // const { refreshToken } = req.body;
        if (!refreshToken) {
            res.json({ status: false })
        }

        const userId = await verifyRefreshToken(refreshToken);
        // Xóa refresh token trong Redis
        await client.del(userId);
        // Xóa cookie chứa refreshToken
        res.setHeader("Set-Cookie", [
            cookie.serialize("accessToken", "", { httpOnly: true, secure: true, sameSite: "none", path: "/", expires: new Date(0) }),
            cookie.serialize("refreshToken", "", { httpOnly: true, secure: true, sameSite: "none", path: "/", expires: new Date(0) })
        ]);

        //console.log(accessToken)
        res.json({
            status: true,
            message: "Logout success"
        })
    } catch (error) {
        console.log(error);
    }
};


export const deleteUserC = async (req, res, next) => {
    const userId = req.params.id;
    await deleteUser(userId);
    next();
}


export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId)
        res.json(user);
        //res.json({})
        //console.log(user)
    } catch (error) {
        next(error);
    }
};


export const getLoginWithGoogle = async (req, res, next) => {
    passport.authenticate('google', (err, data) => {

        // Lưu token vào cookie
        res.setHeader("Set-Cookie", [
            cookie.serialize("accessToken", data.accToken, { httpOnly: true, secure: true, sameSite: "none", path: "/" }),
            cookie.serialize("refreshToken", data.refToken, { httpOnly: true, secure: true, sameSite: "none", path: "/" })
        ]);

        res.redirect("https://fe-react-pied.vercel.app"); // Chuyển hướng về frontend
    })(req, res, next);
}


export const refreshToken = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        const refreshToken = cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, payload) => {
            if (err) {
                return res.status(403).json({ message: "Invalid refresh token" });
            }

            // Tạo token mới
            const newAccessToken = jwt.sign({ userId: payload.userId, role: payload.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

            res.setHeader("Set-Cookie", [
                cookie.serialize("accessToken", newAccessToken, { httpOnly: true, secure: true, sameSite: "none", path: "/" }),
                // cookie.serialize("refreshToken", data.refToken, { httpOnly: true, secure: false, path: "/" })
            ]);

            res.status(200).json({ message: "Token refreshed successfully" });
        });
    } catch (error) {
        next(error);
    }
};


export const getMessage = async (res, req) => {

    try {
        const receiveId = req.body.receiverId;
        const token = req.cookies.accessToken;
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.userId;
        let message = messageWithSendIdAndReceiveId(userId, receiveId)
        if (message) {
            res.json(message)
        }
        else {
            res.json("ko co message")
        }
    } catch (error) {
        res.json(error)
    }
}
