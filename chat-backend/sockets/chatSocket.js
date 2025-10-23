import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import chatRoom from "../models/chatRoomModel.js";

export const chatSocket = (io) => {
    io.on("Connection", async (socket)=> {
        console.log("New Client Connected:", socket.id);

        const token = socket.handshake.auth?.token;
        
        if(!token) {
            console.log("No token provided, disconnecting...");
            socket.disconnect(true);
            return;
        }

        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            console.log(`User authenticated: ${socket.userId}`);
        } catch(err) {
            console.log("Invalid token");
            socket.disconnect(true);
            return;
        }

        socket.on("join_room", async (roomId) => {
            socket.join(roomId);    
            console.log(`User ${socket.userId} joined room ${roomId}`);

            socket.to(roomId).emit("user_joined", {
                userId:socket.userId,
                message: "A new user has joined the chat.",
            });
        });

        socket.on("send_message", async ({roomId, content }) => {
            if(!content.trim()) return;

            const message = new Message({
                room: roomId,
                sender: socket.userId,
                content,
            });

            await message.save();

            io.to(roomId).emit("recieve_message", {
                roomId,
                sender: socket.userId,
                content,
                timestamp: message.createdAt,
            });

            console.log(`User ${socket.userId} sent a message in ${roomId}`);
        });

        socket.on("leave_room", (roomId) => {
            socket.leave(roomId);
            console.log(`User ${socket.userId} left room ${roomId}`);

            socket.to(roomId).emit("user_left", {
                userId:socket.userId,
                message: "A user has left the chat",
            });
        });

        socket.on("disconnect", ()=> {
           console.log("Client disconnected:", socket.id);
        });
    });
};