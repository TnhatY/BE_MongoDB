import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.js";
import { signAccessToken, signRefreshToken } from "./jwt.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GG_CLIENT_ID,
            clientSecret: process.env.GG_CLIENT_SECRET,
            callbackURL: "https://be-mongodb.onrender.com/auth/google/callback",
            prompt: "select_account"
        },
        async (accessToken, refreshToken, profile, done) => { // Thêm accessToken và refreshToken
            try {
                //console.log("Google Profile:", profile);

                // Kiểm tra user đã tồn tại trong MongoDB chưa
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    user = new User({
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        firstName: profile.name.familyName,
                        lastName: profile.name.givenName,
                        avatar: profile.photos[0].value,
                        role: "Admin"
                    })
                    await user.save();
                }


                // Tạo token
                const accToken = await signAccessToken(user._id, user.role);
                const refToken = await signRefreshToken(user._id, user.role);

                // Trả về user + token
                return done(null, { user, accToken, refToken });
            } catch (error) {
                done(error, null);
            }
        }
    )
);

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.user._id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

export default passport;
