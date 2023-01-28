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
let canvasWidth = 1300;
let canvasHeight = 700;
let playerRadius = 30;
let towerHeight = 25;
let towerWidth = 25;
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
  const currentProblem = await Problem.find({
    _id: req.body.questionID,
  });

  fs.writeFileSync("test.py", req.body.code + currentProblem[0].problemScript);
  console.log(req.body.code + currentProblem[0].problemScript);
  const testCases = currentProblem[0].testCases;
  const promises = [];
  const testCaseResults = [];
  const testCaseResultsWithMessages = [];
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
                const messageString = `Input(s): (${testCases[key]
                  .slice(0, testCases[key].length - 1)
                  .join(")  (")}) | Expected Output: ${results[0]} | Got: ${results[1]}`;
                testCaseResults.push(results[2] == "True");
                const resultBool = results[2];
                const testObj = {};
                testObj[resultBool] = messageString;
                testCaseResultsWithMessages.push(testObj);
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
        if (result === false) {
          overallResult = false;
          break;
        }
      }
      res.json({ overallResult, testCaseResultsWithMessages });
    })
    .catch((err) => {
      console.log(err);
      res.json({ error: err.split(",")[1] });
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

//==========COLLISIONS
const adjustLeft = (player, room_id) => {
  const towerData = allTowers[room_id];

  if (player.position.x + playerRadius >= canvasWidth) {
    player.position.x = canvasWidth - playerRadius - 1;
  }
  for (const [key, value] of Object.entries(towerData)) {
    if (
      player.position.x + playerRadius === value.position.x && //TOUCHING LEFT
      !(player.position.y + playerRadius <= value.position.y) && // NOT TO THE TOP
      !(player.position.y - playerRadius >= value.position.y + towerHeight) //NOT TO THE BOTTOM
    ) {
      player.position.x -= 1;
    }
  }
};
const adjustRight = (player, room_id) => {
  const towerData = allTowers[room_id];

  if (player.position.x - playerRadius <= 0) {
    player.position.x = 1 + playerRadius;
  }
  for (const [key, value] of Object.entries(towerData)) {
    if (
      player.position.x - playerRadius === value.position.x + towerWidth && //TOUCHING RIGHT
      !(player.position.y + playerRadius <= value.position.y) && // NOT TO THE TOP
      !(player.position.y - playerRadius >= value.position.y + towerHeight) //NOT TO THE BOTTOM
    ) {
      player.position.x += 1;
    }
  }
};
const adjustUp = (player, room_id) => {
  const towerData = allTowers[room_id];

  if (player.position.y + playerRadius >= canvasHeight) {
    player.position.y = canvasHeight - playerRadius - 1;
  }
  for (const [key, value] of Object.entries(towerData)) {
    if (
      player.position.y + playerRadius === value.position.y && //TOUCHING TOP
      !(player.position.x - playerRadius >= value.position.x + towerWidth) && // NOT TO THE RIGHT
      !(player.position.x + playerRadius <= value.position.x) //NOT TO THE LEFT
    ) {
      player.position.y -= 1;
    }
  }
};
const adjustDown = (player, room_id) => {
  const towerData = allTowers[room_id];
  if (player.position.y - playerRadius <= 0) {
    player.position.y = 1 + playerRadius;
  }
  for (const [key, value] of Object.entries(towerData)) {
    if (
      player.position.y - playerRadius === value.position.y + towerHeight && //TOUCHING BOTTOM
      !(player.position.x - playerRadius >= value.position.x + towerWidth) && // NOT TO THE RIGHT
      !(player.position.x + playerRadius <= value.position.x) //NOT TO THE LEFT
    ) {
      player.position.y += 1;
    }
  }
};

//==========SOCKETS===========//
var http = require("http");
var server = http.createServer(app);
const io = socketIo(server);

io.on("connection", connected);

function connected(socket) {
  const handleNewRoom = () => {
    try {
      let room_id = makeid(5);
      socketToRoom[socket.id] = room_id;
      socket.join(room_id);
      socket.number = 1;
      socket.emit("assignedRoomId", room_id);
      io.to(`${room_id}`).emit("newPlayerInRoom", 1);
    } catch (err) {
      console.log(err);
      socket.emit("assignedRoomId", `ERROR ${err}`);
    }
  };

  const handleJoinRoom = (room_id) => {
    const room = io.sockets.adapter.rooms.get(room_id);
    let numPlayers;

    if (room) {
      numPlayers = io.sockets.adapter.rooms.get(room_id).size;
    }
    if (numPlayers === 0 || numPlayers === undefined || room === undefined) {
      socket.emit("badConnection", "Room Code Doesn't Exist");
      return;
    } else if (numPlayers > 1) {
      socket.emit("badConnection", "Too many players");
      return;
    } else {
      socket.join(room_id);
      socketToRoom[socket.id] = room_id;
      socket.number = 2;
      io.to(`${room_id}`).emit("newPlayerInRoom", 2);
    }
  };

  const initTowers = async (map_id) => {
    //knowing map_id we can find question by level of hardness
    const towerQuestions = await Problem.find({ version: "mvp" });

    allTowers[room_id] = {
      0: {
        questionID: towerQuestions[0]._id,
        questionCode: towerQuestions[0].problemText,
        questionScript: towerQuestions[0].problemScript,
        position: { x: 320, y: 300 },
      },
      1: {
        questionID: towerQuestions[1]._id,
        questionCode: towerQuestions[1].problemText,
        questionScript: towerQuestions[1].problemScript,
        position: { x: 500, y: 100 },
      },
      2: {
        questionID: towerQuestions[2]._id,
        questionCode: towerQuestions[2].problemText,
        questionScript: towerQuestions[2].problemScript,
        position: { x: 282, y: 119 },
      },
      3: {
        questionID: towerQuestions[3]._id,
        questionCode: towerQuestions[3].problemText,
        questionScript: towerQuestions[3].problemScript,
        position: { x: 581, y: 300 },
      },
    };
    io.to(`${room_id}`).emit("initTowers", allTowers[room_id]);
    io.to(`${room_id}`).emit("updateFromServer", allGameStates[room_id]);
  };

  const handleInitGameState = ({ mapSelection, spriteSelection }) => {
    room_id = socketToRoom[socket.id];
    if (room_id && allGameStates[room_id] === undefined) {
      allGameStates[room_id] = {};
      allGameStates[room_id][socket.id] = {
        position: { x: 100, y: 100 },
        tower_status: [0, 0, 0, 0],
        score: 0,
        sprite_id: spriteSelection,
        map_id: mapSelection,
      };
    } else if (room_id && allGameStates[room_id]) {
      allGameStates[room_id][socket.id] = {
        position: { x: 110, y: 110 },
        tower_status: [0, 0, 0, 0],
        score: 0,
        sprite_id: spriteSelection,
        map_id: mapSelection,
      };
      let maps = [];
      for (const [key, value] of Object.entries(allGameStates[room_id])) {
        maps.push(value.map_id);
      }
      let random_map_id = maps[Math.floor(Math.random() * 2)];
      io.to(`${room_id}`).emit("startGame", random_map_id); //emit random map from maps array to Game.js
      io.to(`${room_id}`).emit("updateFromServer", allGameStates[room_id]);
      initTowers(random_map_id);
    }
  };

  const handleUpdateFromClient = (data) => {
    room_id = socketToRoom[socket.id];

    if (room_id) {
      const player = allGameStates[room_id][socket.id];

      for (let i = 0; i < 5; i++) {
        if (data === "Up") {
          allGameStates[room_id][socket.id].position.y -= 1;
          adjustDown(player, room_id);
        } else if (data === "Down") {
          allGameStates[room_id][socket.id].position.y += 1;
          adjustUp(player, room_id);
        } else if (data === "Right") {
          allGameStates[room_id][socket.id].position.x += 1;
          adjustLeft(player, room_id);
        } else if (data === "Left") {
          allGameStates[room_id][socket.id].position.x -= 1;
          adjustRight(player, room_id);
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
      }
    }
  };

  const handlePlayerLeft = () => {
    if (socket.id !== undefined) {
      room_id = socketToRoom[socket.id];
      if (room_id !== undefined) {
        delete allGameStates[room_id][socket.id];
        delete socketToRoom[socket.id];
        io.to(`${room_id}`).emit("updateFromServer", allGameStates[room_id]);
      }
    }
    socket.disconnect();
  };

  const handleDisconnect = () => {
    room_id = socketToRoom[socket.id];
    if (allGameStates[room_id]) {
      try {
        delete allGameStates[room_id][socket.id];
        delete socketToRoom[socket.id];
        io.to(`${room_id}`).emit("updateFromServer", allGameStates[room_id]);
      } catch (e) {
        console.log(e);
      }
    }
  };

  socket.on("newRoom", handleNewRoom);
  socket.on("joinRoom", handleJoinRoom);
  socket.on("initGameState", handleInitGameState);
  socket.on("updateFromClient", handleUpdateFromClient);
  socket.on("playerLeft", handlePlayerLeft);
  socket.on("disconnect", handleDisconnect);
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
