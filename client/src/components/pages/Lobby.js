import React, { useContext, useState, useEffect } from "react";
import { SocketContext } from "../context/socket.js";
import { useNavigate } from "react-router-dom";

function Lobby(props) {
  const socket = useContext(SocketContext);
  const [roomConnection, setRoomConnection] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.room_id.value);
    socket.emit("joinRoom", e.target.room_id.value);
  };

  const createNewRoom = () => {
    socket.emit("newRoom");
  };

  useEffect(() => {
    socket.on("init", (number) => {
      if (number == 2) {
        console.log("here");
        navigate("/game");
      }
    });

    socket.on("assignedRoomId", (id) => {
      setRoomId(id);
    });

    socket.on("badConnection", (reason) => {
      setRoomConnection(reason);
    });
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
          <form onSubmit={handleSubmit}>
            <input type="text" id="room_id" name="room_id" placeholder="Room Id" />
            <button type="submit">Submit</button>
          </form>
          <p>{roomConnection}</p>
        </>
      )}
    </div>
  );
}

export default Lobby;
