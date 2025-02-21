import { connectToDB } from "../configs/db.js";
import { signAccessToken, signRefreshToken } from "../configs/jwt.js";
import User from "../models/user.js"
import { addUser, getUser, checkLogin, updateUser, deleteUser } from "../services/userService.js";

export const getHome = async (req, res) => {
    try {
        const listUser = await User.find();
        res.render('home.ejs', { listUser: listUser });
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
    const listUser = await User.find(); // Lấy tất cả user từ MongoDB
    res.render('home.ejs', { listUser: listUser });
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
    const password = req.body.passWord
    const email = req.body.email
    const result = await checkLogin(email, password)
    if (result !== true) {
        return res.render('login.ejs', { error: result })
    }
    const user = await User.findOne({ email })
    const accToken = await signAccessToken(user._id)
    const refreshToken = await signRefreshToken(user._id)
    console.log(accToken)
    console.log(refreshToken)
    next()

}

export const deleteUserC = async (req, res, next) => {
    const userId = req.params.id;
    await deleteUser(userId);
    next();
}