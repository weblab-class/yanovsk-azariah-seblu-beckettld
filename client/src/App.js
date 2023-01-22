import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import Game from "./Game";
import io from "socket.io-client";

const socket = io("http://localhost:9000");

function App() {
  const [playerData, setPlayerData] = useState({});

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("newPlayer", { x: 100, y: 100, rad:5 });
    });
    // return () => {
    //   socket.off("connect");
    //   socket.off("disconnect");
    // };
  }, []);

  socket.on("updateFromServer", (data) => {
    setPlayerData(data[socket.id])
    console.log("On Client:", data[socket.id])
    console.log("On Client playerData:", playerData.x)

  });

  const fromClientToServer = (childdata) => {
    socket.emit("updateFromClient", childdata);
  };

  return (
    <div>
      <p style={{color: "#ffffff"}}>{'Players x:' + playerData.x +'y' + playerData.y }</p>
      <Game playerData={playerData} fromClientToServer={fromClientToServer} /> 
    </div>
  );
}

export default App;
