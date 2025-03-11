import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    passWord: { type: String },
    googleId: String,
    avatar: String,
    role: String
});



userSchema.pre('save', async function (next) {
    try {
        if (!this.passWord) return next();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.passWord, salt);
        this.passWord = hashedPassword;
        if (!this.role) {
            this.role = "User";
        }
        next();
    } catch (error) {
        next(error)
    }

})

userSchema.methods.isCheckPassword = async function (passWord) {
    try {
        if (!this.passWord) return next();
        return await bcrypt.compare(passWord, this.passWord)

    } catch (error) {

    }
}



const User = mongoose.model("User", userSchema);
export default User;