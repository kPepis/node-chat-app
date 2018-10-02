const socket = io();

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => console.log("Disconnected from server"));

socket.on("newMessage", msg => console.log("newMessage", msg));