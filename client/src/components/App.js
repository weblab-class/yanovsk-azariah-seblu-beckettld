//==========LIBRARIES===========//
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

import jwt_decode from "jwt-decode";

import { Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";

//==========COMPONENTS===========//
import Login from "./pages/Login.js";
import Game from "./pages/Game.js";
import Lobby from "./pages/Lobby.js";
import ThankYou from "./pages/ThankYou";

//==========LOCAL/HEROKU===========//
// const url = "https://codeleg.herokuapp.com";
// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const url = "http://localhost:3000";
const GOOGLE_CLIENT_ID = "306684833672-t1s937mqipgfc70n6r022gl7rm0sh6rh.apps.googleusercontent.com";

const socket = io();

const App = () => {
  const [playerData, setPlayerData] = useState({});
  const [towerData, setTowerData] = useState({});
  const [playerNumber, setPlayerNumber] = useState(0);
  const [roomId, setRoomId] = useState("");
  const [isActive, setActive] = useState(false);
  const [code, setCode] = useState("");
  const [questionID, setQuestionID] = useState(0);
  const [IDEstatus, setIDEStatus] = useState(false);
  const [userId, setUserId] = useState(undefined);
  const [canvasHeight, setCanvasHeight] = useState("500px");
  const [canvasWidth, setCanvasWidth] = useState("800px");
  const [roomConnection, setRoomConnection] = useState("");
  const [selfPlayerPosition, setSelfPlayerPosition] = useState("");
  const [selfPlayerScore, setSelfPlayerScore] = useState(0);
  const [selfTowerStatus, setSelfTowerStatus] = useState([]);

  const [currentTower, setCurrentTower] = useState(0);
  const navigate = useNavigate();

  //==========GOOGLE AUTH===========//
  useEffect(() => {
    axios.get(url + "/whoami").then((user) => {
      if (user._id) setUserId(user._id);
    });
  }, []);

  const handleLogin = (credentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);
    axios.post(url + "/login", { token: userToken }).then((user) => {
      setUserId(user.data._id);
    });
    navigate("/lobby");
  };

  const handleLogout = () => {
    navigate("/thankyou");
    //googleLogout();
    socket.emit("playerLeft");
    setUserId(undefined);
    post(url + "/logout");
  };

  //==========CODE SUBMISSION===========//

  const attemptToggleIDE = (towerCode) => {
    // axios
    //   .get(url + "/problem", {
    //     params: {},
    //   })
    //   .then((res) => {
    //     setCode(res.data.problemText);
    //     setQuestionID(res.data.questionID);
    //   });

    // setCode(res.data.problemText);
    if (selfTowerStatus[currentTower] !== 1) {
      const IDE = document.getElementById("overlay");
      IDE.className = "active";
      setCode(towerCode);
      setIDEStatus(true);
    }
  };

  const closeIDE = () => {
    towerData[currentTower].questionCode = code;
    const IDE = document.getElementById("overlay");
    IDE.className = "inactive";
    setIDEStatus(false);
  };

  const onChange = (value, viewUpdate) => {
    setCode(value);
  };

  const submitCode = () => {
    axios
      .post(url + "/submitCode", {
        code: code,
        questionID: towerData[currentTower].questionID,
      })
      .then((res) => {
        if (res.data.error) {
          console.log(res.data.error);
        } else {
          if (res.data.overallResult === true) {
            console.log("You got them all right!");
            fromClientToServer(currentTower);
            closeIDE();
          } else console.log("Too bad!");
        }
      });
  };

  //==========SOCKETS===========//
  useEffect(() => {
    if (playerNumber === 2) navigate("/game");
  }, [playerNumber]);

  useEffect(() => {
    socket.on("initTowers", (data) => {
      setTowerData(data);
    });

    socket.on("init", (number) => {
      setPlayerNumber(number);
    });

    socket.on("assignedRoomId", (id) => {
      setRoomId(id);
    });

    socket.on("badConnection", (reason) => {
      setRoomConnection(reason);
    });

    socket.on("updateFromServer", (data) => {
      for (const [key, value] of Object.entries(data)) {
        if (key === socket.id) {
          setSelfPlayerPosition(value.position);
          setSelfPlayerScore(value.score);
          setSelfTowerStatus(value.tower_status);
        }
      }

      setPlayerData(data);
    });
  }, []);

  const fromClientToServer = (childdata) => {
    socket.emit("updateFromClient", childdata);
  };

  const createNewRoom = () => {
    socket.emit("newRoom");
  };

  const joinRoom = (room_id) => {
    socket.emit("joinRoom", room_id);
  };

  return (
    <Routes>
      <Route index element={<Login handleLogin={handleLogin} handleLogout={handleLogout} />} />
      <Route
        path="lobby"
        element={
          <Lobby
            createNewRoom={createNewRoom}
            roomId={roomId}
            joinRoom={joinRoom}
            roomConnection={roomConnection}
          />
        }
      />
      <Route
        path="game"
        element={
          <Game
            playerData={playerData}
            fromClientToServer={fromClientToServer}
            IDEstatus={IDEstatus}
            canvasHeight={canvasHeight}
            canvasWidth={canvasWidth}
            towerData={towerData}
            code={code}
            onChange={onChange}
            attemptToggleIDE={attemptToggleIDE}
            handleLogout={handleLogout}
            selfPlayerPosition={selfPlayerPosition}
            selfPlayerScore={selfPlayerScore}
            submitCode={submitCode}
            setCurrentTower={setCurrentTower}
            closeIDE={closeIDE}
          />
        }
      />
      <Route path="thankyou" element={<ThankYou />} />
    </Routes>
  );
};

export default App;
