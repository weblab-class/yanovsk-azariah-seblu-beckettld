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
            <p>Rules</p>
            <small>
              Please play good. JavaScript (JS) is a lightweight, interpreted, or just-in-time
              compiled programming language with first-class functions. While it is most well-known
              as the scripting
            </small>
            <br />
            <br />
            <span className="nes-text is-success">Easy Maps Are Green</span> <br />
            <span className="nes-text is-warning">Medium Maps Are Yellow</span> <br />
            <span className="nes-text is-error">Medium Maps Are Red</span>
            <br />
            <br />
            <section className="icon-list">
              <i className="nes-icon trophy is-med"></i>
              You can win this
              <br />
              <i className="nes-icon coin is-med"></i>
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
