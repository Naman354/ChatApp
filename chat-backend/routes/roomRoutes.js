import express from "express";
import {createRoom, getRooms} from "../controllers/roomController.js";
import protect from "../middlewares/authMiddleware.js";
import { getMessagesByRoom } from "../controllers/messageController.js";
import chatRoom from "../models/chatRoomModel.js";
import Message from "../models/messageModel.js";

const router = express.Router();

router.post("/", protect, createRoom);
router.get("/", protect, getRooms);
router.delete("/:id", protect, async (req, res) => {
  try {
    const room = await chatRoom.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Only the creator can delete
    if (room.created_by.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    // Delete messages too
    await Message.deleteMany({ room: room._id });
    await room.deleteOne();

    res.json({ message: "Room deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/:roomId/messages", protect, getMessagesByRoom);

export default router;