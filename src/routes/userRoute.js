import { Router } from 'express'
import {
    getHome, getCreateUser, postRegister, getEditUser, getLogin, postLogin, postEditUser, deleteUserC,
    logOut, getUserProfile, getLoginWithGoogle,
    refreshToken, postMessage
} from '../controllers/userController.js'
import { verifyAccessToken } from '../middlewares/authMiddleware.js';
import passport from 'passport';
import cookie from "cookie";
import { checkRole } from '../middlewares/checkRoleMiddleware.js';

const userRoute = Router()

userRoute.get('/', verifyAccessToken, checkRole("Admin"), getHome)
userRoute.get('/create-user', verifyAccessToken, getCreateUser)
userRoute.post('/register', postRegister)
userRoute.get('/edit/:id', getEditUser)
//userRoute.get('/login', getLogin)
userRoute.post('/login', postLogin)
userRoute.post('/update', postEditUser, getHome)
userRoute.get('/delete/:id', deleteUserC, getHome)
userRoute.post('/logout', logOut)
userRoute.get('/profile', verifyAccessToken, getUserProfile);
userRoute.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
userRoute.get('/auth/google/callback', getLoginWithGoogle);
userRoute.post('/auth/refresh', refreshToken)
userRoute.post('/message', postMessage)

export default userRoute
