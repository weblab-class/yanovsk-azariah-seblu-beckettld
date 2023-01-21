import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import { get, post } from "./utilities.js";
import Game from "./Game";
import io from "socket.io-client";

const socket = io("http://localhost:9000");

function App() {
  const [players, setPlayers] = useState(null);
  const [playerData, setPlayerData] = useState({x:90, y:90});

  useEffect(() => {
    socket.on("connect", () => {});

    socket.on("disconnect", () => {});

    socket.emit("newPlayer", { x: 100, y: 100 });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  //need function to get players coordianted from canvas and emit to server

  socket.on("updatePlayers", (data) => {
    setPlayers(data);
  });

  socket.on("update", (data) => {
    console.log("In client", data)
    setPlayerData(data)
  })

  const sendPlayerInput = (childdata) => {

    socket.emit("update", childdata);
  };
  // const socketSend = () => {};

  return (
    <div>
      <p>Players: {"" + players}</p>
      <Game playerData={playerData} sendInput={sendPlayerInput} /> 
    </div>
  );
}

export default App;
