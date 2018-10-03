const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

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
  socket.emit("newMessage", {
    from: "Admin",
    text: `Welcome to ${chatName}`,
    createdAt: new Date().getTime()
  });

  // Everyone but the connecting user
  socket.broadcast.emit("newMessage", {
    from: "Admin",
    text: "New user joined",
    createdAt: new Date().getTime()
  });

  socket.on("createMessage", msg => {
    console.log("createMessage", msg);
    io.emit("newMessage", {
      from: msg.from,
      text: msg.text,
      createdAt: new Date().getTime()
    });
    // socket.broadcast.emit("newMessage", {
    //   from: msg.from,
    //   text: msg.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(port, () => console.log(`Server is up on port ${port}`));
