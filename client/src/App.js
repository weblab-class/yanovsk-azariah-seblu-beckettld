import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import { get, post } from "./utilities.js";
import Game from "./Game";
import io from "socket.io-client";

const socket = io("http://localhost:9000");

function App() {
  const [players, setPlayers] = useState(null);

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
  const sendPlayerInput = (childdata) => {
    socket.emit("update", childdata);
  };
  // const socketSend = () => {};

  return (
    <div>
      <p>Players: {"" + players}</p>
      <Game sendInput={sendPlayerInput} />
    </div>
  );
}

export default App;
