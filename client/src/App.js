import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import { get, post } from "./utilities.js";
import Game from "./Game";
import io from "socket.io-client";

const socket = io("http://localhost:9000");

function App() {
  const [playerData, setPlayerData] = useState({});

  useEffect(() => {
    socket.on("connect", () => {});

    socket.on("disconnect", () => {});

    socket.emit("newPlayer", { x: 100, y: 100, rad:5 });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };

  }, []);

  //need function to get players coordianted from canvas and emit to server

  socket.on("updatePlayers", (data) => {

  });

  socket.on("update1", (data) => {

    setPlayerData(data[socket.id])
    console.log(playerData)
  })

  const sendPlayerInput = (childdata) => {
    console.log("sendplayerinput",childdata)
    socket.emit("update", childdata);
  };
  // const socketSend = () => {};

  return (
    <div>
      <p style={{color: "#ffffff"}}>Connected: { 'Player HERE:' + playerData.x }</p>

      <Game playerData={playerData} sendPlayerInput={sendPlayerInput} /> 
    </div>
  );
}

export default App;
