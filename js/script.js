let socket;
let username = "";

document.getElementById("joinBtn").addEventListener("click", () => {
  username = document.getElementById("username").value.trim();
  if (username !== "") {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("chat").classList.remove("hidden");
    startChat();
  }
});

function startChat() {
  socket = new WebSocket("ws://localhost:5000");

  socket.onopen = () => {
    console.log("Connected to chat server ✅");
  };

  socket.onmessage = (event) => {
    const msgBox = document.getElementById("messages");
    const data = JSON.parse(event.data);
    const div = document.createElement("div");
    div.classList.add("message");
    if (data.user === username) div.classList.add("my-message");
    div.innerHTML = `<strong>${data.user}:</strong> ${data.text}`;
    msgBox.appendChild(div);
    msgBox.scrollTop = msgBox.scrollHeight;
  };

  document.getElementById("sendBtn").addEventListener("click", sendMessage);
  document.getElementById("msgInput").addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
  });
}

function sendMessage() {
  const msg = document.getElementById("msgInput").value.trim();
  if (msg !== "") {
    const data = { user: username, text: msg };
    socket.send(JSON.stringify(data));
    document.getElementById("msgInput").value = "";
  }
}
