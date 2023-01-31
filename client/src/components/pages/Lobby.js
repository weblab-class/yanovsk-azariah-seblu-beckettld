import "./App.css";
import React, { useContext, useState, useEffect } from "react";
import { SocketContext } from "../context/socket.js";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

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
    socket.on("startGame", (map_id, data) => {
      let opp_name;
      for (const [key, value] of Object.entries(data)) {
        if (key !== socket.id) {
          opp_name = value.user_name;
        }
      }
      navigate("/game", {
        state: { map_id: map_id, my_name: data[socket.id].user_name, opp_name: opp_name },
      });
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
    <div className="lobby_wrapper">
      <div className="left_wrapper">
        <div className="join_room">
          <div className="nes-container is-rounded is-dark">
            <h1>Welcome to CodeLegend</h1>
            <p>You can either create new game room and share room id with your friend</p>
            <button type="button" className="nes-btn is-primary" onClick={createNewRoom}>
              Create Room
            </button>{" "}
            {roomId !== "" ? <span className="nes-text is-success">Room ID: {roomId}</span> : ""}
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
                <form onSubmit={joinRoom} className="form-inline">
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
          <div className="nes-container is-rounded is-dark">
            <div className="rule_text">
              <p>Controls</p>
              <small>
                Movement - Arrow keys <br /> Interact - Enter
              </small>
              <br />
              <br />
              <p>Map Difficulties</p>
              <span className="nes-text is-success">Green - Easy</span> <br />
              <span className="nes-text is-warning">Yellow - Medium</span> <br />
              <span className="nes-text is-error">Red - Hard</span>
              <br />
              <i className="nes-icon trophy is-med"></i>
              Become a Legend
              <i className="nes-icon trophy is-med"></i>
            </div>
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
