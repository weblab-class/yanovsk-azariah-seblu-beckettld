const validator = require("./validator");
validator.checkSetup();
require("dotenv").config();
//==========LIBRARIES===========//
const express = require("express");
const socketIo = require("socket.io");
const fs = require("fs");
const PythonShell = require("python-shell").PythonShell;
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

//==========FILES===========//
const { makeid } = require("./utils");
const Problem = require("./models/problem.js");
const auth = require("./auth");

//==========MISC===========//
const PORT = process.env.PORT || 3000;
const app = express();
app.use(validator.checkRoutes);
app.use(express.json());
app.use(cors());
let players = {};
let clientRooms = {};

app.get("/", (req, res) => {
  res.send("Connected to server");
});

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

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

//==========CODE SUBMISSION===========//
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

//==========GOOGLE AUTH===========//
app.post("/login", auth.login);
app.post("/logout", auth.logout);

app.get("/whoami", (req, res) => {
  if (!req.user) {
    return res.send({});
  }
  res.send(req.user);
});

//==========SOCKETS===========//
var http = require("http");
var server = http.createServer(app);
const io = socketIo(server);

io.on("connection", connected);

function connected(socket) {
  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("updateFromServer", players);
  });

  socket.on("playerLeft", () => {
    delete players[socket.id];
    io.emit("updateFromServer", players);
  });

  socket.on("updateFromClient", (data) => {
    if (data === "Up") {
      players[socket.id].y -= 3;
    } else if (data === "Down") {
      players[socket.id].y += 3;
    } else if (data === "Right") {
      players[socket.id].x += 3;
    } else if (data === "Left") {
      players[socket.id].x -= 3;
    }
    io.emit("updateFromServer", players);
  });

  const handleNewRoom = () => {
    let roomId = makeid(5);
    players[socket.id] = { x: 100, y: 100, rad: 5 };
    clientRooms[socket.id] = roomId;
    socket.emit("roomId", roomId);
    //state[roomId] = initGame()
    socket.join(roomId);
    socket.number = 1;
    io.emit("init", 1);
    io.emit("updateFromServer", players);
  };

  const handleJoinRoom = (room_id) => {
    const room = io.sockets.adapter.rooms.get(room_id);
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
