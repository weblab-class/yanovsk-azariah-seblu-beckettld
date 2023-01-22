import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import Game from "./Game";
import io from "socket.io-client";

const socket = io("http://localhost:9000");

function App() {
  const [playerData, setPlayerData] = useState({});
  const [isLoggedIn, setLoggedIn] = useState(false);

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
      <p>{"Players: " + Object.entries(playerData)}</p>
      {isLoggedIn ? (
        <Game playerData={playerData} fromClientToServer={fromClientToServer} />
      ) : (
        <p> Please enter room No</p>
      )}
    </div>
  );
}

export default App;
