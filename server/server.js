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
let socketToRoom = {};
let allGameStates = {};
let allTowers = {};

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
  const problem = Problem.find({ version: "mvp" }).then((problem) => {
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
    room_id = socketToRoom[socket.id];
    if (room_id) {
      delete allGameStates[room_id][socket.id];
      io.to(`${room_id}`).emit("updateFromServer", allGameStates[room_id]);
    }
  });

  socket.on("playerLeft", () => {
    room_id = socketToRoom[socket.id];
    if (room_id) {
      delete allGameStates[room_id][socket.id];
      io.to(`${room_id}`).emit("updateFromServer", allGameStates[room_id]);
    }
    socket.disconnect();
  });

  socket.on("updateFromClient", (data) => {
    room_id = socketToRoom[socket.id];
    if (data === "Up") {
      allGameStates[room_id][socket.id].position.y -= 5;
    } else if (data === "Down") {
      allGameStates[room_id][socket.id].position.y += 5;
    } else if (data === "Right") {
      allGameStates[room_id][socket.id].position.x += 5;
    } else if (data === "Left") {
      allGameStates[room_id][socket.id].position.x -= 5;
    } else {
      if (data in ["1", "2", "3", "4", "5"]) {
        const numData = parseInt(data);
        if (allGameStates[room_id][socket.id].tower_status[numData] == 0) {
          allGameStates[room_id][socket.id].tower_status[numData] = 1;
          allGameStates[room_id][socket.id].score += 1;
        }
      }
    }

    io.to(`${room_id}`).emit("updateFromServer", allGameStates[room_id]);
  });

  const initGameState = (room_id, socket_id, socket_number) => {
    if (socket_number === 1) {
      allGameStates[room_id] = {};
      allGameStates[room_id][socket_id] = {
        position: { x: 100, y: 100 },
        tower_status: [0, 0, 0, 0, 0],
        score: 0,
      };
      socket.emit("assignedRoomId", room_id);
    }
    if (socket_number === 2) {
      allGameStates[room_id][socket_id] = {
        position: { x: 110, y: 110 },
        tower_status: [0, 0, 0, 0, 0],
        score: 0,
      };
    }
  };

  const handleNewRoom = () => {
    let room_id = makeid(5);
    socketToRoom[socket.id] = room_id;
    socket.join(room_id);
    socket.number = 1;
    initGameState(room_id, socket.id, 1);

    io.to(`${room_id}`).emit("init", 1);
    io.to(`${room_id}`).emit("updateFromServer", allGameStates[room_id]);
  };

  const handleJoinRoom = async (room_id) => {
    let numPlayers;
    if (allGameStates[room_id]) {
      numPlayers = Object.keys(allGameStates[room_id]).length;
    }

    if (numPlayers === 0 || numPlayers === undefined) {
      socket.emit("badConnection", "Room Code Doesn't Exist");
      return;
    } else if (numPlayers > 1) {
      socket.emit("badConnection", "Too many players");
      return;
    } else {
      socket.join(room_id);
      socketToRoom[socket.id] = room_id;
      socket.number = 2;
      initGameState(room_id, socket.id, 2);
    }

    const towerQuestions = await Problem.find({ version: "mvp" });
    allTowers[room_id] = {
      0: {
        questionID: towerQuestions[0]._id,
        questionCode: towerQuestions[0].problemText,
        position: { x: 320, y: 300 },
      },
      1: {
        questionID: towerQuestions[1]._id,
        questionCode: towerQuestions[1].problemText,
        position: { x: 500, y: 100 },
      },
      2: {
        questionID: towerQuestions[2]._id,
        questionCode: towerQuestions[2].problemText,
        position: { x: 282, y: 119 },
      },
      3: {
        questionID: towerQuestions[3]._id,
        questionCode: towerQuestions[3].problemText,
        position: { x: 581, y: 300 },
      },
    };

    io.to(`${room_id}`).emit("init", 2);
    io.to(`${room_id}`).emit("initTowers", allTowers[room_id]);
    io.to(`${room_id}`).emit("updateFromServer", allGameStates[room_id]);
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
  res.send(req.user);
});

app.post("/login", auth.login);
app.post("/logout", auth.logout);

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
