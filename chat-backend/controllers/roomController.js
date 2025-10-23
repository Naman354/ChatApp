import chatRoom from "../models/chatRoomModel.js";
import User from "../models/userModel.js";

export const createRoom = async (req, res) => {
    try {
        const {name} = req.body;

        const existingRoom = await chatRoom.findOne({name});
        if (existingRoom) {
            return res.status.json({message: "Room name already used"});
        }

        const newRoom = new chatRoom({
        name,
        created_by: req.user.id,
        });

        await newRoom.save();
        res.status(201).json({
            message:"Chatroom created successfully",
            roon: newRoom,
        });
    } catch(err) {
        console.log("Error creating room", err);
        res.status(500).json({message:"Server Error"});
    }
};

export const getRooms = async (req, res)=> {
    try {
        const rooms = await chatRoom.find().populate("created_by", "username email");
        res.status(200).json(rooms);
    } catch (err) {
        console.log("Error Fetching", err);
        res.status(500).json({message: "Server Error"});
    }
};