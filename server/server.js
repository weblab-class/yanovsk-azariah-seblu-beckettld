/*
|--------------------------------------------------------------------------
| server.js -- The core of your server
|--------------------------------------------------------------------------
|
| This file defines how your server starts up. Think of it as the main() of your server.
| At a high level, this file does the following things:
| - Connect to the database
| - Sets up server middleware (i.e. addons that enable things like json parsing, user login)
| - Hooks up all the backend routes specified in api.js
| - Fowards frontend routes that should be handled by the React router
| - Sets up error handling in case something goes wrong when handling a request
| - Actually starts the webserver
*/

// validator runs some basic checks to make sure you've set everything up correctly
// this is a tool provided by staff, so you don't need to worry about it
const PORT = process.env.PORT || 3000;

const validator = require("./validator");
validator.checkSetup();
const fs = require("fs");
const PythonShell = require("python-shell").PythonShell;

require("dotenv").config();
//import libraries needed for the webserver to work!
const express = require("express"); // backend framework for our node server.
const socketIo = require("socket.io");

const app = express();
const session = require("express-session"); // library that stores info about each connected user
const mongoose = require("mongoose"); // library to connect to MongoDB
const path = require("path"); // provide utilities for working with file and directory paths
const cors = require("cors");
const { makeid } = require("./utils");

// socket stuff
// const socketManager = require("./server-socket");
const Problem = require("./models/problem.js");

// Server configuration below
// TODO change connection URL after setting up your team database
const mongoConnectionURL = process.env.MONGO_SRV;
// TODO change database name to the name you chose
const databaseName = "Cluster0";

let players = {};
let clientRooms = {};

// connect to mongodb
mongoose
  .connect(mongoConnectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: databaseName,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(`Error connecting to MongoDB: ${err}`));

// create a new express server
app.use(validator.checkRoutes);

// allow us to process POST requests
app.use(express.json());
app.use(cors());

// set up a session, which will persist login data across requests
app.use(
  session({
    // TODO: add a SESSION_SECRET string in your .env file, and replace the secret with process.env.SESSION_SECRET
    secret: "session-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/problem", (req, res) => {
  console.log("req params below:");
  console.log(req.query);
  const currentProblem = Problem.find({ version: "mvp" }).then((problem) => {
    res.send(problem[2].problemText);
  });
});
app.post("/problem", (req, res) => {
  const newProblem = new Problem({
    problemText: req.body.problemText,
    testCases: req.body.testCases,
    version: req.body.version,
    difficulty: req.body.difficulty,
  });

  newProblem.save().then(() => {
    res.send(req.body);
  });
});

app.post("/submitCode", async (req, res) => {
  fs.writeFileSync("test.py", req.body.code);
  console.log(req.body.code);
  const currentProblem = await Problem.find({
    _id: "63cec436f69993f5b4ecebb6",
  });
  // console.log(currentProblem);

  const testCases = currentProblem[0].testCases;

  const promises = [];
  const testCaseResults = [];

  Object.keys(testCases).map((key) => {
    promises.push(
      new Promise((resolve, reject) => {
        PythonShell.run(
          "test.py",
          {
            mode: "text",
            pythonOptions: ["-u"],
            args: testCases[key],
          },
          function (err, results) {
            if (err) {
              reject(err.message);
            } else {
              if (results) {
                testCaseResults.push(results[0]);
                resolve(true);
              }
            }
          }
        );
      })
    );
  });
  Promise.all(promises)
    .then(() => {
      let overallResult = true;
      for (result of testCaseResults) {
        if (result === "False") {
          overallResult = false;
          break;
        }
      }
      res.json({ testCaseResults, overallResult });
    })
    .catch((err) => {
      console.log(err);
      res.json({ error: err });
    });
});

// load the compiled react files, which will serve /index.html and /bundle.js
const reactPath = path.resolve(__dirname, "..", "client", "dist");
app.use(express.static(reactPath));

// for all other routes, render index.html and let react router handle it
app.get("*", (req, res) => {
  res.sendFile(path.join(reactPath, "index.html"));
});

// any server errors cause this function to run
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) {
    // 500 means Internal Server Error
    console.log("The server errored when processing a request!");
    console.log(err);
  }

  res.status(status);
  res.send({
    status: status,
    message: err.message,
  });
});
// +++++++SOCKET STUFF++++++++

var http = require("http");
var server = http.createServer(app);

const io = socketIo(server);

io.on("connection", connected);

function connected(socket) {
  socket.on("disconnect", () => {
    delete players[socket.id];

    console.log(`<---- DISCONNECTED: ${socket.id}, `);
    console.log(`Currently: ${Object.keys(players).length} player(s): `);
    console.log(`<---- DISCONNECTED: ${socket.id}, `);
    console.log(`Currently: ${Object.keys(players).length} player(s): `);

    for (const [key, value] of Object.entries(players)) {
      console.log(`${key}: ${Object.entries(value)}`);
    }

    io.emit("updateFromServer", players);
  });

  socket.on("updateFromClient", (data) => {
    if (data === "Up" && players[socket.id]) {
      players[socket.id].y -= 3;
    }

    if (data === "Down" && players[socket.id]) {
      players[socket.id].y += 3;
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
}

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
