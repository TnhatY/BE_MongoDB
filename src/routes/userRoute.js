import { Router } from 'express'
import { getHome, getCreateUser, postRegister, getEditUser, getLogin, postLogin, postEditUser, deleteUserC, logOut } from '../controllers/userController.js'
import { verifyAccessToken } from '../configs/jwt.js'

const userRoute = Router()

userRoute.get('/', getHome)
userRoute.get('/create-user', getCreateUser)
userRoute.post('/register', postRegister)
userRoute.get('/edit/:id', getEditUser)
userRoute.get('/login', getLogin)
userRoute.post('/login2', postLogin)
userRoute.post('/update', postEditUser, getHome)
userRoute.get('/delete/:id', deleteUserC, getHome)
userRoute.post('/logout', logOut, getHome)

userRoute.get('/getlists', verifyAccessToken, (req, res, next) => {
    const listUser = [
        {
            email: 'a@gmail.com'
        },
        {
            email: 'b@gmail.com'
        }]
    res.json({
        listUser
    })
})

export default userRoute