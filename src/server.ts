import express from "express";
import * as http from "http";
import socket from "socket.io";

const server = http.createServer(express());
const io = socket(server);

const users: { [socket_id: string]: string } = {};
io.on("connection", (socket) => {
  socket.on("user-join", ({ username }) => {
    users[socket.id] = username;
    socket.emit("new-player", { users: [...Object.values(users)] });
    socket.emit("log", { message: `${username} joined` });
  });
});

export default io;
