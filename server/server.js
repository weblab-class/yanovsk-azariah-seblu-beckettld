const PORT = process.env.PORT || 3000;
const validator = require("./validator");
validator.checkSetup();
require("dotenv").config();
//==========LIBRARIES===========//
const fs = require("fs");
const PythonShell = require("python-shell").PythonShell;
const express = require("express");
const socketIo = require("socket.io");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
//==========FILES===========//
const { makeid } = require("./utils");
const Problem = require("./models/problem.js");
const auth = require("./auth");
//==========STORAGE===========//
let players = {};
let socketToRoom = {};
let allGameStates = {};
let canvaslength = "1000px";
let canvasheight = "600px";

app.use(validator.checkRoutes);
app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: "session-secret",
    resave: false,
    saveUninitialized: false,
  })
);

//==========MONGO DB===========//
const mongoConnectionURL = process.env.MONGO_SRV;

const databaseName = "Cluster0";

mongoose
  .connect(mongoConnectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: databaseName,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(`Error connecting to MongoDB: ${err}`));

app.get("/problem", (req, res) => {
  console.log("tig");
  const problem = Problem.find({ version: "mvp" }).then((problem) => {
    console.log(Math.floor(Math.random() * Object.keys(problem).length));
    const random = Math.floor(Math.random() * Object.keys(problem).length);
    res.json({ problemText: problem[random].problemText, questionID: problem[random]._id });
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
    _id: req.body.questionID,
  });
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

//==========SERVER ===========//
const reactPath = path.resolve(__dirname, "..", "client", "dist");
app.use(express.static(reactPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(reactPath, "index.html"));
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) {
    console.log("The server errored when processing a request!");
    console.log(err);
  }

  res.status(status);
  res.send({
    status: status,
    message: err.message,
  });
});

//==========SOCKETS===========//

var http = require("http");
var server = http.createServer(app);
const io = socketIo(server);

io.on("connection", connected);

function connected(socket) {
  socket.on("disconnect", () => {
    delete players[socket.id];
    console.log(`<---- DISCONNECTED: ${socket.id}, `);
    io.emit("updateFromServer", players);
  });

  socket.on("playerLeft", () => {
    delete players[socket.id];
    io.emit("updateFromServer", players);
  });

  socket.on("updateFromClient", (data) => {
    if (data === "Up" && players[socket.id]) {
      players[socket.id].y -= 1;
    } else if (data === "Down" && players[socket.id]) {
      players[socket.id].y += 1;
    } else if (data === "Right" && players[socket.id]) {
      players[socket.id].x += 1;
    } else if (data === "Left" && players[socket.id]) {
      players[socket.id].x -= 1;
    }
    io.emit("updateFromServer", players);
  });

  const initGameState = (room_id, socket_id, socket_number) => {
    if (socket_number === 1) {
      // allGameStates.room_id.socket_id_1 = socket_id;
      allGameStates[room_id] = {
        [socket_id]: {
          position: { x: 100, y: 100, rad: 5 },
          tower_status: [0, 0, 0],
        },
      };
      //allGameStates.room_id.socket_id_1.position = { x: 100, y: 100, rad: 5 };
      //allGameStates.room_id.socket_id_1.tower_status = [0, 0, 0];
      console.log(allGameStates[room_id][socket_id]);
    }
  };

  const handleNewRoom = () => {
    players[socket.id] = { x: 100, y: 100, rad: 5 };
    console.log(`-----> HandleNew: ${socket.id}`);
    let room_id = makeid(5);
    socketToRoom[socket.id] = room_id;
    socket.emit("room_id", room_id);
    socket.join(room_id);
    socket.number = 1;
    initGameState(room_id, socket, 1);

    io.emit("init", 1);
    io.emit("updateFromServer", players);
  };

  const handleJoinRoom = (room_id) => {
    console.log(`-> Handle Join: ${socket.id}`);
    const room = io.sockets.adapter.rooms.get(room_id);
    players[socket.id] = { x: 110, y: 110, rad: 5 };
    //clientRooms[socket.id] = room_id;
    socket.join(room_id);
    socket.number = 2;
    io.emit("init", 2);
    io.emit("updateFromServer", players);
  };

  socket.on("newRoom", handleNewRoom);
  socket.on("joinRoom", handleJoinRoom);
}

//==========GOOGLE AUTH===========//
app.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }
  console.log(req.user);
  res.send(req.user);
});

app.post("/login", auth.login);
app.post("/logout", auth.logout);

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
