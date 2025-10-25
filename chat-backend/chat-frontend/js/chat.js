import { sendMessage } from "./socket.js";
import { createRoom, initChatPage } from "./rooms.js";

document.addEventListener("DOMContentLoaded", () => {
    // Init chat page (load rooms + init socket)
    initChatPage();

    // Attach buttons
    document.getElementById("createRoomBtn").addEventListener("click", createRoom);
    document.getElementById("sendBtn").addEventListener("click", sendMessage);

    // Optional: send message on Enter
    document.getElementById("msg").addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });
});
