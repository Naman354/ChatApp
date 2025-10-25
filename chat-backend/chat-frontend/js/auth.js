const API_URL = "/api/auth";

export async function loginUser(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("username", data.username);
            window.location.href = "chat.html";
        } else alert(data.message);
    } catch (err) { console.error(err); }
}

export async function registerUser(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (res.ok) {
            alert("Registration successful! Login now.");
            window.location.href = "index.html";
        } else alert(data.message);
    } catch (err) { console.error(err); }
}


export function getToken() {
    return sessionStorage.getItem("token");
}

export function getUsername() {
    return sessionStorage.getItem("username");
}
