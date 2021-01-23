const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const {
  createGameState,
  gameLoop,
  handleMovement,
  initGame,
} = require("./game");

const { makeId } = require("./utils");

app.set("port", 3000);
app.use("/", express.static("../frontend"));

app.get("/", function (request, response) {
  response.sendFile(path.join(__dirname, "/index.html"));
});

// Starts the server.
server.listen(3000, function () {
  console.log("Starting server on port 3000");
});

const FRAME_RATE = 60;
const state = {};
const clientRooms = {};

io.on("connection", (client) => {

  client.on("movement", (data) =>
    handleMovement(data, state, client, clientRooms)
  );
  client.on("newGame", () => handleNewGame(client));
  client.on("joinGame", (roomName) => handleJoinGame(roomName, client));
});

function startGameInterval(roomName) {
  const intervalId = setInterval(() => {
    const winner = gameLoop(state[roomName]);

    if (!winner) {
      emitGameState(roomName, state[roomName]);
    } else {
      emitGameOver(roomName, winner);
      state[roomName] = null;
      clearInterval(intervalId);
    }
  }, 1000 / FRAME_RATE);
}

function emitGameState(roomName, state) {
  io.sockets.in(roomName).emit("gameState", JSON.stringify(state));
}

function emitGameOver(roomName, winner) {
  io.sockets.in(roomName).emit("gameOver", JSON.stringify({ winner }));
}

function handleNewGame(client) {
  let roomName = makeId(5);
  clientRooms[client.id] = roomName;
  client.emit("gameCode", roomName);
  state[roomName] = initGame();

  client.join(roomName);
  client.number = 1;
  client.emit("init", 1);
}

function handleJoinGame(roomName, client) {
  if(io.sockets.adapter.rooms.get(roomName) === undefined){
    client.emit("unknownGame");
    return;
  }
  const room = Array.from(io.sockets.adapter.rooms.get(roomName));

  let numClients = 0;

  if (room.length) {
    numClients = room.length;
  }

  if (numClients == 0) {
    client.emit("unknownGame");
    return;
  } else if (numClients > 1) {
    client.emit("tooManyPlayers");
    return;
  }

  clientRooms[client.id] = roomName;
  client.join(roomName);
  client.number = 2;
  client.emit("init", 2);

  startGameInterval(roomName);
}
