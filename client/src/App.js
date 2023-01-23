import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import Game from "./Game";
import io from "socket.io-client";
import Lobby from "./components/Lobby";

const socket = io("http://localhost:9000");

function App() {
  const [playerData, setPlayerData] = useState({});
  const [playerNumber, setPlayerNumber] = useState(0);
  const [roomId, setRoomId] = useState("");
  const [isActive, setActive] = useState(false);

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
          <h1>Game Started</h1>
          <Game
            playerData={playerData}
            fromClientToServer={fromClientToServer}
          />
        </>
      ) : (
        <Lobby
          createNewRoom={createNewRoom}
          roomId={roomId}
          joinRoom={joinRoom}
        />
      )}
    </div>
  );
}

export default App;
