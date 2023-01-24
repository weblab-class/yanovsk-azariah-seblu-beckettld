import React, { useState, useEffect } from "react";
import Game from "./pages/Game.js";
import io from "socket.io-client";
import Lobby from "./pages/Lobby";

/**
 * Define the "App" component
 */

const socket = io();

const App = () => {
  const [playerData, setPlayerData] = useState({});
  const [playerNumber, setPlayerNumber] = useState(0);
  const [roomId, setRoomId] = useState("");
  const [isActive, setActive] = useState(true);
  const [code, setCode] = useState();

  const [tower, setTower] = useState(0);
  const [IDEstatus, setIDEStatus] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
    });
    // return () => {
    //   socket.off("connect");
    //   socket.off("disconnect");
    // };
  }, []);

  // socket.on("updateFromServer", (data) => {
  //   setPlayerData(data);
  // });

  // const fromClientToServer = (childdata) => {
  //   socket.emit("updateFromClient", childdata);
  // };

  // const createNewRoom = () => {
  //   socket.emit("newRoom");
  // };

  // const joinRoom = (room_id) => {
  //   console.log("join room called", room_id);
  //   socket.emit("joinRoom", room_id);
  // };

  // socket.on("init", (number) => {
  //   console.log("HIT");
  //   setPlayerNumber(number);
  // });

  // useEffect(() => {
  //   if (playerNumber === 2) {
  //     setActive(true);
  //   }
  // }, [playerNumber]);

  // socket.on("roomId", (id) => {
  //   setRoomId(id);
  // });

  return (
    <div>
      {isActive ? (
        <>
          {/* <h1>Game Started</h1>
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
          </div> */}
          <Game
          // playerData={playerData}
          // fromClientToServer={fromClientToServer}
          // toggleIDE={toggleIDE}
          // tower={tower}
          // IDEstatus={IDEstatus}
          />
        </>
      ) : (
        <Lobby createNewRoom={createNewRoom} roomId={roomId} joinRoom={joinRoom} />
      )}
    </div>
  );
};

export default App;
