import chatRoom from "../models/chatRoomModel.js";
import User from "../models/userModel.js";
import Messages from "../models/messageModel.js";

export const getMessagesByRoom = async (req, res) => {
    try {
        const { roomId } = req.params;

        const room = await chatRoom.findById(roomId);
        if(!room) return res.status(404).json({message: "Chat Room not found"});
    
        const messages = (await Messages.find({room: roomId}).populate("sender", "username email")).toSorted({createdAt: 1});
        
        res.status(200).json(messages);
    } catch(err) {
        console.error("Error fetching messages:", error);
        res.status(500).json({message:"Server Error"});
    }
};