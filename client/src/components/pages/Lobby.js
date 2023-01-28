import React, { useContext, useState, useEffect } from "react";
import { SocketContext } from "../context/socket.js";
import { useNavigate, Outlet } from "react-router-dom";
import ChooseMap from "./ChooseMap.js";

function Lobby(props) {
  const socket = useContext(SocketContext);
  const [roomConnection, setRoomConnection] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const joinRoom = (e) => {
    e.preventDefault();
    socket.emit("joinRoom", e.target.room_id.value);
  };

  const createNewRoom = () => {
    socket.emit("newRoom");
  };

  useEffect(() => {
    socket.on("startGame", (map_id) => {
      navigate("/game");
    });

    socket.on("newPlayerInRoom", (number) => {
      if (number == 2) {
        navigate("/lobby/choosemap");
      }
    });

    socket.on("assignedRoomId", (id) => {
      setRoomId(id);
    });

    socket.on("badConnection", (reason) => {
      setRoomConnection(reason);
    });

    return () => {
      socket.off("joinRoom");
      socket.off("newRoom");
      socket.off("startGame");
      socket.off("assignedRoomId");
      socket.off("badConnection");
    };
  }, []);

  return (
    <div>
      <h1>Welcome to CodeLegend</h1>
      <p>You can either create new room or joining existing one</p>
      <button onClick={createNewRoom}>Create Room</button>

      <p>{roomId !== "" ? "Room ID: " + roomId : ""}</p>
      <p>
        {roomId !== ""
          ? "Share this ID with your friend. Game will start when 2nd player joins."
          : ""}
      </p>
      {roomId !== "" ? (
        ""
      ) : (
        <>
          <form onSubmit={joinRoom}>
            <input type="text" id="room_id" name="room_id" placeholder="Room Id" />
            <button type="submit">Submit</button>
          </form>
          <p>{roomConnection}</p>
        </>
      )}

      <Outlet />
    </div>
  );
}

export default Lobby;
