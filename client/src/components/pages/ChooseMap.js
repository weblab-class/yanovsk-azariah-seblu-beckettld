import React, { useContext, useState, useEffect } from "react";
import { SocketContext } from "../context/socket.js";
import Card from "react-bootstrap/Card";
import Map from "../assets/tile4.gif";
import { sprites } from "./data.js";

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
    <div className="nes-container is-rounded is-dark">
      {mapSelection ? "Map " + mapSelection + " chosen" : "Make a map selection"}
      <br />
      <br />

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
          <Card.Img variant="top" src={Map} onClick={() => handleMapSelection(3)} />
          <Card.Title class="nes-text is-success">Harvard</Card.Title>
        </Card>
        <Card className="map_tile">
          <Card.Img variant="top" src={Map} onClick={() => handleMapSelection(1)} />
          <Card.Title class="nes-text is-warning">Atlantis</Card.Title>
        </Card>
      </div>
      <div className="map_tiles_wrapper">
        <Card className="map_tile">
          <Card.Img src={Map} onClick={() => handleMapSelection(1)} />
          <Card.Title class="nes-text is-warning">Normandy</Card.Title>
        </Card>
        <Card className="map_tile">
          <Card.Img variant="top" src={Map} onClick={() => handleMapSelection(2)} />
          <Card.Title class="nes-text is-error">Kyiv</Card.Title>
        </Card>
        <Card className="map_tile">
          <Card.Img variant="top" src={Map} onClick={() => handleMapSelection(3)} />
          <Card.Title class="nes-text is-error">Maryland</Card.Title>
        </Card>
        <Card className="map_tile">
          <Card.Img variant="top" src={Map} onClick={() => handleMapSelection(1)} />
          <Card.Title class="nes-text is-error">MIT</Card.Title>
        </Card>
      </div>
      <br />
      {spriteSelection ? "Sprite " + spriteSelection + " chosen" : "Make a Sprite Selection"}
      <br />
      <br />

      <div className="map_tiles_wrapper">
        <Card className="sprite_tile">
          <Card.Img
            className="sprite_img"
            src={sprites[4]}
            onClick={() => handleSpriteSelection(1)}
          />
          <Card.Title>Batman</Card.Title>
        </Card>
        <Card className="sprite_tile">
          <Card.Img
            className="sprite_img"
            src={sprites[5]}
            onClick={() => handleSpriteSelection(2)}
          />
          <Card.Title>Turtle</Card.Title>
        </Card>
        <Card className="sprite_tile">
          <Card.Img
            className="sprite_img"
            src={sprites[6]}
            onClick={() => handleSpriteSelection(3)}
          />
          <Card.Title>Dude</Card.Title>
        </Card>
        <Card className="sprite_tile">
          <Card.Img
            className="sprite_img"
            src={sprites[2]}
            onClick={() => handleSpriteSelection(4)}
          />
          <Card.Title>Flesh</Card.Title>
        </Card>
        <Card className="sprite_tile">
          <Card.Img
            className="sprite_img"
            src={sprites[8]}
            onClick={() => handleSpriteSelection(5)}
          />
          <Card.Title>Spider</Card.Title>
        </Card>
      </div>

      <>
        <br />
        <br />
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
