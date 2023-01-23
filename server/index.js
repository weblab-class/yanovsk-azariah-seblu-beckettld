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

io.on("connection", (socket) => {
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

  // socket.on("newPlayer", (data) => {
  //   console.log(
  //     `-----> CONNECTED: ${socket.id}. start pos: ${data.x}, ${data.y} rad: ${data.rad}`
  //   );
  //   console.log(`Currently: ${Object.keys(players).length} player(s): `);

  //   for (const [key, value] of Object.entries(players)) {
  //     console.log(`${key}: ${Object.entries(value)}`);
  //   }
  //   io.emit("updateFromServer", players);
  // });

  //ROOMS
  //handleNewRomm is a callback function
  const handleNewRoom = () => {
    players[socket.id] = { x: 100, y: 100, rad: 5 };
    console.log(`-----> HandleNew: ${socket.id}`);
    let roomId = makeid(5); //call makeId from utils.js to generate random 5 digit ID
    clientRooms[socket.id] = roomId;
    socket.emit("roomId", roomId);
    //state[roomId] = initGame()
    socket.join(roomId);
    console.log(io.sockets.adapter.rooms);
    console.log(io.sockets.adapter.rooms.get(roomId));

    socket.number = 1;
    io.emit("init", 1);
    io.emit("updateFromServer", players);
  };

  const handleJoinRoom = (room_id) => {
    console.log(`-> Handle Join: ${socket.id}`);
    const room = io.sockets.adapter.rooms.get(room_id);
    console.log("Room: ", room);
    players[socket.id] = { x: 110, y: 110, rad: 5 };

    clientRooms[socket.id] = room_id;
    socket.join(room_id);
    socket.number = 2;
    io.emit("init", 2);
    io.emit("updateFromServer", players);
  };

  socket.on("newRoom", handleNewRoom);
  socket.on("joinRoom", handleJoinRoom);
});

server.listen(9000, () => {
  console.log("listening on *:9000");
});
