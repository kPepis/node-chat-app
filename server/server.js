const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validation");
const { Users } = require("./utils/users");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();
const chatName = "Nyan Chat";

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("New user connected.");

  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback("Username and room name are required.");
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit("updateUserList", users.getUserList(params.room));

    // Receiving person
    socket.emit(
      "newMessage",
      generateMessage("Admin", `Welcome to ${chatName}`)
    );

    // Everyone but the connecting user
    socket.broadcast
      .to(params.room)
      .emit(
        "newMessage",
        generateMessage("Admin", `${params.name} has joined.`)
      );

    callback();
  });

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

  socket.on("disconnect", () => {
    const user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io.to(user.room).emit(
        "newMessage",
        generateMessage("Admin", `${user.name} has disconnected.`)
      );
    }
  });

  socket.on("updateUserList", users => {
    console.log("Users list", users);
  });
});

server.listen(port, () => console.log(`Server is up on port ${port}`));
