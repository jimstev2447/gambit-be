import express from "express";
import * as http from "http";
import socket from "socket.io";
import { Player } from "./classes/Player";
import { Game } from "./classes/Game";

const server = http.createServer(express());
const io = socket(server);

const users: {
  [socket_id: string]: { username: string; isReady: boolean };
} = {};
let gameAvailable = false;
let game: Game;

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);
  users[socket.id] = { username: socket.id, isReady: false };
  socket.on("new-user", ({ username }) => {
    users[socket.id] = { username, isReady: false };
    io.emit("user-update", { users: [...Object.values(users)] });
    io.emit("game-log", { message: `${username}: Joined` });
  });
  socket.on("update-user", ({ username }) => {
    const user = users[socket.id];
    user.username = username;
    io.emit("user-update", { users: [...Object.values(users)] });
    io.emit("game-log", { message: `${username}: updated their username` });
  });
  socket.on("new-game", () => {
    const players = Object.values(users).map(
      ({ username }) => new Player(username)
    );
    game = new Game(players);
    game.startGame();
    console.log("sending game");
    io.emit("game-update", { game });
  });
  socket.on("user-ready", ({ isReady }) => {
    const user = users[socket.id];
    user.isReady = isReady;
    if (
      Object.values(users).length >= 4 &&
      Object.values(users).every(({ isReady }) => isReady)
    ) {
      gameAvailable = true;
      io.emit("game-available", { gameAvailable });
    } else {
      io.emit("game-available", { gameAvailable });
    }
    io.emit("game-log", {
      message: `${user.username}: ${isReady ? "is ready" : "is not ready"}`,
    });
  });
  socket.on("user-vote", ({ voter, votee }) => {
    console.log(`${voter} voted for ${votee}`);
    game.castVote(voter, votee);
    io.emit("game-update", { game });
  });
  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
    const user = users[socket.id];
    delete users[socket.id];
    const userArr = Object.values(users);
    if (userArr.length < 4 || !userArr.every(({ isReady }) => isReady)) {
      gameAvailable = false;
      io.emit("game-available", { gameAvailable });
    }
    io.emit("game-log", { message: `${user.username}: Left the game` });
    io.emit("user-update", { users: [...Object.values(users)] });
  });
});

export default io;
