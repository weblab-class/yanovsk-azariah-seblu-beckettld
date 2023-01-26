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
const url = "https://codeleg.herokuapp.com";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// const url = "http://localhost:3000";
// const GOOGLE_CLIENT_ID = "306684833672-t1s937mqipgfc70n6r022gl7rm0sh6rh.apps.googleusercontent.com";

const socket = io();

const App = () => {
  const [playerData, setPlayerData] = useState({});
  const [towerData, setTowerData] = useState({});
  const [playerNumber, setPlayerNumber] = useState(0);
  const [roomId, setRoomId] = useState("");
  const [isActive, setActive] = useState(false);
  const [code, setCode] = useState("");
  const [questionID, setQuestionID] = useState(0);
  const [tower, setTower] = useState(0);
  const [IDEstatus, setIDEStatus] = useState(false);
  const [userId, setUserId] = useState(undefined);
  const [canvasHeight, setCanvasHeight] = useState("500px");
  const [canvasWidth, setCanvasWidth] = useState("800px");
  const [roomConnection, setRoomConnection] = useState("");
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
  const toggleIDE = () => {
    axios
      .get(url + "/problem", {
        params: {},
      })
      .then((res) => {
        setCode(res.data.problemText);
        setQuestionID(res.data.questionID);
      });
    setIDEStatus(!IDEstatus);
    const IDE = document.getElementById("overlay");
    if (IDE.className == "inactive") IDE.className = "active";
    else IDE.className = "inactive";
  };

  const onChange = (value, viewUpdate) => {
    setCode(value);
  };

  const submitCode = () => {
    console.log({ code });
    axios
      .post(url + "/submitCode", {
        code: code,
        questionID: questionID,
      })
      .then((res) => {
        if (res.data.error) {
          console.log(res.data.error);
        } else {
          console.log(res.data.testCaseResults);
          console.log(res.data.overallResult);
          if (res.data.overallResult === true) {
            console.log("You got them all right!");
            setTower(1);
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
            tower={tower}
            IDEstatus={IDEstatus}
            canvasHeight={canvasHeight}
            canvasWidth={canvasWidth}
            towerData={towerData}
            code={code}
            onChange={onChange}
            toggleIDE={toggleIDE}
            handleLogout={handleLogout}
          />
        }
      />
      <Route path="thankyou" element={<ThankYou />} />
    </Routes>
  );
};

export default App;
