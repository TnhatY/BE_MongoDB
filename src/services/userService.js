import { connectToDB } from "../configs/db.js";
import Message from "../models/message.js";
import User from "../models/user.js"
import { userValidate } from "../schema/userShema.js";
import createError from 'http-errors';

export const addUser = async (email, firstName, lastName, passWord) => {
    try {
        const user = new User({ email, firstName, lastName, passWord });
        const { error } = userValidate(user)
        if (error) {
            console.log(error)
            return null;
        }

        await user.save();
        return user;
    } catch (error) {
        throw new Error('Error adding user: ' + error.message);
    }
}

export const getUser = async (id) => {
    try {
        const user = await User.findById(id)
        return user;

    } catch (error) {
        console.log("loi")
        return null;
    }
}

export const checkLogin = async (email, passWord) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return "Email không đúng";
        }

        const isMatch = await user.isCheckPassword(passWord)
        if (!isMatch) {
            return "Mật khẩu không đúng";
        }

        return true;
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        return "Đã xảy ra lỗi";
    }
}


export const updateUser = async (email, firstName, lastName) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { firstName, lastName },
            { new: true }
        );

        console.log(updatedUser)
        return updatedUser;
    } catch (error) {

    }
}

export const deleteUser = async (userId) => {
    try {
        await User.findByIdAndDelete(userId)

    }
    catch (error) {
        console.log("lỗi")
    }
}

export const messageWithSendIdAndReceiveId = async (userId, receiveId) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: receiveId },
                { sender: receiveId, receiver: userId }
            ]
        }).sort({ timestamp: 1 });
        return messages;
    } catch (error) {
        console.error("Error fetching messages:", error);
        throw new Error("Cannot fetch messages");
    }
}