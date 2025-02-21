import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passWord: { type: String, required: true }
});



userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.passWord, salt);
        this.passWord = hashedPassword;
        next();
    } catch (error) {
        next(error)
    }

})

userSchema.methods.isCheckPassword = async function (passWord) {
    try {
        return await bcrypt.compare(passWord, this.passWord)

    } catch (error) {

    }
}



const User = mongoose.model("User", userSchema);
export default User;