import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import Game from "./Game";
import io from "socket.io-client";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { get, post } from "./utilities.js";
import axios from "axios";
const socket = io("http://localhost:9000");

function App() {
  const [playerData, setPlayerData] = useState({});
  const [code, setCode] = useState(
    "#write a function that adds two terms together \n def(a,b): \n if __main__ ..."
  );

  const [tower, setTower] = useState(0);
  const [IDEstatus, setIDEStatus] = useState(false);

  const toggleIDE = () => {
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
    axios.post("http://localhost:9000/submitCode/", { code }).then((res) => {
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
  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("newPlayer", { x: 100, y: 100, rad: 5 });
    });
    // return () => {
    //   socket.off("connect");
    //   socket.off("disconnect");
    // };
  }, []);

  socket.on("updateFromServer", (data) => {
    setPlayerData(data);
    // console.log("On Client:", data[socket.id]);
    // console.log("On Client playerData:", playerData.x);
  });

  const fromClientToServer = (childdata) => {
    socket.emit("updateFromClient", childdata);
  };

  return (
    <div>
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
      <Game
        playerData={playerData}
        fromClientToServer={fromClientToServer}
        toggleIDE={toggleIDE}
        tower={tower}
        IDEstatus={IDEstatus}
      />
    </div>
  );
}

export default App;
