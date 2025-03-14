import jwt from "jsonwebtoken";
import Message from "../models/message.js";
import { verifyRefreshToken } from "./jwt.js";
import cookie from "cookie";

const onlineUsers = {};

const handleSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        try {
            // Lấy cookie từ socket handshake
            const cookies = cookie.parse(socket.handshake.headers.cookie || '');
            const token = cookies.accessToken;

            if (!token) throw new Error("No token found");

            // Xác thực token & lấy userId
            const decoded = verifyRefreshToken(token);
            const userId = decoded.userId;
            onlineUsers[userId] = socket.id;
            socket.userId = userId; // Lưu userId vào socket để dùng sau

            console.log("User authenticated:", userId);
        } catch (err) {
            console.log("Authentication failed:", err);
            socket.emit("auth_error", "Invalid token");
            return socket.disconnect(); // Ngắt kết nối nếu xác thực thất bại
        }

        // **Xử lý gửi tin nhắn riêng tư**
        socket.on("private message", async ({ to, message }) => {
            try {
                if (!socket.userId) throw new Error("User not authenticated");

                const sender = socket.userId;
                const receiverSocketId = onlineUsers[to];

                // Lưu tin nhắn vào MongoDB
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
            if (socket.userId) {
                delete onlineUsers[socket.userId];
            }
            console.log("User disconnected:", socket.id);
        });
    });
};

export default handleSocket;
