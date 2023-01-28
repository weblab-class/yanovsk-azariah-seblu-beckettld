import React, { useContext, useState, useEffect } from "react";
import { SocketContext } from "../context/socket.js";

const ChooseMap = () => {
  const socket = useContext(SocketContext);
  const [mapSelection, setMapSelection] = useState(false);
  const [spriteSelection, setSpriteSelection] = useState(false);

  //something like create new game
  const handleMapSelection = (map_id) => {
    setMapSelection(map_id);
  };

  const handleSpriteSelection = (sprite_id) => {
    setSpriteSelection(sprite_id);
  };

  const handleSubmitSelections = () => {
    socket.emit("initGameState", { mapSelection, spriteSelection });
  };
  return (
    <div>
      <p>Please Choose Map</p>
      <button onClick={() => handleMapSelection(1)}>Map 1</button>
      <button onClick={() => handleMapSelection(2)}>Map 2</button>
      <button onClick={() => handleMapSelection(3)}>Map 3</button>
      {mapSelection ? "Map " + mapSelection + " chosen" : ""}
      <p>Please Choose Sprite</p>
      <button onClick={() => handleSpriteSelection(1)}>Sprite 1</button>
      <button onClick={() => handleSpriteSelection(2)}>Sprite 2</button>
      <button onClick={() => handleSpriteSelection(3)}>Sprite 3</button>
      {spriteSelection ? "Sprite " + spriteSelection + " chosen" : ""}
      <p></p>
      <>
        {mapSelection && spriteSelection ? (
          <button onClick={handleSubmitSelections}>Submit Selections</button>
        ) : (
          ""
        )}
      </>
    </div>
  );
};

export default ChooseMap;
