import "./App.css";
import React, { useContext, useState, useEffect } from "react";
import { SocketContext } from "../context/socket.js";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import clickSound from "../assets/sounds/click.mp3";

function Lobby(props) {
  const socket = useContext(SocketContext);
  const [roomConnection, setRoomConnection] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const click = new Audio(clickSound);

  const joinRoom = (e) => {
    click.play();
    e.preventDefault();
    socket.emit("joinRoom", e.target.room_id.value);
  };

  const createNewRoom = () => {
    click.play();
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
              {roomId !== "" ? (
                <>
                  <br />
                  <p>
                    Share this ID with your friend. When the second player joins the room you will
                    be able to pick a map and sprite.
                  </p>
                </>
              ) : (
                "Or join room by typing id below"
              )}
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
            <div>
              <p>
                <u>Controls</u>
              </p>
              <p style={{ fontSize: "13px" }}>
                Use Arrow keys for movement
                <br /> Use Enter key for interaction
              </p>
              <p>
                <u>Maps</u>
              </p>
              <div style={{ lineHeight: "5px" }}>
                <p className="nes-text is-success" style={{ fontSize: "13px" }}>
                  Green maps are easy (3 problems)
                </p>
                <p className="nes-text is-warning" style={{ fontSize: "13px" }}>
                  {" "}
                  Yellow maps are medium (4)
                </p>
                <p className="nes-text is-error" style={{ fontSize: "13px" }}>
                  {" "}
                  Red maps are hard (5)
                </p>
              </div>
              <p style={{ fontSize: "13px" }}>
                If you and 2nd player choose different maps, then game map is randomly selected from
                your picks.
              </p>
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
