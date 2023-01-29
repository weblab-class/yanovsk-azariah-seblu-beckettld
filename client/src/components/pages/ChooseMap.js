import React, { useContext, useState, useEffect } from "react";
import { SocketContext } from "../context/socket.js";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Map from "../assets/tile4.gif";

const ChooseMap = () => {
  const socket = useContext(SocketContext);
  const [mapSelection, setMapSelection] = useState(false);
  const [spriteSelection, setSpriteSelection] = useState(false);
  const [submissionMade, setSubmissionMade] = useState(false);

  //something like create new game
  const handleMapSelection = (map_id) => {
    setMapSelection(map_id);
  };

  const handleSpriteSelection = (sprite_id) => {
    setSpriteSelection(sprite_id);
  };

  const handleSubmitSelections = () => {
    setSubmissionMade(true);
    socket.emit("initGameState", { mapSelection, spriteSelection });
  };
  return (
    <div class="nes-container is-rounded is-dark">
      <p>Please Choose Map</p>

      <div className="map_tiles_wrapper">
        <Card className="map_tile">
          <Card.Img src={Map} onClick={() => handleMapSelection(1)} />
          <Card.Title class="nes-text is-success">Winter</Card.Title>
        </Card>
        <Card className="map_tile">
          <Card.Img variant="top" src={Map} onClick={() => handleMapSelection(2)} />
          <Card.Title class="nes-text is-success">Sahara</Card.Title>
        </Card>
        <Card className="map_tile">
          <Card.Img variant="top" src={Map} onClick={() => handleMapSelection(2)} />
        </Card>
      </div>

      {mapSelection ? "Map " + mapSelection + " chosen" : ""}
      <p>Please Choose Sprite</p>
      <button onClick={() => handleSpriteSelection(1)}>Sprite 1</button>
      <button onClick={() => handleSpriteSelection(2)}>Sprite 2</button>
      <button onClick={() => handleSpriteSelection(3)}>Sprite 3</button>
      {spriteSelection ? "Sprite " + spriteSelection + " chosen" : ""}
      <p></p>
      <>
        {mapSelection && spriteSelection ? (
          <>
            {submissionMade ? (
              "Submission made. Waiting for another player"
            ) : (
              <button onClick={handleSubmitSelections}>Submit Selections</button>
            )}
          </>
        ) : (
          ""
        )}
      </>
    </div>
  );
};

export default ChooseMap;
