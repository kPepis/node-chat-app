const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const { generateMessage, generateLocationMessage } = require("./utils/message");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const chatName = "Chat app";

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("New user connected.");

  // Receiving person
  socket.emit("newMessage", generateMessage("Admin", `Welcome to ${chatName}`));

  // Everyone but the connecting user
  socket.broadcast.emit(
    "newMessage",
    generateMessage("Admin", "New user joined.")
  );

  socket.on("createMessage", (msg, callback) => {
    console.log("createMessage", msg);
    io.emit("newMessage", generateMessage(msg.from, msg.text));
    callback();
  });

  socket.on("createLocationMsg", coords => {
    io.emit(
      "newLocationMessage",
      generateLocationMessage("Admin", coords.latitude, coords.longitude)
    );
  });

  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(port, () => console.log(`Server is up on port ${port}`));
