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
      <div className="left_wrapper">
        <div className="join_room">
          <div class="nes-container is-rounded is-dark">
            <h1>Welcome to CodeLegend</h1>
            <p>You can either create new game room and share room id with your friend</p>
            <button type="button" class="nes-btn is-primary" onClick={createNewRoom}>
              Create Room
            </button>{" "}
            {roomId !== "" ? <span class="nes-text is-success">Room ID: {roomId}</span> : ""}
            <br /> <br />
            <p>
              {roomId !== ""
                ? "Share this ID with your friend. Game will start when 2nd player joins."
                : "Or join room by typing id below"}
            </p>
            {roomId !== "" ? (
              ""
            ) : (
              <>
                <form onSubmit={joinRoom} class="form-inline">
                  <input
                    type="text"
                    id="room_id"
                    name="room_id"
                    className="nes-input"
                    placeholder="Room Id"
                  />
                  <button className="nes-btn is-success" type="submit">
                    Join Room
                  </button>
                </form>
                <br />
                <p>{roomConnection}</p>
              </>
            )}
          </div>
        </div>

        <div className="game_rules">
          <div class="nes-container is-rounded is-dark">
            <p>Rules</p>
            <small>
              Please play good. JavaScript (JS) is a lightweight, interpreted, or just-in-time
              compiled programming language with first-class functions. While it is most well-known
              as the scripting
            </small>
            <br />
            <br />
            <span class="nes-text is-success">Easy Maps Are Green</span> <br />
            <span class="nes-text is-warning">Medium Maps Are Yellow</span> <br />
            <span class="nes-text is-error">Medium Maps Are Red</span>
            <br />
            <br />
            <section class="icon-list">
              <i class="nes-icon trophy is-med"></i>
              You can win this
              <br />
              <i class="nes-icon coin is-med"></i>
              And also you can win this
              <br />
            </section>
          </div>
        </div>
      </div>

      <div className="choose_map">
        <Outlet />
      </div>
    </div>
  );
}

export default Lobby;
