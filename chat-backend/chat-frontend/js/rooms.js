import { getToken } from "./auth.js";
import { initSocket, joinRoom } from "./socket.js";

const API_URL = "/api/rooms";

export async function initChatPage() {
    initSocket();
    await loadRooms();
}

export async function loadRooms() {
    const token = getToken();
    const res = await fetch(API_URL, { headers: { Authorization: `Bearer ${token}` } });
    const rooms = await res.json();
    const roomsList = document.getElementById("roomsList");
    roomsList.innerHTML = "";
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.textContent = room.name;
        li.onclick = () => {
            joinRoom(room._id);
            document.getElementById("currentRoom").textContent = room.name;
            loadRoomMessages(room._id);
        };
        roomsList.appendChild(li);
    });
}

export async function createRoom() {
    const name = document.getElementById("newRoom").value.trim();
    if(!name) return alert("Enter a room name");
    const token = getToken();
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name })
    });
    const data = await res.json();
    if(res.ok) {
        document.getElementById("newRoom").value = "";
        loadRooms();
    } else alert(data.message);
}

export async function loadRoomMessages(roomId) {
    const token = getToken();
    const res = await fetch(`${API_URL}/${roomId}/messages`, { headers: { Authorization: `Bearer ${token}` } });
    const messages = await res.json();
    const messagesUL = document.getElementById("messages");
    messagesUL.innerHTML = "";
    messages.forEach(msg => {
        const li = document.createElement("li");
        li.textContent = `${msg.sender.username}: ${msg.content}`;
        messagesUL.appendChild(li);
    });
}

window.createRoom = createRoom;