import cookie from "cookie";
import jwt from "jsonwebtoken";
import Message from "../models/message.js";
import { getUser } from "../services/userService.js";

const onlineUsers = {};

const handleSocket = async (io) => {
    io.on("connection", async (socket) => {
        console.log("User connected:", socket.id);

        try {
            // **Lấy token từ cookie của request**
            const cookies = cookie.parse(socket.handshake.headers.cookie || '');
            const token = cookies.accessToken; // Token được gửi qua cookie HttpOnly

            if (!token) throw new Error("No token found");

            // **Xác thực token & lấy userId**
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const userId = decoded.userId;
            onlineUsers[userId] = socket.id;
            socket.userId = userId; // Lưu userId vào socket

            // 🆕 Gửi sự kiện xác thực thành công cho client
            socket.emit("authenticated", userId);
            console.log(`User authenticated: ${userId}`);

            // **Lấy thông tin user từ service**
            const user = await getUser(userId);
            if (!user) {
                console.log("User not found");
                throw new Error("User not found");
            }

            // **Cập nhật danh sách user online chính xác**
            const onlineUserList = await Promise.all(
                Object.keys(onlineUsers).map(async (id) => {
                    const userData = await getUser(id);
                    return {
                        id,
                        lastName: userData?.lastName || "Unknown",
                        avatar: userData?.avatar || "",
                    };
                })
            );

            io.emit("updateUserList", onlineUserList);
        } catch (err) {
            console.log("Authentication failed:", err.message);
            socket.emit("auth_error", "Invalid token");
            return socket.disconnect(); // Ngắt kết nối nếu xác thực thất bại
        }

        // **Xử lý gửi tin nhắn riêng tư**
        socket.on("privateMessage", async ({ to, message }) => {
            try {
                if (!socket.userId) throw new Error("User not authenticated");

                const senderId = socket.userId;
                const receiverSocketId = onlineUsers[to];

                // Lưu tin nhắn vào MongoDB
                const newMessage = new Message({ sender: senderId, receiver: to, message });
                await newMessage.save();

                // Gửi tin nhắn đến người nhận nếu họ đang online
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("privateMessage", { from: senderId, message });
                } else {
                    socket.emit("messageStatus", "User is offline, message saved.");
                }
            } catch (err) {
                socket.emit("messageError", "Message send failed");
                console.log("Message send failed:", err);
            }
        });

        // **Xóa user khi disconnect**
        socket.on("disconnect", () => {
            if (socket.userId) {
                delete onlineUsers[socket.userId];

                // Cập nhật danh sách user online
                const updatedUserList = Object.keys(onlineUsers).map((id) => ({
                    id,
                    lastName: "Unknown",
                    avatar: "",
                }));
                io.emit("updateUserList", updatedUserList);
            }
            console.log("User disconnected:", socket.id);
        });
    });
};

export default handleSocket;
