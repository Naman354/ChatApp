import { getToken, getUsername } from "./auth.js";

export let socket;
export let currentRoomId = null;

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

    socket.on("user_joined", (data) => { if(data.room === currentRoomId) addMessage("System", data.message); });
    socket.on("user_left", (data) => { if(data.room === currentRoomId) addMessage("System", data.message); });
}

export function joinRoom(roomId) {
    if(currentRoomId) socket.emit("leave_room", currentRoomId);
    currentRoomId = roomId;
    socket.emit("join_room", roomId);
    document.getElementById("messages").innerHTML = "";
}

export function sendMessage() {
    const msgInput = document.getElementById("msg");
    const msg = msgInput.value.trim();
    if(!msg || !currentRoomId) return alert("Select a room and type a message");
    socket.emit("send_message", { roomId: currentRoomId, content: msg });
    msgInput.value = "";
}

window.sendMessage = sendMessage;

export function addMessage(sender, content) {
    const li = document.createElement("li");
    li.textContent = `${sender}: ${content}`;
    document.getElementById("messages").appendChild(li);
}
