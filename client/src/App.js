import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import Game from "./Game";
import io from "socket.io-client";
import Lobby from "./components/Lobby";

const socket = io("http://localhost:9000");

function App() {
  const [playerData, setPlayerData] = useState({});
  const [isActiveGame, setActiveGame] = useState(false);
  const [playerNumber, setPlayerNumber] = useState(0);
  const [roomId, setRoomId] = useState("");

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

  const createNewRoom = () => {
    socket.emit("newRoom");
  };

  socket.on("init", (number) => {
    setPlayerNumber(number);
  });

  socket.on("roomId", (id) => {
    setRoomId(id);
  });

  return (
    <div>
      <Lobby createNewRoom={createNewRoom} roomId={roomId}></Lobby>
      {isActiveGame ? (
        <Game playerData={playerData} fromClientToServer={fromClientToServer} />
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default App;
