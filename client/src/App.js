import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import Game from "./Game";
import io from "socket.io-client";

const socket = io("http://localhost:9000");

function App() {
  const [playerData, setPlayerData] = useState({});
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [playerNumber, setPlayerNumber] = useState(0);
  const [roomId, setRoomId] = useState("No room id");

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
    setLoggedIn(true);
  });
  socket.on("roomId", (id) => {
    setRoomId(id);
  });

  return (
    <div>
      <p>{"Players: " + Object.entries(playerData) + " Room Id: " + roomId}</p>
      {isLoggedIn ? (
        <Game playerData={playerData} fromClientToServer={fromClientToServer} />
      ) : (
        <button onClick={createNewRoom}>Create new room</button>
      )}
    </div>
  );
}

export default App;
