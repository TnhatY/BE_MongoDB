import jwt from "jsonwebtoken";
import Message from "../models/message";
import { verifyRefreshToken } from "./jwt";
import cookie from "cookie";

const onlineUsers = {};

const handleSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // **Xác thực JWT khi client gửi token**
        socket.on("authenticate", () => {
            try {
                // Lấy cookie từ request headers
                const cookies = cookie.parse(req.headers.cookie || '');
                const token = cookies.accessToken;
                const refreshToken = cookies.refreshToken;

                if (!token) throw new Error("No token found");

                const decoded = verifyRefreshToken(token);
                onlineUsers[decoded.userId] = socket.id;
                console.log("User authenticated:", decoded.userId);
            } catch (err) {
                console.log("Authentication failed:", err);
                socket.emit("auth_error", "Invalid token");
            }
        });

        // **Xử lý gửi tin nhắn riêng tư**
        socket.on("private message", async ({ to, message }) => {
            try {
                // Lấy token từ cookie
                const cookies = cookie.parse(req.headers.cookie || '');
                const token = cookies.accessToken;
                if (!token) throw new Error("No token found");

                const decoded = verifyRefreshToken(token);
                const sender = decoded.userId;
                const receiverSocketId = onlineUsers[to];

                const newMessage = new Message({ sender, receiver: to, message });
                await newMessage.save();

                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("private message", { from: sender, message });
                } else {
                    socket.emit("message_status", "User is offline, message saved.");
                }
            } catch (err) {
                socket.emit("message_error", "Message send failed");
                console.log("Message send failed:", err);
            }
        });


        // **Xóa user khi disconnect**
        socket.on("disconnect", () => {
            for (let user in onlineUsers) {
                if (onlineUsers[user] === socket.id) {
                    delete onlineUsers[user];
                    break;
                }
            }
            console.log("User disconnected:", socket.id);
        });
    });
};

export default handleSocket;
