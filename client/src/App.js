import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import { get, post } from "./utilities.js";
import Game from "./Game";
import io from "socket.io-client";

const socket = io("http://localhost:9000");

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [coordinates, setCoordinates] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  //need function to get players coordianted from canvas and emit to server
  const sendPlayerInput = (childdata) => {
    socket.emit("update", childdata);
  };

  // const socketSend = () => {};

  return (
    <div>
      <Game sendInput={sendPlayerInput} />
    </div>
  );
}

export default App;
