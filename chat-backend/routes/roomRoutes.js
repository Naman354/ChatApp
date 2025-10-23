import express from "express";
import {createRoom, getRooms} from "../controllers/roomController.js";
import protect from "../middlewares/authMiddleware.js";
import { getMessagesByRoom } from "../controllers/messageController.js";

const router = express.Router();

router.post("/", protect, createRoom);
router.get("/", protect, getRooms);

router.get("/rooms/:roomId/messages", protect, getMessagesByRoom);

export default router;