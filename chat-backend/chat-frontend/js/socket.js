import { getToken, getUsername } from "./auth.js";
import { currentRoomId, joinedRoom } from "./rooms.js";

export let socket;

export function initSocket() {
    const token = getToken();
    if (!token) { alert("Login required"); window.location.href="index.html"; return; }

    socket = io("/", { auth: { token }, transports: ["websocket"] });

    socket.on("connect_error", (err) => {
        console.error("Connection error:", err.message);
        if(err.message.includes("token")) {
            alert("Session expired. Please login again.");
            sessionStorage.clear();
            window.location.href = "index.html";
        }
    });

    socket.on("receive_message", (data) => {
        if(data.room !== currentRoomId) return; // Only show current room messages
        addMessage(data.sender.username, data.content);
    });

    socket.on("system_message", (msg) => {
  const messagesUL = document.getElementById("messages");
  const li = document.createElement("li");
  li.textContent = msg;
  li.classList.add("system-message"); // distinct font/style
  messagesUL.appendChild(li);
});
}

export function joinRoom(roomId) {
    if (!roomId) return;
    if (socket) {
        if(currentRoomId) socket.emit("leave_room", currentRoomId);
    currentRoomId = roomId;
    }
    socket.emit("join_room", roomId);
}

export function sendMessage() {
    const msgInput = document.getElementById("msg");
    const msg = msgInput.value.trim();
    if (!msg) return alert("Type a message");
    if(!currentRoomId) return alert("Join a room first");
    socket.emit("send_message", { roomId: currentRoomId, content: msg });
    msgInput.value = "";
}

export function addMessage(sender, content) {
    const li = document.createElement("li");
    li.textContent = `${sender}: ${content}`;
    document.getElementById("messages").appendChild(li);    
}

window.sendMessage = sendMessage;
