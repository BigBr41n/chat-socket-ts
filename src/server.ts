import http from "node:http";
import { Server, Socket } from "socket.io";
import app from "./app";

const PORT = process.env.PORT || 3399;
const server = http.createServer(app);

// sockets connected
let socketsConnected = new Set();

//socket.io server configuration
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

//socket.io event listeners
io.on("connection", onConnect);

function onConnect(socket: Socket): void {
  console.log(socket.id);
  socketsConnected.add(socket.id);

  io.emit("clients-total", socketsConnected.size);

  socket.on("disconnect", () => {
    socketsConnected.delete(socket.id);
    console.log(socket.id, "disconnected");
    io.emit("clients-total", socketsConnected.size);
  });

  socket.on("send-message", (data) => {
    console.log(data);
    socket.broadcast.emit("chat-message", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });
}

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
