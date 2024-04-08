const express = require("express");
const socket = require("socket.io");

const app = express();

const port = 3000;

app.use(express.static("public"));
const server = app.listen(port, (err) => {
  if (err) console.log("some error while starting server", err);
  console.log(`server running on port ${port}`);
});

let io = socket(server);

io.on("connection", (socket) => {
  console.log("connection added");
  socket.on("beginPath", (data) => {
    io.sockets.emit("beginPath", data);
  });
  socket.on("drawStroke", (data) => {
    io.sockets.emit("drawStroke", data);
  });
  socket.on("redo", (data) => {
    io.sockets.emit("redo", data);
  });
  socket.on("undo", (data) => {
    io.sockets.emit("undo", data);
  });
});
