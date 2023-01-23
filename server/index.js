const express = require("express");
const app = express();
const http = require("http");
const { connect } = require("http2");
const server = http.createServer(app);
const socketIo = require("socket.io");
const { makeid } = require("./utils");

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
  },
}); //in case server and client run on different urls

let players = {};
let clientRooms = {};

app.get("/", (req, res) => {
  res.send("hello");
});

io.on("connection", connected);

function connected(socket) {
  socket.on("disconnect", () => {
    delete players[socket.id];

    console.log(`<---- DISCONNECTED: ${socket.id}, `);
    console.log(`Currently: ${Object.keys(players).length} player(s): `);

    for (const [key, value] of Object.entries(players)) {
      console.log(`${key}: ${Object.entries(value)}`);
    }

    io.emit("updateFromServer", players);
  });

  socket.on("updateFromClient", (data) => {
    if (data === "Up" && players[socket.id]) {
      players[socket.id].y += 3;
    }

    if (data === "Down" && players[socket.id]) {
      players[socket.id].y -= 3;
    }

    if (data === "Right" && players[socket.id]) {
      players[socket.id].x += 3;
    }
    if (data === "Left" && players[socket.id]) {
      players[socket.id].x -= 3;
    }
    //UNCOMMENT if you need to see how coordinates are updating
    //console.log(`Player: ${socket.id} coord.:`, players[socket.id]);
    io.emit("updateFromServer", players);
  });

  const handleKeyDown = (key) => {
    console.log(parseInt(keyCode));
  };

  socket.on("keydown", handleKeyDown);

  socket.on("newPlayer", (data) => {
    players[socket.id] = data;

    console.log(
      `-----> CONNECTED: ${socket.id}. start pos: ${data.x}, ${data.y} rad: ${data.rad}`
    );
    console.log(`Currently: ${Object.keys(players).length} player(s): `);

    for (const [key, value] of Object.entries(players)) {
      console.log(`${key}: ${Object.entries(value)}`);
    }
    io.emit("updateFromServer", players);
  });

  //ROOMS
  //handleNewRomm is a callback function
  const handleNewRoom = () => {
    let roomId = makeid(5); //call makeId from utils.js to generate random 5 digit ID
    clientRooms[socket.id] = roomId;
    socket.emit("roomId", roomId);
    //state[roomId] = initGame()
    socket.join(roomId);
    socket.number = 1;
    socket.emit("init", 1);
  };

  socket.on("newRoom", handleNewRoom);
}

server.listen(9000, () => {
  console.log("listening on *:9000");
});
