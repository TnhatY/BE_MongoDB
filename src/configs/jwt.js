import jwt from 'jsonwebtoken'
import createError from 'http-errors'


export const signAccessToken = async (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userId
        }
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const options = {
            expiresIn: '1h'
        }
        jwt.sign(payload, secret, options, (error, token) => {
            if (error) reject(error)
            resolve(token)
        })
    })
}

export const verifyAccessToken = (req, res, next) => {
    if (!req.headers['authorization']) {
        return next(createError.Unauthorized())
    }
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            return next(createError.Unauthorized());
        }
        req.payload = payload
        next();
    })
}

export const signRefreshToken = async (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userId
        }
        const secret = process.env.REFRESH_TOKEN_SECRET;
        const options = {
            expiresIn: '1y'
        }
        jwt.sign(payload, secret, options, (error, token) => {
            if (error) reject(error)
            resolve(token)
        })
    })
}