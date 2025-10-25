import { getToken } from "./auth.js";
import { initSocket, joinRoom as socketJoinRoom } from "./socket.js";
import { socket } from "./socket.js";

const API_URL = "/api/rooms";
export let currentRoomId = null;
export let joinedRoom = false;

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
        li.dataset.id = room._id; 

        const currentUser = sessionStorage.getItem("username");
    if (room.created_by.username === currentUser) {
        const delBtn = document.createElement("button");
    delBtn.classList.add("delete-btn");
    delBtn.innerHTML = '<i class="fas fa-trash"></i>';
    delBtn.onclick = async (e) => {
        e.stopPropagation(); // prevent joining when clicking delete
        if (!confirm(`Delete room "${room.name}"?`)) return;

        const token = getToken();
        const res = await fetch(`${API_URL}/${room._id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        if (res.ok) {
            alert("Room deleted");
            loadRooms();
        } else {
            const data = await res.json();
            alert(data.message);
        }
    
    }

    li.appendChild(delBtn);
}
        li.onclick = () => {
            joinRoom(room._id);
            document.getElementById("currentRoom").textContent = room.name;

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

export function joinRoom(roomId) {
    currentRoomId = roomId;
    joinedRoom = false; // user hasn’t joined yet
     const li = document.querySelector(`#roomsList li[data-id="${roomId}"]`);
    document.getElementById("currentRoom").textContent = li ? li.textContent : "Room";
    document.getElementById("messages").innerHTML = "";
    
    const btn = document.getElementById("joinLeaveBtn");
    btn.disabled = false;
    btn.textContent = "Join";
}

document.getElementById("joinLeaveBtn").addEventListener("click", async () => {
    if (!currentRoomId) return;

    if (!joinedRoom) {
        socket.emit("join_room", currentRoomId);
        joinedRoom = true;
        document.getElementById("joinLeaveBtn").textContent = "Leave";
        await loadRoomMessages(currentRoomId);
    } else {
        socket.emit("leave_room", currentRoomId);
        joinedRoom = false;
        document.getElementById("joinLeaveBtn").textContent = "Join";
        document.getElementById("messages").innerHTML = "";
    }
});

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