import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import cookie from 'cookie';



// export const verifyAccessToken = (req, res, next) => {
//     const cookies = cookie.parse(req.headers.cookie || '');
//     const token = cookies.accessToken;
//     const refreshToken = cookies.refreshToken;

//     if (!token)
//         return res.json({
//             status: false
//         })
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
//         if (err) {
//             console.error("Access Token Error:", err.message);
//             return next(createError.Unauthorized("Invalid token"));
//         }

//         req.user = payload;
//         req.accessToken = token;
//         req.refreshToken = refreshToken;
//         next();
//     });
// };

export const verifyAccessToken = (req, res, next) => {
    try {
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.accessToken;
        const refreshToken = cookies.refreshToken;

        if (!token) {
            return res.status(401).json({ status: false, message: "Unauthorized" });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ status: false, message: "Access token expired", refresh: true });
                }
                return res.status(401).json({ status: false, message: "Invalid token" });
            }

            req.user = payload;
            req.accessToken = token;
            req.refreshToken = refreshToken;
            next();
        });
    } catch (error) {
        next(createError.InternalServerError());
    }
};


