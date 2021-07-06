const dotenv = require("dotenv").config(),
  Config = require("./src/config/config"),
  app = require("./src/server"),
  socket = require("socket.io"),
  Mongoose = require("mongoose"),
  Connection = require("./src/config/mongoose-connection"),
  {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
  } = require("./src/utils/chat"),
  port = process.env.PORT || Config.deafult.port;

let server = require("http").createServer(app);

Connection();

//INFO: http server
server = app.listen(port, function () {
  console.log(`Server is running on: http://localhost:${port}`);
});

//INFO: socket connection
let io = socket(server, {
  cors: {
    origin: "*",
    credentials: false,
  },
});

app.set("socketio", io);

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to room ${user.room}.`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined!` });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });

  socket.on("message", (data) => {
    console.log(data);
    io.emit("message", data);
  });

  //INFO: video call
  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

module.exports = server;
