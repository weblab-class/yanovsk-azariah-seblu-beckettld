import "./pages/App.css";
import React, { useState, useEffect } from "react";
import Game from "./pages/Game.js";
import io from "socket.io-client";
import Lobby from "./pages/Lobby";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import axios from "axios";
//import dotenv from "dotenv";
/**
 * Define the "App" component
 */
//const endpoint = "https://skeletongame.herokuapp.com/" + process.env.port;
const socket = io();

const App = () => {
  const [playerData, setPlayerData] = useState({});
  const [playerNumber, setPlayerNumber] = useState(0);
  const [roomId, setRoomId] = useState("");
  const [isActive, setActive] = useState(false);
  const [code, setCode] = useState({ problemText: "", questionID: 0 });

  const [tower, setTower] = useState(0);
  const [IDEstatus, setIDEStatus] = useState(false);

  const toggleIDE = () => {
    //console.log(window.location.hostname);
    // questionID: "63cec436f69993f5b4ecebb6";
    axios
      .get("http://localhost:9000", {
        // .get("https://skeletongame.herokuapp.com/problem", {
        params: {},
      })
      .then((res) => {
        console.log(res.data);
        setCode(res.data);
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
      .post("http://localhost:9000/submitCode", {
        // .post("https://skeletongame.herokuapp.com/submitCode/", {
        code: code.problemText,
        questionID: code.questionID,
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

  // useEffect(() => {
  //   socket.on("connect", () => {
  //     console.log(socket.id);
  //   });
  //   // return () => {
  //   //   socket.off("connect");
  //   //   socket.off("disconnect");
  //   // };
  // }, []);

  socket.on("updateFromServer", (data) => {
    setPlayerData(data);
  });

  const fromClientToServer = (childdata) => {
    socket.emit("updateFromClient", childdata);
  };

  const createNewRoom = () => {
    socket.emit("newRoom");
  };

  const joinRoom = (room_id) => {
    console.log("join room called", room_id);
    socket.emit("joinRoom", room_id);
  };

  socket.on("init", (number) => {
    console.log("HIT");
    setPlayerNumber(number);
  });

  useEffect(() => {
    if (playerNumber === 2) {
      setActive(true);
    }
  }, [playerNumber]);

  socket.on("roomId", (id) => {
    setRoomId(id);
  });

  return (
    <div>
      {isActive ? (
        <>
          <Game
            playerData={playerData}
            fromClientToServer={fromClientToServer}
            toggleIDE={toggleIDE}
            tower={tower}
            IDEstatus={IDEstatus}
          />
          <h1>Game Started</h1>
          <div className="inactive" id="overlay">
            <button onClick={toggleIDE}>Close</button>
            <CodeMirror
              value={code}
              height="600px"
              theme="dark"
              options={{ theme: "sublime" }}
              extensions={[python()]}
              onChange={onChange}
            />
            <button onClick={submitCode}>Submit</button>
          </div>
        </>
      ) : (
        <Lobby createNewRoom={createNewRoom} roomId={roomId} joinRoom={joinRoom} />
      )}
    </div>
  );
};

export default App;
