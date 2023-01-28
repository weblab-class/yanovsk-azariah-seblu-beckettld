import "./App.css";
import React, { useContext, useState, useEffect } from "react";
import { SocketContext } from "../context/socket.js";
import { useNavigate, Outlet } from "react-router-dom";

function Lobby(props) {
  const socket = useContext(SocketContext);
  const [roomConnection, setRoomConnection] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const [secondPlayerJoined, setSecondPlayerJoined] = useState(false);

  const joinRoom = (e) => {
    e.preventDefault();
    socket.emit("joinRoom", e.target.room_id.value);
  };

  const createNewRoom = () => {
    socket.emit("newRoom");
  };

  useEffect(() => {
    socket.on("startGame", (map_id) => {
      navigate("/game", { state: { map_id: map_id } });
    });

    socket.on("newPlayerInRoom", (number) => {
      if (number == 2) {
        setSecondPlayerJoined(true);
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
    <div className="lobby_wrapper">
      <div className="join_room">
        <div class="nes-container is-rounded is-dark">
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
        </div>
      </div>
      <div className="choose_map">
        {secondPlayerJoined ? (
          ""
        ) : (
          <section class="nes-container is-dark">
            <section class="message-list">
              <section class="message -left"></section>

              <section class="message -right">
                <div class="nes-balloon from-right is-dark">
                  <p>Good morning. Thou hast had a good night's sleep, I hope.</p>
                </div>
                <i class="nes-bcrikko"></i>
              </section>
            </section>
          </section>
        )}

        <Outlet />
      </div>
    </div>
  );
}

export default Lobby;
