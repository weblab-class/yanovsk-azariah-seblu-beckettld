import React from "react";

function Lobby(props) {
  return (
    <div>
      <h1>Welcome to CodeLegend</h1>
      <button onClick={(e) => props.createNewRoom()}>Create Room</button>

      <p>{props.roomId !== "" ? "Room ID:" + props.roomId : ""}</p>
      <p>
        {props.roomId !== ""
          ? "Share this ID with your friend. Game will start when 2nd player joins."
          : ""}
      </p>
      {props.roomId !== "" ? (
        ""
      ) : (
        <form>
          <input type="text" name="name" placeholder="Enter Room Code" />
          <input type="submit" value="Join Room" />
        </form>
      )}
    </div>
  );
}

export default Lobby;
