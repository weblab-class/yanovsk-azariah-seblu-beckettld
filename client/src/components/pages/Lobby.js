import React from "react";

function Lobby(props) {
  const handleSubmit = (e) => {
    e.preventDefault();
    props.joinRoom(e.target.room_id.value);
  };
  return (
    <div>
      <h1>Welcome to CodeLegend</h1>
      <button onClick={(e) => props.createNewRoom()}>Create Room</button>

      <p>{props.roomId !== "" ? "Room ID: " + props.roomId : ""}</p>
      <p>
        {props.roomId !== ""
          ? "Share this ID with your friend. Game will start when 2nd player joins."
          : ""}
      </p>
      {props.roomId !== "" ? (
        ""
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="text" id="room_id" name="room_id" placeholder="Room Id" />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}

export default Lobby;
